from fastapi import APIRouter, HTTPException, Query, Request
from app.yaml_service import load_sources, save_source_to_yaml
from app.validators import validate_csv_source
import logging

data_router = APIRouter()

@data_router.get("/get-sources")
async def get_sources():
    """Retrieve all sources from the YAML file."""
    try:
        sources = load_sources()
        return {"sources": sources.get("sources", [])}
    except Exception as e:
        logging.error(f"Failed to load sources: {e}")
        raise HTTPException(status_code=500, detail="Error loading sources.")

@data_router.post("/add-source")
async def add_source(request: Request):
    """Add a new source."""
    try:
        new_source = await request.json()
        logging.debug(f"Received new source: {new_source}")

        # Validate source based on type
        source_type = new_source.get("type")
        if source_type == "csv":
            validate_csv_source(new_source)
        elif source_type == "json":
            validate_json_source(new_source)
        elif source_type == "api":
            validate_api_source(new_source)
        elif source_type == "database":
            validate_database_source(new_source)
        else:
            raise HTTPException(status_code=400, detail="Unsupported source type.")

        save_source_to_yaml(new_source)
        return {"message": "Source added successfully."}
    except Exception as e:
        logging.error(f"Error adding source: {e}")
        raise HTTPException(status_code=400, detail=f"Error adding source: {str(e)}")


@data_router.delete("/delete-source/{source_name}")
async def delete_source(source_name: str):
    """Delete a source by name from the YAML configuration."""
    try:
        sources = load_sources()
        sources_list = sources.get("sources", [])
        updated_sources = [s for s in sources_list if s.get("name") != source_name]

        if len(updated_sources) == len(sources_list):
            raise HTTPException(status_code=404, detail="Source not found.")

        save_source_to_yaml({"sources": updated_sources}, overwrite=True)
        return {"message": f"Source '{source_name}' deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete source: {e}")


@data_router.get("/load-data")
async def load_data(page: int = Query(1, ge=1, description="Page number (starting from 1)"),
                    page_size: int = Query(10, ge=1, le=100, description="Number of items per page")):
    """Load and paginate data from all sources."""
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
        raise HTTPException(status_code=500, detail=f"Failed to load data: {e}")
