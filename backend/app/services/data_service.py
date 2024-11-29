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

def update_source(source_name: str, updated_source: dict):
    """Update an existing source in the config.yaml file."""
    try:
        # Load existing YAML data
        if os.path.exists(CONFIG_PATH):
            with open(CONFIG_PATH, "r") as file:
                data = yaml.safe_load(file) or {"sources": []}
        else:
            raise HTTPException(status_code=404, detail="Configuration file not found.")

        # Locate the source to update
        for source in data["sources"]:
            if source["name"] == source_name:
                # Update only the provided fields
                for key, value in updated_source.items():
                    if value not in [None, "", [], {}]:  # Exclude null or empty fields
                        source[key] = value

                # Write the updated data back to YAML
                with open(CONFIG_PATH, "w") as file:
                    yaml.dump(data, file, default_flow_style=False, sort_keys=False)
                return {"message": f"Source '{source_name}' updated successfully."}

        # If the source is not found
        raise HTTPException(status_code=404, detail=f"Source '{source_name}' not found.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating source: {str(e)}")

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

    logging.info(f"Attempting to update source with original name: {source_name}")
    logging.info(f"Updated data: {updated_source.dict()}")

    for idx, source in enumerate(sources):
        # Use the source_name (from URL) to locate the source
        if source["name"] == source_name:
            updated_data = updated_source.dict()

            # Apply the updated data, including a potential name change
            if source_name != updated_data["name"]:
                logging.info(f"Renaming source from '{source_name}' to '{updated_data['name']}'.")

            sources[idx] = updated_data  # Update the source
            save_sources({"sources": sources})  # Save changes
            return {"message": f"Source '{source_name}' updated successfully."}

    logging.error(f"Source '{source_name}' not found.")
    raise HTTPException(status_code=404, detail=f"Source '{source_name}' not found.")


def validate_unique_name(sources: list, current_name: str, new_name: str):
    """
    Validate that the new name doesn't conflict with other sources.
    """
    if new_name != current_name:
        if any(source["name"] == new_name for source in sources):
            raise HTTPException(
                status_code=400,
                detail=f"A source with the name '{new_name}' already exists."
            )


def replace_source(sources: list, source_name: str, updated_data: dict):
    """
    Replace the source in the list with updated data.
    """
    for idx, source in enumerate(sources):
        if source["name"] == source_name:
            print(f"Updating source '{source_name}'...")

            # Log changes for debugging
            log_field_changes(source, updated_data)

            sources[idx] = updated_data  # Replace the source
            return sources

    # Raise an error if the source is not found
    raise HTTPException(status_code=404, detail=f"Source '{source_name}' not found.")


def log_field_changes(original: dict, updated: dict):
    """
    Log changes between the original and updated data for debugging.
    """
    for key, value in updated.items():
        if original.get(key) != value:
            print(f" - Field '{key}' changed from '{original.get(key)}' to '{value}'.")




    