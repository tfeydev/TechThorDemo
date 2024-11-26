from fastapi import APIRouter, HTTPException
from app.services.yaml_service import load_sources
from app.services.data_processor import process_source

data_router = APIRouter()

@data_router.get("/")
async def load_data():
    """Load data for all sources."""
    try:
        config = load_sources()
        sources = config.get("sources", [])
        processed_data = {source.get("name"): await process_source(source) for source in sources}
        return {"data": processed_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading data: {str(e)}")
