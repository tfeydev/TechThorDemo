from pydantic import BaseModel
from typing import Dict, Any, Optional, List

class Source(BaseModel):
    name: str
    type: str
    url: str
    headers: Dict[str, Any] = {}
    params: Dict[str, Any] = {}
    file_path: Optional[str] = None
    connection: Optional[Dict[str, Any]] = None
    tables: Optional[List[str]] = None
