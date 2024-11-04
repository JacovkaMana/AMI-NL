from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.responses import JSONResponse
import requests
import os
import uuid
from datetime import datetime
from models.user import User
from ..auth import get_current_user
from typing import Optional
from pydantic import BaseModel


class ImageGenerationRequest(BaseModel):
    prompt: str
    character_id: Optional[str] = None


router = APIRouter(
    prefix="/image-generation",
    tags=["Image Generation"],
    responses={404: {"description": "Not found"}},
)

HUGGING_FACE_API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0"
MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions"
HUGGING_FACE_API_KEY = os.getenv("HUGGING_FACE_API_KEY")
MISTRAL_KEY = os.getenv("MISTRAL_KEY")

headers = {"Authorization": f"Bearer {HUGGING_FACE_API_KEY}"}
mistral_headers = {"Authorization": f"Bearer {MISTRAL_KEY}"}


async def enhance_prompt(original_prompt: str) -> str:
    """
    Enhance the original prompt specifically for Stable Diffusion XL,
    using common trigger words and proper prompt structure
    """
    try:
        response = requests.post(
            MISTRAL_API_URL,
            headers=mistral_headers,
            json={
                "model": "mistral-tiny",
                "messages": [
                    {
                        "role": "system",
                        "content": """You are an expert at creating Stable Diffusion prompts. 
                        Follow these rules strictly:
                        1. Start with the main subject and its key attributes
                        2. Add specific art style keywords (e.g., digital art, oil painting, concept art)
                        3. Include technical aspects (e.g., 8k, ultra detailed, photorealistic)
                        4. Add lighting and atmosphere details (e.g., volumetric lighting, golden hour)
                        5. Use Stable Diffusion trigger words like 'masterpiece', 'highly detailed', 'sharp focus'
                        6. Separate different aspects with commas
                        7. Keep the most important elements at the start of the prompt
                        8. Include camera and shot details if relevant
                        
                        Example format:
                        [main subject], [art style], [technical quality], [lighting], [atmosphere], [additional details], masterpiece, highly detailed""",
                    },
                    {
                        "role": "user",
                        "content": f"Create a Stable Diffusion prompt based on this concept: {original_prompt}",
                    },
                ],
                "temperature": 0.3,  # Lower temperature for more consistent outputs
                "max_tokens": 200,
            },
        )

        if response.status_code != 200:
            print(f"Error enhancing prompt: {response.text}")
            return original_prompt

        enhanced_text = response.json()["choices"][0]["message"]["content"].strip()
        # Add some reliable quality-boosting keywords if they're not already present
        quality_suffix = (
            ", masterpiece, highly detailed, sharp focus, 8k uhd, high quality"
        )
        final_prompt = (
            enhanced_text
            if any(
                keyword in enhanced_text.lower()
                for keyword in ["masterpiece", "8k", "highly detailed"]
            )
            else enhanced_text + quality_suffix
        )

        print(f"Enhanced prompt: {final_prompt}")
        return final_prompt

    except Exception as e:
        print(f"Error enhancing prompt: {str(e)}")
        return original_prompt


@router.post("/generate")
async def generate_image(
    request: ImageGenerationRequest,
    current_user: User = Depends(get_current_user),
):
    """
    Generate an image using Hugging Face's Stable Diffusion model with enhanced prompt
    """
    try:
        # Enhance the original prompt
        enhanced_prompt = await enhance_prompt(request.prompt)

        # Make request to Hugging Face API with enhanced prompt
        response = requests.post(
            HUGGING_FACE_API_URL, headers=headers, json={"inputs": enhanced_prompt}
        )

        if response.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to generate image",
            )

        # Create unique filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"generated_{timestamp}_{uuid.uuid4().hex[:8]}.png"

        # Determine save path based on whether it's for a character
        if request.character_id:
            save_dir = "media/characters"
            relative_path = f"characters/{filename}"
        else:
            save_dir = "media/generated"
            relative_path = f"generated/{filename}"

        # Ensure directory exists
        os.makedirs(save_dir, exist_ok=True)

        # Save the image
        file_path = os.path.join(save_dir, filename)
        with open(file_path, "wb") as f:
            f.write(response.content)

        return JSONResponse(
            {
                "message": "Image generated successfully",
                "image_path": relative_path,
                "original_prompt": request.prompt,
                "enhanced_prompt": enhanced_prompt,
            }
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )
