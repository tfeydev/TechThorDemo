from pydantic import BaseModel
from typing import Dict, Any, Optional, List

class Source(BaseModel):
    name: str  # Unique name for the source
    type: str  # Type of the source: csv, json, api, database
    file_path: Optional[str] = None  # For CSV/JSON sources
    delimiter: Optional[str] = None  # For CSV sources
    url: Optional[str] = None  # For API sources
    headers: Optional[Dict[str, str]] = None  # For API authentication or metadata
    params: Optional[Dict[str, str]] = None  # For API query parameters
    db_type: Optional[str] = None  # e.g., postgresql, mongodb, mysql
    host: Optional[str] = None  # For databases
    port: Optional[int] = None  # For databases
    db_name: Optional[str] = None  # For databases
    username: Optional[str] = None  # For databases
    password: Optional[str] = None  # For databases
    tables: Optional[List[Dict[str, str]]] = None  # List of tables for databases

    def remove_empty_fields(self) -> dict:
        """Remove fields with None or empty values."""
        return {k: v for k, v in self.dict().items() if v not in [None, "", [], {}]}

    class Config:
        schema_csv = {
            "example": {
                "name": "test_csv",
                "type": "csv",
                "file_path": "data/example.csv",
                "delimiter": ","
            }
        }

        schema_json = {
            "example": {
                "name": "test_json",
                "type": "json",
                "file_path": "data/example.json"
            }
        }

        schema_api = {
            "example": {
                "name": "test_csv",
                "type": "json",
                "url": "https://jsonplaceholder.typicode.com/todos",
                "headers": '',
                "params": ''
            }
        }
        