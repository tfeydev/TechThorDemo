import os
import yaml
import pandas as pd
import requests
import sqlalchemy as sa


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
        """Fetch a preview from an API source."""
        source = self.get_source_by_name(source_name)
        if source["type"] != "api":
            raise ValueError(f"Source '{source_name}' is not an API source.")

        url = source.get("url")
        params = source.get("params", {})
        headers = source.get("headers", {})

        if not url:
            raise ValueError(f"API URL for source '{source_name}' is missing.")

        response = requests.get(url, params=params, headers=headers)
        if response.status_code != 200:
            raise ValueError(f"Failed to fetch data from API: {response.status_code}")

        data = response.json()
        df = pd.DataFrame(data)
        return {
            "source_name": source_name,
            "preview": df.head(10).to_dict(orient="records"),
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

