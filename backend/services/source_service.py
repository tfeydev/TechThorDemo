import yaml
from validation_service import ValidationService


class SourceService:
    def __init__(self, config_file="config.yaml"):
        self.config_file = config_file
        self.sources = self.load_config()

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
                normalized_data = ValidationService.normalize_csv(df)
            elif source_type == "json":
                data = ValidationService.validate_json(
                    source_data["file_path"], source_data.get("encoding", "utf-8")
                )
                normalized_data = ValidationService.normalize_json(data)
            elif source_type == "api":
                data = ValidationService.validate_api(
                    source_data["url"],
                    source_data.get("headers", {}),
                    source_data.get("params", {}),
                )
                normalized_data = ValidationService.normalize_api(data)
            elif source_type == "database":
                if source_data["db_type"] in ["mysql", "postgresql"]:
                    normalized_data = ValidationService.validate_sql(
                        source_data["db_type"],
                        source_data["host"],
                        source_data["port"],
                        source_data["username"],
                        source_data["password"],
                        source_data["db_name"],
                        source_data["query"],
                    )
                elif source_data["db_type"] == "mongodb":
                    normalized_data = ValidationService.validate_mongo(
                        source_data["host"],
                        source_data["port"],
                        source_data["username"],
                        source_data["password"],
                        source_data["db_name"],
                        source_data["collection_name"],
                        source_data.get("filter_query"),
                    )
                else:
                    raise ValueError(f"Unsupported database type: {source_data['db_type']}")
            else:
                raise ValueError(f"Unsupported source type: {source_type}")

            self.sources.append(source_data)
            self.save_config()
            return {"message": "Source added successfully", "data_preview": normalized_data.head().to_dict()}
        except Exception as e:
            return {"error": str(e)}
