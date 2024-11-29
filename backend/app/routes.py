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
import os
from app.services.yaml_service import CONFIG_PATH
import yaml

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

@router.post("/data/add-source")
async def add_source(source: Source):
    try:
        # Load existing YAML data or initialize new
        if os.path.exists(CONFIG_PATH):
            with open(CONFIG_PATH, "r") as file:
                data = yaml.safe_load(file) or {"sources": []}
        else:
            data = {"sources": []}

        # Remove empty fields and append the cleaned source
        cleaned_source = source.remove_empty_fields()
        data["sources"].append(cleaned_source)

        # Write the updated data back to YAML with order preserved
        with open(CONFIG_PATH, "w") as file:
            yaml.dump(data, file, default_flow_style=False, sort_keys=False)

        return {"message": "Source added successfully", "source": cleaned_source}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving source: {str(e)}")
    