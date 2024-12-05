import os
import yaml
import pandas as pd
import requests
import sqlalchemy as sa


def flatten_json(data, parent_key='', sep='_'):
    """Flatten a nested JSON object into a flat dictionary."""
    items = []
    for k, v in data.items():
        new_key = f"{parent_key}{sep}{k}" if parent_key else k
        if isinstance(v, dict):  # Recursively flatten dictionaries
            items.extend(flatten_json(v, new_key, sep=sep).items())
        elif isinstance(v, list):  # Handle lists as comma-separated strings
            items.append((new_key, ', '.join(map(str, v))))
        else:  # Keep scalar values as they are
            items.append((new_key, v))
    return dict(items)


class DataService:
    def __init__(self, config_path="config.yaml"):
        self.config_path = config_path
        self.sources = self._load_config()

    def _load_config(self):
        """Load sources from the config.yaml file."""
        if not os.path.exists(self.config_path):
            raise FileNotFoundError(f"{self.config_path} not found.")
        with open(self.config_path, "r") as file:
            config = yaml.safe_load(file)
        return config.get("sources", [])

    def get_source_by_name(self, name: str):
        """Retrieve a source from config.yaml by its name."""
        source = next((src for src in self.sources if src["name"] == name), None)
        if not source:
            raise ValueError(f"Source '{name}' not found in config.yaml.")
        return source

    def get_csv_preview(self, source_name: str):
        """Fetch a preview of the CSV source."""
        source = self.get_source_by_name(source_name)
        if source["type"] != "csv":
            raise ValueError(f"Source '{source_name}' is not a CSV source.")

        file_path = source.get("file_path")
        delimiter = source.get("delimiter", ",")
        encoding = source.get("encoding", "utf-8")

        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File '{file_path}' does not exist.")

        # Load CSV into Pandas DataFrame
        df = pd.read_csv(file_path, delimiter=delimiter, encoding=encoding)
        return {
            "source_name": source_name,
            "preview": df.head(10).to_dict(orient="records"),
        }

    def get_json_preview(self, source_name: str):
        """Fetch a preview of the JSON source."""
        source = self.get_source_by_name(source_name)
        if source["type"] != "json":
            raise ValueError(f"Source '{source_name}' is not a JSON source.")

        file_path = source.get("file_path")

        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File '{file_path}' does not exist.")

        # Load JSON into Pandas DataFrame
        df = pd.read_json(file_path)
        return {
            "source_name": source_name,
            "preview": df.head(10).to_dict(orient="records"),
        }

    def get_api_preview(self, source_name: str):
        """Fetch a preview of the API source dynamically."""
        source = self.get_source_by_name(source_name)
        if source["type"] != "api":
            raise ValueError(f"Source '{source_name}' is not an API source.")

        url = source.get("url")
        params = source.get("params", {})
        headers = source.get("headers", {})

        if not url:
            raise ValueError(f"Source '{source_name}' does not have a URL.")

        # Make the API request
        response = requests.get(url, params=params, headers=headers)
        if response.status_code != 200:
            raise ValueError(f"Failed to fetch data from API. Status code: {response.status_code}")

        # Parse the API response dynamically
        data = response.json()

        # Flatten the response dynamically
        flattened_data = []
        if isinstance(data, dict):  # Handle JSON objects
            flattened_data.append(flatten_json(data))  # Flatten the single object
        elif isinstance(data, list):  # Handle JSON arrays
            for item in data[:10]:  # Limit to the first 10 items
                flattened_data.append(flatten_json(item))
        else:
            raise ValueError(f"Unsupported API response format for source '{source_name}'.")

        return {
            "source_name": source_name,
            "preview": flattened_data
        }

    def get_database_preview(self, source_name: str):
        """Fetch a preview from a database source."""
        source = self.get_source_by_name(source_name)
        if source["type"] != "database":
            raise ValueError(f"Source '{source_name}' is not a database source.")

        db_type = source.get("db_type")
        host = source.get("host")
        port = source.get("port")
        user = source.get("user")
        password = source.get("password")
        db_name = source.get("db_name")
        query = source.get("queries", [{}])[0].get("query", "")

        if not query:
            raise ValueError(f"No query provided for database source '{source_name}'.")

        connection_string = f"{db_type}://{user}:{password}@{host}:{port}/{db_name}"
        engine = sa.create_engine(connection_string)

        with engine.connect() as conn:
            df = pd.read_sql(query, conn)

        return {
            "source_name": source_name,
            "preview": df.head(10).to_dict(orient="records"),
        }

