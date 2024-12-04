from pydantic import BaseModel, Field, Dict, Any, List
from typing import Optional


class CSVSource(BaseModel):
    name: str = Field(..., description="Unique name for the source")
    type: str = Field("csv", description="Type of the source")
    file_path: str = Field(..., description="Path to the CSV file")
    delimiter: Optional[str] = Field(",", description="Delimiter used in the CSV file")
    encoding: Optional[str] = Field("utf-8", description="File encoding")


class JSONSource(BaseModel):
    name: str = Field(..., description="Unique name for the source")
    type: str = Field("json", description="Type of the source")
    file_path: str = Field(..., description="Path to the JSON file")
    encoding: Optional[str] = Field("utf-8", description="File encoding")


class APISource(BaseModel):
    name: str = Field(..., description="Unique name for the source")
    type: str = Field("api", description="Type of the source")
    url: str = Field(..., description="API endpoint URL")
    headers: Optional[Dict[str, str]] = Field(default={}, description="Request headers")
    params: Optional[Dict[str, Any]] = Field(default={}, description="Query parameters")


class DatabaseSource(BaseModel):
    name: str = Field(..., description="Unique name for the source")
    type: str = Field("database", description="Type of the source")
    db_type: str = Field(..., description="Database type (e.g., mysql, postgresql, mongodb)")
    host: str = Field(..., description="Database host")
    port: int = Field(..., description="Database port")
    user: str = Field(..., description="Database user (e.g., 'user' for PostgreSQL)")
    password: str = Field(..., description="Database password")
    db_name: str = Field(..., description="Database name")
    query: Optional[str] = Field(None, description="SQL query or MongoDB filter")
    tables: Optional[List[str]] = Field(
        default=None, description="List of tables to fetch if query is not provided"
    )


