from fastapi import APIRouter, HTTPException, Request
from app.services.yaml_service import load_sources, save_source_to_yaml
from app.services.source_validator import (
    validate_database_source,
    validate_csv_source,
    validate_json_source,
    validate_api_source,
)

source_router = APIRouter()

@source_router.get("/")
async def get_sources():
    """Retrieve all sources from the YAML file."""
    try:
        config = load_sources()
        return {"sources": config.get("sources", [])}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load sources: {str(e)}")


@source_router.post("/")
async def add_source(request: Request):
    """Add a new source."""
    try:
        new_source = await request.json()

        # Validate based on type
        source_type = new_source.get("type")
        if source_type == "database":
            validate_database_source(new_source)
        elif source_type == "csv":
            validate_csv_source(new_source)
        elif source_type == "json":
            validate_json_source(new_source)
        elif source_type == "api":
            validate_api_source(new_source)
        else:
            raise HTTPException(status_code=400, detail="Unsupported source type.")

        save_source_to_yaml(new_source)
        return {"message": "Source added successfully."}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error adding source: {str(e)}")


@source_router.delete("/")
async def delete_source(name: str):
    """Delete a source by name."""
    try:
        config = load_sources()
        sources = config.get("sources", [])
        updated_sources = [s for s in sources if s.get("name") != name]

        if len(updated_sources) == len(sources):
            raise HTTPException(status_code=404, detail="Source not found")

        config["sources"] = updated_sources
        save_source_to_yaml(config, overwrite=True)
        return {"message": "Source deleted successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting source: {str(e)}")
