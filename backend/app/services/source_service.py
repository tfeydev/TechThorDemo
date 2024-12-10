from services.yaml_service import BaseYamlService
import uuid
import yaml
from collections import OrderedDict
from io import StringIO
from pydrive2.auth import GoogleAuth
from pydrive2.drive import GoogleDrive
import msal
import requests
from smb.SMBConnection import SMBConnection
import pandas as pd


class SourceService(BaseYamlService):
    def __init__(self, config_file="config.yaml"):
        super().__init__(config_file)
        self.sources = self.load_yaml().get("sources", [])

    def load_config(self):
        """Load the YAML configuration file."""
        try:
            with open(self.config_file, "r") as file:
                config = yaml.safe_load(file) or {}
                return config.get("sources", [])
        except FileNotFoundError:
            return []
        
    def get_source_by_name(self, name: str):
        """Retrieve a source by its name."""
        config = self.load_config()  # Load the config dynamically
        sources = config.get("sources", [])
        for source in sources:
            if source.get("name") == name:
                return source
        return None  # Return None if no match is found

    def serialize_source(self, source_data):
        """Serialize and clean the source data."""
        source_type_defaults = {
            "api": {
                "url": "",
                "headers": {},
                "params": {},
            },
            "csv": {
                "file_source_type": '',
                "delimiter": ",",
                "encoding": "utf-8",
            },
            "json": {
                "file_source_type": '',
                "encoding": "utf-8",
            },
            "database": {
                "tables": [],
                "queries": [],
            },
        }

        # Get defaults for the source type
        defaults = source_type_defaults.get(source_data.get("type"), {})

        # Merge with provided data
        cleaned_source = {**defaults, **source_data}

        # Determine the appropriate key order based on the source type
        if source_data.get("type") == "api":
            key_order = ["name", "type", "url", "headers", "params"]
        else:
            key_order = [
            "name", "type", "url", "headers", "params", "file_source_type", "file_path",
            "delimiter", "encoding", "db_type", "host", "port", "user",
            "password", "db_name", "tables", "queries"
        ]
            
        ordered_source = OrderedDict((k, cleaned_source[k]) for k in key_order if k in cleaned_source)
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
        """Upfrom io import StringIOdate an existing source."""
        try:
            # Locate the source to update
            source_index = next((i for i, s in enumerate(self.sources) if s["name"] == source_name), None)
            if source_index is None:
                raise ValueError(f"Source with name '{source_name}' not found.")

            # Retrieve the source type and relevant fields
            source_type = self.sources[source_index].get("type")
            relevant_fields = {
                "api": ["name", "type", "url", "headers", "params"],
                "csv": ["name", "type", "file_source_type", "file_path", "delimiter", "encoding"],
                "json": ["name", "type", "file_source_type", "file_path", "encoding"],
                "database": [
                    "name", "type", "db_type", "host", "port", "user",
                    "password", "db_name", "tables", "queries"
                ]
            }.get(source_type, [])

            # Filter the updated data to only include relevant fields
            filtered_updates = {key: updated_data[key] for key in relevant_fields if key in updated_data}

            # Merge the updates into the source
            self.sources[source_index] = {**self.sources[source_index], **filtered_updates}
            print(f"DEBUG: Source updated: {self.sources[source_index]}")

            # Save the updated sources to the config file
            self.save_config()
            return {"message": f"Source '{source_name}' updated successfully"}
        except Exception as e:
            print(f"ERROR: {e}")
            return {"error": str(e)}


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

    
    def read_csv_from_gdrive(self, file_path, delimiter=",", encoding="utf-8"):
        try:
            gauth = GoogleAuth()
            gauth.LocalWebserverAuth()
            drive = GoogleDrive(gauth)
            file_id = file_path.split("gdrive://")[-1]
            file = drive.CreateFile({'id': file_id})
            content = file.GetContentString(encoding=encoding)
            return pd.read_csv(StringIO(content), delimiter=delimiter)
        except Exception as e:
            raise ValueError(f"Error accessing Google Drive file: {e}")

    def read_csv_from_smb(self, server, share, file_path, username, password, delimiter=",", encoding="utf-8"):
        try:
            conn = SMBConnection(username, password, "client_name", server)
            conn.connect(server, 139)
            with open("temp.csv", "wb") as file:
                conn.retrieveFile(share, file_path, file)
            conn.close()
            return pd.read_csv("temp.csv", delimiter=delimiter, encoding=encoding)
        except Exception as e:
            raise ValueError(f"Error reading file from SMB: {e}")

    def read_csv_from_onedrive(self, file_id, client_id, client_secret, tenant_id, delimiter=",", encoding="utf-8"):
        try:
            authority = f"https://login.microsoftonline.com/{tenant_id}"
            app = msal.ConfidentialClientApplication(
                client_id, client_secret, authority=authority
            )
            token_response = app.acquire_token_for_client(scopes=["https://graph.microsoft.com/.default"])
            access_token = token_response.get("access_token")

            if not access_token:
                raise ValueError("Authentication failed.")

            url = f"https://graph.microsoft.com/v1.0/me/drive/items/{file_id}/content"
            headers = {"Authorization": f"Bearer {access_token}"}
            response = requests.get(url, headers=headers)

            if response.status_code != 200:
                raise ValueError(f"Error fetching file from OneDrive: {response.status_code}")

            return pd.read_csv(StringIO(response.text), delimiter=delimiter, encoding=encoding)
        except Exception as e:
            raise ValueError(f"Error accessing OneDrive: {e}")
    
