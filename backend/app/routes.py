from fastapi import APIRouter, HTTPException
from app.services.data_service import get_all_sources, add_source, update_source, delete_source
from app.models.source_models import Source
import logging

router = APIRouter()

@router.get("/source-data")
async def get_source_data():
    """Retrieve all source data."""
    return get_all_sources()

@router.post("/add-source")
async def add_new_source(source: Source):
    """Add a new source."""
    add_source(source)
    return {"message": "Source added successfully"}

@router.put("/update-source")
async def update_existing_source(updated_source: Source):
    """Update an existing source."""
    update_source(updated_source)
    return {"message": "Source updated successfully"}

@router.delete("/delete-source/{source_name}")
async def remove_source(source_name: str):
    """Delete a source by name."""
    logging.info(f"Received request to delete source: {source_name}")
    delete_source(source_name)
    return {"message": f"Source {source_name} deleted successfully"}

