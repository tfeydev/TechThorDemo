from app.services.yaml_service import load_sources, save_sources
from app.models.source_models import Source
from fastapi import HTTPException
import logging


def get_all_sources():
    """Retrieve all sources."""
    return load_sources()

def add_source(source: Source):
    """Add a new source with validation."""
    data = load_sources()

    # Check for duplicates
    for existing_source in data["sources"]:
        if existing_source["name"] == source.name:
            raise HTTPException(status_code=400, detail="Source with the same name already exists.")

    # Perform validation based on source type
    if source.type == "csv":
        validate_csv(source.dict())  # Validate CSV source
    elif source.type == "json":
        validate_json(source.dict())  # Validate JSON source
    elif source.type == "api":
        validate_api(source.dict())  # Validate API source
    elif source.type == "database":
        validate_database(source.dict())  # Validate database source
    else:
        raise HTTPException(status_code=400, detail="Unsupported source type.")

    # Add the source
    data["sources"].append(source.dict())
    save_sources(data)


def update_source(updated_source: Source):
    """Update an existing source."""
    data = load_sources()

    for i, existing_source in enumerate(data["sources"]):
        if existing_source["name"] == updated_source.name:
            data["sources"][i] = updated_source.dict()
            save_sources(data)
            return  # Successfully updated

    raise HTTPException(status_code=404, detail="Source not found.")  # No match found


def delete_source(source_name: str):
    """Delete a source by name."""
    logging.info(f"Attempting to delete source: {source_name}")
    
    # Load current sources
    data = load_sources()
    logging.debug(f"Current sources: {data['sources']}")

    # Filter out the source to delete
    filtered_sources = [src for src in data["sources"] if src["name"] != source_name]
    
    # Check if any source was removed
    if len(filtered_sources) == len(data["sources"]):
        logging.error(f"Source {source_name} not found.")
        raise HTTPException(status_code=404, detail="Source not found.")

    # Save the updated source list
    data["sources"] = filtered_sources
    save_sources(data)
    logging.info(f"Source {source_name} successfully deleted.")
    