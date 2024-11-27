from fastapi import FastAPI
from app.data_routes import data_router
import logging
from app.websockets import ws_router

# Initialize the FastAPI app
app = FastAPI()
logging.info("Starting the TechThor Backend...")

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
