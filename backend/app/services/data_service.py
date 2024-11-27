from ..services.yaml_service import load_sources, save_sources
from fastapi import HTTPException
from ..models.source_models import Source


def get_all_sources():
    """Retrieve all sources."""
    return load_sources()

def add_source(source: Source):
    """Add a new source."""
    data = load_sources()
    for existing_source in data["sources"]:
        if existing_source["name"] == source.name:
            raise HTTPException(status_code=400, detail="Source with the same name already exists.")
    data["sources"].append(source.dict())
    save_sources(data)

def update_source(updated_source: Source):
    """Update an existing source."""
    data = load_sources()
    for i, existing_source in enumerate(data["sources"]):
        if existing_source["name"] == updated_source.name:
            data["sources"][i] = updated_source.dict()
            save_sources(data)
            return
    raise HTTPException(status_code=404, detail="Source not found.")

def delete_source(source_name: str):
    """Delete a source by name."""
    data = load_sources()
    filtered_sources = [src for src in data["sources"] if src["name"] != source_name]
    if len(filtered_sources) == len(data["sources"]):
        raise HTTPException(status_code=404, detail="Source not found.")
    data["sources"] = filtered_sources
    save_sources(data)
