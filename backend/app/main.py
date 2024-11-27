from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.data_routes import data_router
import logging
from app.websockets import ws_router

# Initialize the FastAPI app
app = FastAPI()
logging.info("Starting the TechThor Backend...")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"], # allow_origins=["*"],  # Replace "*" with specific origins if needed (e.g., ["http://localhost:4200"])
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Include the data router
app.include_router(data_router, prefix="/data")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[logging.StreamHandler()],
)

@app.get("/")
async def root():
    return {"message": "Welcome to the TechThor Backend!"}
