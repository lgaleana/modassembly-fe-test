from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import httpx

app = FastAPI()

# Disable CORS. Do not remove this for full-stack development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Models
class ArchitectureRequest(BaseModel):
    app_name: str
    system_description: str

class ArchitectureComponent(BaseModel):
    type: str
    name: str
    purpose: str
    uses: List[str]
    pypi_packages: List[str]
    is_endpoint: bool

class ArchitectureResponse(BaseModel):
    architecture: List[ArchitectureComponent]
    external_infrastructure: List[str]

ARCHITECTURE_SERVICE_URL = "http://34.135.155.158:8000/create_architecture"

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}

@app.post("/api/architecture", response_model=ArchitectureResponse)
async def create_architecture(request: ArchitectureRequest):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                ARCHITECTURE_SERVICE_URL,
                json=request.model_dump()
            )
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=response.status_code,
                    detail="Error from architecture service"
                )
                
            return response.json()
    except httpx.RequestError:
        raise HTTPException(
            status_code=503,
            detail="Architecture service unavailable"
        )
