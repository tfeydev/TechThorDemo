from fastapi import HTTPException

def validate_csv_source(source: dict):
    """Validate a CSV source."""
    file_path = source.get("file_path")
    if not file_path:
        raise HTTPException(status_code=400, detail="File path is required for CSV.")
    if not file_path.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Invalid file format. Only .csv files are allowed.")

def validate_json_source(source: dict):
    """Validate a JSON source."""
    file_path = source.get("file_path")
    if not file_path:
        raise HTTPException(status_code=400, detail="File path is required for JSON.")
    if not file_path.endswith(".json"):
        raise HTTPException(status_code=400, detail="Invalid file format. Only .json files are allowed.")

def validate_api_source(source: dict):
    """Validate an API source."""
    url = source.get("url")
    if not url:
        raise HTTPException(status_code=400, detail="URL is required for API sources.")

def validate_database_source(source: dict):
    """Validate a database source."""
    connection = source.get("connection")
    if not connection:
        raise HTTPException(status_code=400, detail="Connection details are required for database sources.")
    required_fields = ["host", "port", "user", "password", "dbname", "db_type"]
    missing_fields = [field for field in required_fields if field not in connection]
    if missing_fields:
        raise HTTPException(
            status_code=400,
            detail=f"Missing fields in connection details: {', '.join(missing_fields)}"
        )
