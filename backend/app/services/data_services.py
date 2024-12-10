import os
import yaml
import pandas as pd
import requests
import sqlalchemy as sa
from io import StringIO


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
    
    def reload_config(self):
        """Reload sources from the updated config.yaml."""
        self.sources = self._load_config()
        print("DEBUG: Sources reloaded:", self.sources)
    
    def get_all_sources(self):
        """Get all sources from the config file."""
        return self._load_config()
    
    def check_source_availability(self, source):
        """Placeholder to check if a source is available."""
        # Example logic - replace this with actual checks for source availability
        return "available" if source.get("type") else "not_available"

    def check_data_availability(self, source):
        """Placeholder to check if data is available for the source."""
        # Example logic - replace this with actual checks for data availability
        return "available" if source.get("type") else "not_available"

    def get_source_by_name(self, name: str):
        """Retrieve a source from config.yaml by its name."""
        source = next((src for src in self.sources if src["name"] == name), None)
        if not source:
            raise ValueError(f"Source '{name}' not found in config.yaml.")
        return source

    def get_csv_preview(self, source_name: str):
        """Fetch a preview of the CSV source."""
        source = self.get_source_by_name(source_name)
        file_path = source.get("file_path")
        file_source_type = source.get("file_source_type")
        delimiter = source.get("delimiter", ",")
        encoding = source.get("encoding", "utf-8")

        if file_source_type == "local":
            # Local file
            if not os.path.exists(file_path):
                raise FileNotFoundError(f"File '{file_path}' does not exist.")
            df = pd.read_csv(file_path, delimiter=delimiter, encoding=encoding)
        elif file_source_type in ["http"]:
            # HTTP file
            response = requests.get(file_path)
            if response.status_code != 200:
                raise ValueError(f"Failed to fetch data from {file_path}. Status: {response.status_code}")
            df = pd.read_csv(StringIO(response.text), delimiter=delimiter, encoding=encoding)
        else:
            raise ValueError(f"Unsupported file_source_type: {file_source_type}")

        return {
            "source_name": source_name,
            "preview": df.head(10).to_dict(orient="records"),
        }

    def get_json_preview(self, source_name: str):
        """Fetch a preview of the JSON source."""
        source = self.get_source_by_name(source_name)
        file_path = source.get("file_path")
        file_source_type = source.get("file_source_type")

        if file_source_type == "local":
            # Local file
            if not os.path.exists(file_path):
                raise FileNotFoundError(f"File '{file_path}' does not exist.")
            df = pd.read_json(file_path)
        elif file_source_type in ["http"]:
            # HTTP file
            response = requests.get(file_path)
            if response.status_code != 200:
                raise ValueError(f"Failed to fetch data from {file_path}. Status: {response.status_code}")
            df = pd.read_json(StringIO(response.text))
        else:
            raise ValueError(f"Unsupported file_source_type: {file_source_type}")

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

        # Parse the API response
        data = response.json()

        # Filter fields based on params
        required_fields = params.get("fields", None)  # Add a 'fields' key to the params if needed
        if required_fields:
            filtered_data = {k: v for k, v in flatten_json(data).items() if k in required_fields}
        else:
            filtered_data = flatten_json(data)  # Flatten all if no fields specified

        return {
            "source_name": source_name,
            "preview": [filtered_data]
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
            "preview": df.head(5).to_dict(orient="records"),
        }
    
    def get_http_preview(self, source_name: str):
        """Fetch a preview for HTTP-based sources."""
        source = self.get_source_by_name(source_name)

        # Validate file_source_type
        if source.get("file_source_type") not in ["http"]:
            raise ValueError(f"Source '{source_name}' is not an HTTP source.")

        # Fetch data from the URL
        url = source.get("file_path")
        if not url:
            raise ValueError(f"Source '{source_name}' does not have a valid URL.")

        response = requests.get(url)
        if response.status_code != 200:
            raise ValueError(f"Failed to fetch data from {url}. Status code: {response.status_code}")

        # Parse the content
        content_type = response.headers.get("Content-Type", "")
        if "text/csv" in content_type or url.endswith(".csv"):
            df = pd.read_csv(StringIO(response.text))
        elif "application/json" in content_type or url.endswith(".json"):
            df = pd.read_json(StringIO(response.text))
        else:
            raise ValueError(f"Unsupported content type: {content_type}")

        # Return the preview as a dictionary
        return {
            "source_name": source_name,
            "preview": df.head(5).to_dict(orient="records"),
        }

    
    def download_remote_file(self, file_url: str) -> str:
        """Download a file from a remote URL to a temporary file."""
        response = requests.get(file_url)
        response.raise_for_status()
        temp_file = "/tmp/temp_downloaded_file"
        with open(temp_file, "wb") as f:
            f.write(response.content)
        return temp_file

    def fetch_smb_file(self, smb_path: str) -> str:
        """Fetch a file from an SMB share."""
        # Assuming SMB credentials are pre-configured
        server = "192.168.1.142"  # SMB server
        share = "shared"          # SMB share name
        username = "your_username"
        password = "your_password"

        smb_url = smb_path.replace("\\", "/").lstrip("smb://")
        temp_file = "/tmp/temp_smb_file"

        try:
            # Establish an SMB connection
            session = requests.Session(server, username, password)
            connection = session.create_connection()
            with connection.open(smb_url, "rb") as remote_file, open(temp_file, "wb") as local_file:
                local_file.write(remote_file.read())
            return temp_file
        except Exception as e:
            raise ValueError(f"Error fetching SMB file: {e}")

    
        