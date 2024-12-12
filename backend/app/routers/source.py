from fastapi import APIRouter, HTTPException, Query
from services.source_service import SourceService
from services.data_services import DataService

router = APIRouter()
source_service = SourceService()
data_service = DataService()


@router.get("/sources")
async def get_sources(page: int = Query(0, alias="page"), page_size: int = Query(10, alias="page_size")):
    try:
        sources = source_service.get_sources()  # Hole die Quellen über den Service
        start = page * page_size
        end = start + page_size
        total = len(sources)
        paginated_sources = sources[start:end]
        return {"data": paginated_sources, "total": total}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

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
