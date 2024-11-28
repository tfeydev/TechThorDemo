from fastapi import APIRouter, HTTPException, Request
from app.services.data_service import get_sources, add_source, update_source, delete_source
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
    sources = load_sources().get("sources", [])
    for source in sources:
        if source.get("name") == source_name:
            return {"source": source}
    raise HTTPException(status_code=404, detail="Source not found.")
   
@router.put("/update-source")
async def update_source_endpoint(source_data: Source):
    """Update an existing source."""
    update_source(source_data)
    return {"message": "Source updated successfully."}

@router.delete("/delete-source/{source_name}")
async def remove_source(source_name: str):
    """Delete a source by name."""
    delete_source(source_name)
    return {"message": f"Source '{source_name}' deleted successfully."}
