from typing import Optional, Dict, List
from pydantic import BaseModel, Field

class Source(BaseModel):
    name: str = Field(..., description="Name of the data source")
    type: str = Field(..., description="Type of the data source (csv, json, api, database)")
    file_path: Optional[str] = Field(None, description="File path for CSV or JSON sources")
    url: Optional[str] = Field(None, description="API URL")
    headers: Optional[Dict[str, str]] = Field(None, description="Headers for API sources")
    params: Optional[Dict[str, str]] = Field(None, description="Params for API sources")
    connection: Optional[Dict[str, str]] = Field(None, description="Database connection details")
    tables: Optional[List[str]] = Field(None, description="List of tables for database sources")
