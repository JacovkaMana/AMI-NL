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

HUGGING_FACE_API_URL = (
    "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev"
)
HUGGING_FACE_API_KEY = os.getenv("HUGGING_FACE_API_KEY")
MISTRAL_KEY = os.getenv("MISTRAL_KEY")

headers = {"Authorization": f"Bearer {HUGGING_FACE_API_KEY}"}
mistral_headers = {"Authorization": f"Bearer {MISTRAL_KEY}"}


@router.post("/enhance")
async def enhance_text(
    request: ImageGenerationRequest,
) -> str:
    mistral_url = "https://api.mistral.ai/v1/chat/completions"

    # Craft the system and user messages for better prompt enhancement
    messages = [
        {
            "role": "system",
            "content": "You are a visual description expert. Enhance this character description with key visual details in 2-3 concise sentences.",
        },
        {
            "role": "user",
            "content": f"Describe this character's key visual features in 2-3 sentences: {request.prompt}",
        },
    ]

    payload = {
        "model": "mistral-tiny",
        "messages": messages,
        "max_tokens": 150,
        "temperature": 0.7,
    }

    response = requests.post(mistral_url, headers=mistral_headers, json=payload)

    if response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to enhance prompt: {response.text}",
        )

    try:
        # Extract the enhanced text from the Mistral API response
        enhanced_prompt = response.json()["choices"][0]["message"]["content"]
        return JSONResponse(
            {
                "original_prompt": request.prompt,
                "enhanced_prompt": enhanced_prompt.strip(),
            }
        )
    except (KeyError, IndexError) as e:
        print(f"Error parsing Mistral API response: {e}")
        return JSONResponse(
            {"original_prompt": request.prompt, "enhanced_prompt": request.prompt}
        )


# async def enhance_prompt(original_prompt: str) -> str:
#     stmt = """
#     Layer 1 (background): depict a fantasy background illustration, with a location and atmosphere fitting the character's description.
#     Layer 2 (foreground): main focus. a 2d digital art of a dnd character. Bold lineart, with sublte shading and flat colors, a highly detailed and clean stylised graphic novel illustration. Upper half body close-up portrait. Character's description:
#     """
#     return stmt + original_prompt


@router.post("/generate")
async def generate_image(
    request: ImageGenerationRequest,
    current_user: User = Depends(get_current_user),
):
    """
    Generate an image using Hugging Face's Stable Diffusion model with enhanced prompt
    """
    try:

        # Add the structural prompt
        # enhanced_prompt = await enhance_prompt(request.prompt)
        enhanced_prompt = request.prompt
        # Make request to Hugging Face API with enhanced prompt
        response = requests.post(
            "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
            headers=headers,
            json={
                "inputs": f"""Layer 1 (background): depict a fantasy background illustration, with a location, palette, 
                            mood and atmosphere fitting the character's description and the same style as the character.\r\n
                            Layer 2 (foreground): I want a stylised 2d upper body shot portrait in a hand-drawn, gritty dark fantasy style, 
                            with bold and strong black ink outlines. Ambient occlusion is always a black shape without variation of oppacity.
                              It uses simple flat shading with distressed textures and muted and earthy colors, somber and atmospheric. 
                              I specifically want a highly stylized, non-photorealistic, comic book illustration style, with minimal detail realism, 
                              like a hand-drawn look. Negative: realism, realistic, digital realism, 3d, hyperrealism, cinematic, glossy, reflective, 
                              smooth shading. Do not generate any text, label, watermark, or artist tag. 
                              Character's description: {enhanced_prompt}""",
                "parameters": {
                    "guidance_scale": 1.0,
                    "num_inference_steps": 4,
                    "seed": 4254,
                },
            },
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
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )
