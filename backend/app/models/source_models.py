from typing import Optional, Dict, List
from pydantic import BaseModel, Field

class Source(BaseModel):
    name: str
    type: str
    file_path: Optional[str]
    url: Optional[str]
    headers: Optional[Dict[str, str]]
    params: Optional[Dict[str, str]]
    connection: Optional[Dict[str, str]]
    tables: Optional[List[str]]
