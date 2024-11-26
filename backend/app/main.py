from fastapi import FastAPI
from app.endpoints.source_endpoints import source_router
from app.endpoints.data_endpoints import data_router
from app.services.logging_config import setup_logging

# Initialize Logging
setup_logging()

app = FastAPI(title="TechThor Backend")

app.include_router(source_router, prefix="/sources", tags=["Sources"])
app.include_router(data_router, prefix="/data", tags=["Data"])

@app.get("/")
async def root():
    return {"message": "Welcome to the TechThor Backend"}
