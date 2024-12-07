from fastapi import APIRouter, HTTPException
from services.data_services import DataService


router = APIRouter()
data_service = DataService()


@router.get("/preview/{source_name}")
def preview_data(source_name: str):
    """
    Preview the first 10 rows of a source by name.
    """
    data_service.reload_config()
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

@router.get("/status")
def get_status():
    """
    Fetch source statuses dynamically from the config.yaml file.
    """
    try:
        # Reload configuration to get the latest sources
        data_service.reload_config()
        sources = data_service.get_all_sources()  # Assume this returns a list of sources from config.yaml

        # Check availability and return statuses
        statuses = []
        for source in sources:
            source_status = data_service.check_source_availability(source)
            data_status = data_service.check_data_availability(source)
            statuses.append({
                "name": source["name"],
                "type": source["type"],
                "source_status": source_status,
                "data_status": data_status,
            })

        return statuses
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
