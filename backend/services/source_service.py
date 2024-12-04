from services.yaml_service import BaseYamlService
from collections import OrderedDict

class SourceService(BaseYamlService):
    def __init__(self, config_file="config.yaml"):
        super().__init__(config_file)
        self.sources = self.load_yaml().get("sources", [])

    def serialize_source(self, source_data):
        """Reorder keys and remove empty fields from source data."""
        key_order = [
            "name", "type", "db_type", "host", "port", "user", "password",
            "db_name", "tables", "queries", "url", "method", "headers",
            "params", "file_path", "delimiter", "encoding", "options"
        ]
        cleaned_source = {k: v for k, v in source_data.items() if v not in [None, "", [], {}]}
        ordered_source = OrderedDict((key, cleaned_source[key]) for key in key_order if key in cleaned_source)
        print("DEBUG: Serialized source:", ordered_source)  # Debugging
        return ordered_source

    def save_config(self):
        """Save all sources to the YAML configuration file."""
        serialized_sources = [self.serialize_source(src) for src in self.sources]
        data = OrderedDict({"sources": serialized_sources})
        print("DEBUG: Data to save:", data)  # Debugging
        self.save_yaml(data)

    def add_source(self, source_data):
        """Add a new source or update if it already exists."""
        source_index = next((i for i, s in enumerate(self.sources) if s["name"] == source_data["name"]), None)
        if source_index is not None:
            # Update existing source
            self.sources[source_index] = self.serialize_source({**self.sources[source_index], **source_data})
            print("DEBUG: Source updated:", self.sources[source_index])  # Debugging
        else:
            # Add new source
            cleaned_source = self.serialize_source(source_data)
            print("DEBUG: Adding new source:", cleaned_source)  # Debugging
            self.sources.append(cleaned_source)

        self.save_config()
        return {"message": f"Source '{source_data['name']}' added or updated successfully."}


    def update_source(self, source_name, updated_data):
        """Update an existing source."""
        source_index = next((i for i, s in enumerate(self.sources) if s["name"] == source_name), None)
        if source_index is None:
            return {"error": f"Source with name '{source_name}' not found."}

        # Update the source
        self.sources[source_index] = self.serialize_source({**self.sources[source_index], **updated_data})
        print("DEBUG: Source updated:", self.sources[source_index])  # Debugging
        self.save_config()
        return {"message": f"Source '{source_name}' updated successfully."}


    def save_config(self):
        """Save all sources to the YAML configuration file."""
        # Remove duplicates by converting to a dictionary and back to a list
        unique_sources = list({s["name"]: s for s in self.sources}.values())
        serialized_sources = [self.serialize_source(src) for src in unique_sources]
        data = OrderedDict({"sources": serialized_sources})
        print("DEBUG: Data to save:", data)  # Debugging
        self.save_yaml(data)

    def delete_source(self, source_name):
        """Delete an existing source."""
        # Suche nach der Quelle mit dem angegebenen Namen
        source_index = next((i for i, s in enumerate(self.sources) if s["name"] == source_name), None)
        if source_index is None:
            return {"error": f"Source with name '{source_name}' not found."}

        # Entferne die Quelle
        deleted_source = self.sources.pop(source_index)
        print("DEBUG: Source deleted:", deleted_source)  # Debugging
        self.save_config()
        return {"message": f"Source '{source_name}' deleted successfully."}


    def get_sources(self):
        """Retrieve all sources."""
        return self.sources
