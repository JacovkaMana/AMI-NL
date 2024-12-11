from fastapi import APIRouter, WebSocket, WebSocketDisconnect, status
from typing import Dict, Set
from jose import JWTError, jwt
from core.config import settings
from models.user import User

router = APIRouter()


# WebSocket Authentication
async def get_current_user_ws(websocket: WebSocket) -> User:
    try:
        # Get token from query parameters
        token = websocket.query_params.get("token")
        if not token:
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return None

        # Verify JWT token
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        email: str = payload.get("sub")
        if email is None:
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return None

        # Get user from database
        user = User.nodes.first_or_none(email=email)
        if user is None:
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return None

        return user

    except JWTError:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return None


# Store active connections
class ConnectionManager:
    def __init__(self):
        # Dict to store room_id -> set of websocket connections
        self.active_connections: Dict[str, Set[WebSocket]] = {}
        # Dict to store websocket -> user mapping
        self.socket_user_map: Dict[WebSocket, User] = {}

    async def connect(self, websocket: WebSocket, room_id: str, user: User):
        await websocket.accept()
        if room_id not in self.active_connections:
            self.active_connections[room_id] = set()
        self.active_connections[room_id].add(websocket)
        self.socket_user_map[websocket] = user
        # Notify others that user joined
        await self.broadcast(
            {
                "user": "system",
                "message": f"User {user.email} joined the chat",
                "timestamp": None,
            },
            room_id,
            websocket,
        )

    def disconnect(self, websocket: WebSocket, room_id: str):
        if room_id in self.active_connections:
            self.active_connections[room_id].remove(websocket)
            if len(self.active_connections[room_id]) == 0:
                del self.active_connections[room_id]
        if websocket in self.socket_user_map:
            del self.socket_user_map[websocket]

    async def broadcast(self, message: dict, room_id: str, sender_socket: WebSocket):
        if room_id in self.active_connections:
            for connection in self.active_connections[room_id]:
                if connection != sender_socket:  # Don't send back to sender
                    await connection.send_json(message)


manager = ConnectionManager()


@router.websocket("/ws/chat/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    user = await get_current_user_ws(websocket)
    if not user:
        return

    await manager.connect(websocket, room_id, user)
    try:
        while True:
            data = await websocket.receive_json()
            # Create message format
            message = {
                "user": user.email,
                "message": data.get("message"),
                "timestamp": data.get("timestamp"),
            }
            # Broadcast message to all users in the room
            await manager.broadcast(message, room_id, websocket)
    except WebSocketDisconnect:
        manager.disconnect(websocket, room_id)
        # Notify other users about disconnection
        await manager.broadcast(
            {
                "user": "system",
                "message": f"User {user.email} left the chat",
                "timestamp": None,
            },
            room_id,
            websocket,
        )
