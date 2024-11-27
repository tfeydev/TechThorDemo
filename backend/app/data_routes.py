from fastapi import APIRouter, HTTPException, Query, Request
from pydantic import BaseModel
from typing import Optional, List
from app.yaml_service import load_sources, save_source_to_yaml
from app.validators import (
    validate_csv_source,
    validate_json_source,
    validate_api_source,
    validate_database_source,
)
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)

# Pydantic model for a source
class Source(BaseModel):
    name: str
    type: str
    file_path: Optional[str] = None
    connection: Optional[dict] = None
    tables: Optional[List[str]] = None

# FastAPI router
data_router = APIRouter()

@data_router.post("/add-source")
async def add_source(new_source: Source):
    """
    Add a new data source.
    """
    try:
        logging.info(f"Received new source: {new_source.dict()}")

        # Validate based on type
        if new_source.type == "csv":
            validate_csv_source(new_source.dict())
        elif new_source.type == "json":
            validate_json_source(new_source.dict())
        elif new_source.type == "api":
            validate_api_source(new_source.dict())
        elif new_source.type == "database":
            validate_database_source(new_source.dict())
        else:
            raise HTTPException(status_code=400, detail="Unsupported source type.")

        # Save the validated source
        save_source_to_yaml(new_source.dict())

        return {"message": "Source added successfully.", "source": new_source.dict()}
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        logging.error(f"Error adding source: {e}")
        raise HTTPException(status_code=500, detail=f"Error adding source: {str(e)}")


@data_router.get("/get-sources")
async def get_sources():
    """
    Retrieve all sources from the YAML file.
    """
    try:
        sources = load_sources()
        # Unnest the sources array if it is nested
        flat_sources = sources.get("sources", [])
        if isinstance(flat_sources, list) and len(flat_sources) == 1 and isinstance(flat_sources[0], dict):
            flat_sources = flat_sources[0].get("sources", flat_sources)
        return {"sources": flat_sources}
    except Exception as e:
        logging.error(f"Failed to load sources: {e}")
        raise HTTPException(status_code=500, detail="Error loading sources.")
    

@data_router.get("/load/{source_name}")
async def load_data_by_name(source_name: str):
    """
    Load data for a specific source.
    """
    try:
        sources = load_sources().get("sources", [])
        source = next((s for s in sources if s.get("name") == source_name), None)

        if not source:
            raise HTTPException(status_code=404, detail=f"Source '{source_name}' not found.")

        # Load data based on source type (extend this as needed)
        if source["type"] == "csv":
            return load_csv(source["file_path"])
        else:
            return {"message": f"Data loading for type '{source['type']}' is not implemented yet."}
    except Exception as e:
        logging.error(f"Error loading data for source '{source_name}': {e}")
        raise HTTPException(status_code=500, detail=f"Failed to load data: {e}")    


@data_router.delete("/delete-source/{source_name}")
async def delete_source(source_name: str):
    """
    Delete a source by name from the YAML configuration.
    """
    try:
        sources = load_sources().get("sources", [])
        updated_sources = [s for s in sources if s.get("name") != source_name]

        if len(updated_sources) == len(sources):
            raise HTTPException(status_code=404, detail=f"Source '{source_name}' not found.")

        # Save the updated sources
        save_source_to_yaml({"sources": updated_sources}, overwrite=True)
        return {"message": f"Source '{source_name}' deleted successfully."}
    except Exception as e:
        logging.error(f"Error deleting source: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to delete source: {e}")


@data_router.get("/load-data")
async def load_data(page: int = Query(1, ge=1, description="Page number (starting from 1)"),
                    page_size: int = Query(10, ge=1, le=100, description="Number of items per page")):
    """
    Load and paginate data from all sources.
    """
    try:
        sources = load_sources().get("sources", [])
        start = (page - 1) * page_size
        end = start + page_size
        paginated_data = sources[start:end]
        return {
            "page": page,
            "page_size": page_size,
            "total": len(sources),
            "data": paginated_data
        }
    except Exception as e:
        logging.error(f"Error loading data: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to load data: {e}")


@data_router.put("/update-yaml")
async def update_yaml(request: Request):
    """
    Update the YAML file directly.
    """
    try:
        yaml_data = await request.json()
        with open(CONFIG_PATH, "w") as file:
            file.write(yaml_data.get("updatedYaml", ""))
        return {"message": "YAML updated successfully."}
    except Exception as e:
        logging.error(f"Failed to update YAML: {e}")
        raise HTTPException(status_code=500, detail="Failed to update YAML.")
