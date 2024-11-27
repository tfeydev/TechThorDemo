from models.source_models import Source
from fastapi import HTTPException


def validate_database(source):
    """Validiere die Datenbankverbindung und die Tabellen."""
    connection = source.get("connection", {})
    tables = source.get("tables", [])

    if not connection:
        raise ValueError("Missing database connection details")

    if not tables or not isinstance(tables, list):
        raise ValueError("Tables must be a non-empty list")

    # Beispiel: Überprüfen, ob Tabellen existieren
    for table in tables:
        print(f"Checking table: {table}")
        # Hier kann eine echte Validierung mit einer Datenbankbibliothek erfolgen


def validate_csv(source):
    """Validate CSV source details."""
    if "file_path" not in source or not source["file_path"]:
        raise HTTPException(status_code=400, detail="CSV source must include a valid 'file_path'.")
    # Optionally check if the file exists on the server
    # Example:
    # if not os.path.exists(source["file_path"]):
    #     raise HTTPException(status_code=400, detail="CSV file does not exist.")
