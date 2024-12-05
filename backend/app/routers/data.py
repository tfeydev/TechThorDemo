from fastapi import APIRouter, HTTPException
from services.data_services import DataService

router = APIRouter()
data_service = DataService()


@router.get("/preview/{source_name}")
def preview_data(source_name: str):
    """
    Preview the first 10 rows of a source by name.
    """
    try:
        source = data_service.get_source_by_name(source_name)
        source_type = source["type"]

        if source_type == "csv":
            return data_service.get_csv_preview(source_name)
        elif source_type == "json":
            return data_service.get_json_preview(source_name)
        elif source_type == "api":
            return data_service.get_api_preview(source_name)
        elif source_type == "database":
            return data_service.get_database_preview(source_name)
        else:
            raise ValueError(f"Unsupported source type: {source_type}")
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except FileNotFoundError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
