from fastapi import APIRouter, HTTPException
from app.services.data_service import get_all_sources, add_source, update_source, delete_source
from app.models.source_models import Source
from app.services.yaml_service import load_sources
import logging

router = APIRouter()

@router.get("/get-sources")
async def get_sources():
    """Retrieve all sources from the YAML file."""
    try:
        sources = load_sources()
        return {"sources": sources.get("sources", [])}
    except Exception as e:
        return {"error": f"Failed to retrieve sources: {str(e)}"}

@router.get("/get-source/{source_name}")
async def get_source(source_name: str):
    """Retrieve a specific source by name."""
    try:
        data = load_sources()
        for source in data["sources"]:
            if source["name"] == source_name:
                return source
        raise HTTPException(status_code=404, detail=f"Source '{source_name}' not found.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving source: {str(e)}")    

@router.post("/add-source")
async def add_new_source(source: Source):
    """Add a new source."""
    add_source(source)
    return {"message": "Source added successfully"}

@router.put("/edit-source")
async def edit_source(updated_source: Source):
    """Edit an existing source."""
    try:
        update_source(updated_source)
        return {"message": "Source updated successfully"}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to edit source: {str(e)}")


@router.delete("/delete-source/{source_name}")
async def remove_source(source_name: str):
    """Delete a source by name."""
    try:
        delete_source(source_name)  # Make sure `delete_source` works properly in data_service.py
        return {"message": f"Source {source_name} deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Failed to delete source: {str(e)}")

