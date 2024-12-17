from fastapi import APIRouter, HTTPException, Query
from services.source_service import SourceService
from services.data_services import DataService

router = APIRouter()
source_service = SourceService()
data_service = DataService()


@router.get("/sources")
async def get_sources():
    # Hole alle Quellen
    sources = source_service.get_sources()

    return sources

@router.post("/sources")
async def add_source(source: dict):
    """Add a new source."""
    result = source_service.add_source(source)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result

@router.put("/sources/{source_name}")
async def update_source(source_name: str, updated_data: dict):
    """Update an existing source."""
    result = source_service.update_source(source_name, updated_data)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result

@router.delete("/sources/{source_name}")
async def delete_source(source_name: str):
    """Delete an existing source."""
    result = source_service.delete_source(source_name)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result
