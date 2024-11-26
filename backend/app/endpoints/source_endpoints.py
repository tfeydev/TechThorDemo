import logging
from fastapi import APIRouter, HTTPException, Request
from app.services.yaml_service import load_sources, save_source_to_yaml
from app.services.source_validator import (
    validate_database_source,
    validate_csv_source,
    validate_json_source,
    validate_api_source,
)

source_router = APIRouter()
logger = logging.getLogger("source_endpoints")

@source_router.get("/")
async def get_sources():
    """Retrieve all sources from the YAML file."""
    try:
        config = load_sources()
        logger.info("Successfully retrieved sources.")
        return {"sources": config.get("sources", [])}
    except Exception as e:
        logger.error(f"Failed to load sources: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to load sources: {str(e)}")


@source_router.post("/")
async def add_source(request: Request):
    """Add a new source."""
    try:
        new_source = await request.json()
        logger.info(f"Adding new source: {new_source}")

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
            logger.warning(f"Unsupported source type: {source_type}")
            raise HTTPException(status_code=400, detail="Unsupported source type.")

        save_source_to_yaml(new_source)
        logger.info("Source added successfully.")
        return {"message": "Source added successfully."}
    except Exception as e:
        logger.error(f"Error adding source: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Error processing source: {str(e)}")
