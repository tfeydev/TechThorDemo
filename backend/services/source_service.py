import yaml
from .validation_service import ValidationService


class SourceService:
    def __init__(self, config_file="config.yaml"):
        self.config_file = config_file
        self.sources = self.load_config()

    def serialize_source(self, source_data):
        """Remove empty fields from source data."""
        return {k: v for k, v in source_data.items() if v not in [None, "", [], {}]}

    def save_config(self):
        """Save the sources to the YAML configuration file."""
        clean_sources = [self.serialize_source(src) for src in self.sources]
        with open(self.config_file, "w") as file:
            yaml.dump({"sources": clean_sources}, file)

    def load_config(self):
        """Load the YAML configuration file."""
        try:
            with open(self.config_file, "r") as file:
                return yaml.safe_load(file).get("sources", [])
        except FileNotFoundError:
            return []

    def save_config(self):
        """Save the sources to the YAML configuration file."""
        with open(self.config_file, "w") as file:
            yaml.dump({"sources": self.sources}, file)

    def get_sources(self):
        """Retrieve all sources."""
        return self.sources

    def add_source(self, source_data):
        """Add a new source after validation."""
        try:
            source_type = source_data.get("type")
            if source_type == "csv":
                df = ValidationService.validate_csv(
                    source_data["file_path"],
                    source_data.get("delimiter", ","),
                    source_data.get("encoding", "utf-8"),
                )
            elif source_type == "json":
                df = ValidationService.validate_json(
                    source_data["file_path"], source_data.get("encoding", "utf-8")
                )
            elif source_type == "api":
                df = ValidationService.validate_api(
                    source_data["url"],
                    source_data.get("headers", {}),
                    source_data.get("params", {})
                )
            elif source_type == "database":
                if source_data["db_type"] in ["mysql", "postgresql"]:
                    df = ValidationService.validate_sql(
                        db_type=source_data["db_type"],
                        host=source_data["host"],
                        port=source_data["port"],
                        user=source_data["user"],
                        password=source_data["password"],
                        db_name=source_data["db_name"],
                        query=source_data.get("query"),
                        tables=source_data.get("tables"),
                    )
                elif source_data["db_type"] == "mongodb":
                    df = ValidationService.validate_mongo(
                        host=source_data["host"],
                        port=source_data["port"],
                        username=source_data["user"],
                        password=source_data["password"],
                        db_name=source_data["db_name"],
                        collection_name=source_data["collection_name"],
                        filter_query=source_data.get("filter_query"),
                    )
                else:
                    raise ValueError(f"Unsupported database type: {source_data['db_type']}")
            else:
                raise ValueError(f"Unsupported source type: {source_type}")

            self.sources.append(source_data)
            self.save_config()
            return {"message": "Source added successfully"}
        except Exception as e:
            return {"error": str(e)}

    def update_source(self, source_name, updated_data):
        """Update an existing source."""
        try:
            source_index = next((i for i, s in enumerate(self.sources) if s["name"] == source_name), None)
            if source_index is None:
                raise ValueError(f"Source with name '{source_name}' not found.")

            # Update the source
            self.sources[source_index] = {**self.sources[source_index], **updated_data}
            self.save_config()
            return {"message": f"Source '{source_name}' updated successfully."}
        except Exception as e:
            return {"error": str(e)}

    def delete_source(self, source_name):
        """Delete an existing source."""
        try:
            source_index = next((i for i, s in enumerate(self.sources) if s["name"] == source_name), None)
            if source_index is None:
                raise ValueError(f"Source with name '{source_name}' not found.")

            # Remove the source
            deleted_source = self.sources.pop(source_index)
            self.save_config()
            return {"message": f"Source '{source_name}' deleted successfully.", "deleted_source": deleted_source}
        except Exception as e:
            return {"error": str(e)}
