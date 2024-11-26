from fastapi import HTTPException

def validate_database_source(source):
    details = source.get("details", {})
    required_fields = ["host", "port", "user", "password", "dbname", "db_type"]

    for field in required_fields:
        if not details.get(field):
            raise HTTPException(status_code=400, detail=f"Missing database field: {field}")


def validate_csv_source(source):
    if not source.get("file_path"):
        raise HTTPException(status_code=400, detail="File path is required for CSV sources.")


def validate_json_source(source):
    if not source.get("file_path"):
        raise HTTPException(status_code=400, detail="File path is required for JSON sources.")


def validate_api_source(source):
    if not source.get("url"):
        raise HTTPException(status_code=400, detail="URL is required for API sources.")
