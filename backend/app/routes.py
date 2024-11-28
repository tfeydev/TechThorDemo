from fastapi import APIRouter, HTTPException, Request
from app.services.data_service import (
    get_sources, 
    add_source, 
    update_source,
    get_source_by_sourcename,
    delete_source_by_sourcename,
    update_source_by_sourcename
)
from app.models.source_models import Source
from app.services.yaml_service import load_sources, save_sources
import logging


router = APIRouter()


@router.get("/get-sources")
async def get_sources():
    """Retrieve all sources."""
    logging.info("Received request to fetch sources.")
    try:
        sources = load_sources()
        logging.info(f"Returning sources: {sources}")
        return {"sources": sources.get("sources", [])}
    except Exception as e:
        logging.error(f"Failed to retrieve sources: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve sources.")

@router.get("/get-source/{source_name}")
async def get_source(source_name: str):
    """
    Retrieve a single source by its name.
    """
    source = get_source_by_sourcename(source_name)
    return {"source": source}
   
@router.put("/update-source/{source_name}")
async def update_source(source_name: str, updated_source: Source):
    """Update an existing source."""
    update_source_by_sourcename(source_name, updated_source)
    return {"message": "Source updated successfully."}

@router.delete("/delete-source/{source_name}")
async def delete_source(source_name: str):
    """Delete a source by name."""
    delete_source_by_sourcename(source_name)
    return {"message": f"Source '{source_name}' deleted successfully."}
