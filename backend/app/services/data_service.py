from app.services.yaml_service import load_sources, save_sources
from app.models.source_models import Source
from fastapi import HTTPException
import logging


def get_sources():
    """Retrieve all sources from the YAML file."""
    data = load_sources()  # Lädt die YAML-Datei
    return data.get("sources", [])  # Gibt die Liste der Quellen zurück

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
    """Update an existing source in the YAML file."""
    data = load_sources()  # Lädt die aktuelle Konfiguration
    sources = data.get("sources", [])
    
    for idx, source in enumerate(sources):
        if source["name"] == updated_source.name:  # Quelle finden
            sources[idx] = updated_source.dict()  # Quelle aktualisieren
            save_sources(data)  # Speichern der aktualisierten Daten
            return
    
    # Fehler werfen, wenn die Quelle nicht existiert
    raise HTTPException(status_code=404, detail="Source not found.")

def delete_source(source_name: str):
    """Delete a source by name from the YAML file."""
    data = load_sources()  # Lädt die aktuelle Konfiguration
    sources = data.get("sources", [])
    updated_sources = [source for source in sources if source["name"] != source_name]
    
    if len(updated_sources) == len(sources):  # Wenn keine Quelle gelöscht wurde
        raise HTTPException(status_code=404, detail="Source not found.")
    
    data["sources"] = updated_sources
    save_sources(data)  # Speichern der aktualisierten Daten
