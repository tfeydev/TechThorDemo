from app.services.yaml_service import load_sources, save_sources
from app.models.source_models import Source
from fastapi import HTTPException
import logging


def get_sources():
    """Retrieve all sources from the YAML file."""
    data = load_sources()  # Lädt die YAML-Datei
    return data.get("sources", [])  # Gibt die Liste der Quellen zurück

def get_source_by_sourcename(source_name: str):
    """Retrieve a specific source by name from the YAML file."""
    data = load_sources()  # Lädt die aktuelle Konfiguration
    sources = data.get("sources", [])
    
    for source in sources:
        if source["name"] == source_name:  # Suche nach dem Namen
            return source
    
    # Fehler werfen, wenn die Quelle nicht existiert
    raise HTTPException(status_code=404, detail="Source not found.")

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

def delete_source_by_sourcename(source_name: str):
    """
    Delete a source by its name from the YAML file.
    """
    data = load_sources()  # Lädt die aktuelle YAML-Datei
    sources = data.get("sources", [])
    
    # Filtere die Quelle mit dem angegebenen Namen aus
    updated_sources = [source for source in sources if source["name"] != source_name]
    
    # Wenn keine Quelle gelöscht wurde, Fehler auslösen
    if len(updated_sources) == len(sources):
        raise HTTPException(status_code=404, detail=f"Source '{source_name}' not found.")
    
    # Aktualisiere die Daten und speichere sie
    data["sources"] = updated_sources
    save_sources(data)

def update_source_by_sourcename(source_name: str, updated_source: Source):
    """Update an existing source by name."""
    data = load_sources()  # Load existing sources from YAML
    sources = data.get("sources", [])

    # Locate the source to be updated
    for idx, source in enumerate(sources):
        if source["name"] == source_name:
            # If name is updated, ensure references are handled correctly
            updated_data = updated_source.dict()
            if source_name != updated_data["name"]:
                print(f"Renaming source from {source_name} to {updated_data['name']}.")

            sources[idx] = updated_data  # Update the source
            save_sources(data)  # Save changes
            return {"message": f"Source '{source_name}' updated successfully."}
    
    # Raise an error if the source is not found
    raise HTTPException(status_code=404, detail=f"Source '{source_name}' not found.")

    