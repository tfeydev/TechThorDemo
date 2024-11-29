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
    """
    Fetch all sources from the YAML file.
    """
    data = load_sources()  # Assuming this reads from config.yaml
    return {"sources": data.get("sources", [])}

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
    response = update_source_by_sourcename(source_name, updated_source)
    return response

@router.delete("/delete-source/{source_name}")
async def delete_source(source_name: str):
    data = load_sources()
    sources = data.get("sources", [])
    updated_sources = [source for source in sources if source["name"] != source_name]

    if len(sources) == len(updated_sources):
        raise HTTPException(status_code=404, detail=f"Source '{source_name}' not found.")

    data["sources"] = updated_sources
    save_sources(data)
    return {"message": f"Source '{source_name}' deleted successfully."}
