from fastapi import APIRouter, HTTPException, Request
from app.services.data_service import get_all_sources, add_source, update_source, delete_source
from app.models.source_models import Source
from app.services.yaml_service import load_sources, save_sources
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
    """
    Retrieve a single source by its name.
    """
    sources = load_sources().get("sources", [])
    for source in sources:
        if source.get("name") == source_name:
            return {"source": source}
    raise HTTPException(status_code=404, detail="Source not found.")
   

@router.post("/add-source")
async def add_new_source(source: Source):
    """Add a new source."""
    add_source(source)
    return {"message": "Source added successfully"}


@router.put("/update-source")
async def update_source(source_data: Source, request: Request):
    try:
        logging.info(f"Received update data: {await request.json()}")
        logging.info(f"Validated source data: {source_data}")
        
        sources = load_sources()
        for i, existing_source in enumerate(sources["sources"]):
            if existing_source["name"] == source_data.name:
                sources["sources"][i] = source_data.dict()
                save_sources(sources)
                return {"message": f"Source '{source_data.name}' updated successfully"}
        raise HTTPException(status_code=404, detail=f"Source '{source_data.name}' not found")
    except ValidationError as e:
        logging.error(f"Validation Error: {e}")
        raise HTTPException(status_code=422, detail="Validation Error")
    except Exception as e:
        logging.error(f"Unexpected Error: {e}")
        raise HTTPException(status_code=500, detail="Unexpected Error")
    

@router.delete("/delete-source/{source_name}")
async def delete_source(source_name: str):
    """
    Delete a source by name.
    """
    sources_data = load_sources()
    sources = sources_data.get("sources", [])

    # Filter out the source with the given name
    filtered_sources = [source for source in sources if source.get("name") != source_name]
    
    if len(filtered_sources) == len(sources):
        raise HTTPException(status_code=404, detail=f"Source '{source_name}' not found.")

    sources_data["sources"] = filtered_sources
    save_sources(sources_data)
    return {"message": f"Source '{source_name}' deleted successfully."}

