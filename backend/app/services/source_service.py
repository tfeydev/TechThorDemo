from services.yaml_service import BaseYamlService
from collections import OrderedDict
import yaml
from pydrive2.auth import GoogleAuth
from pydrive2.drive import GoogleDrive
from onedrivesdk import get_default_client
from smbprotocol.connection import Connection
from smbprotocol.session import Session
from smbprotocol.tree import TreeConnect
from smbprotocol import Open, FileAttributes
from io import StringIO
from smb.SMBConnection import SMBConnection


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
                "delimiter": ",",
                "encoding": "utf-8",
            },
            "json": {
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

        # Reorder keys based on key order
        key_order = [
            "name", "type", "url", "headers", "params", "file_path",
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
                "csv": ["name", "type", "file_path", "delimiter", "encoding"],
                "json": ["name", "type", "file_path", "encoding"],
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

    def read_csv_from_gdrive(file_path, delimiter=",", encoding="utf-8"):
        try:
            gauth = GoogleAuth()
            gauth.LocalWebserverAuth()  # Authenticate locally
            drive = GoogleDrive(gauth)

            file_id = file_path.split("gdrive://")[-1]  # Extract file ID
            file = drive.CreateFile({'id': file_id})
            content = file.GetContentString(encoding=encoding)  # Read file content as a string

            # Load directly into a Pandas DataFrame
            from io import StringIO
            df = pd.read_csv(StringIO(content), delimiter=delimiter)
            if df.empty:
                raise ValueError("The CSV file is empty.")
            return df
        except Exception as e:
            raise ValueError(f"Error accessing Google Drive file: {e}")
        
    def read_csv_from_smb(server, share, file_path, username, password, delimiter=",", encoding="utf-8"):
        """
        Reads a CSV file directly from an SMB server without downloading it.

        :param server: The SMB server address (e.g., "smb://your-server.com").
        :param share: The shared folder on the SMB server (e.g., "shared-folder").
        :param file_path: Path to the file within the shared folder.
        :param username: SMB username.
        :param password: SMB password.
        :param delimiter: CSV delimiter (default is ",").
        :param encoding: File encoding (default is "utf-8").
        :return: Pandas DataFrame with the file content.
        """
        try:
            # Establish connection to the SMB server
            connection = Connection(uuid.uuid4().hex, server, 445)  # Port 445 for SMB
            connection.connect()

            # Authenticate with the SMB server
            session = Session(connection, username, password)
            session.connect()

            # Access the shared folder
            tree = TreeConnect(session, share)
            tree.connect()

            # Open the file
            smb_file = Open(tree, file_path, access=FileAttributes.FILE_READ_DATA)
            smb_file.open()

            # Read the file content
            content = smb_file.read(0, smb_file.file_size).decode(encoding)

            # Convert the file content into a DataFrame
            df = pd.read_csv(StringIO(content), delimiter=delimiter)
            return df
        except Exception as e:
            raise ValueError(f"Error reading file from SMB server: {e}")
        finally:
            # Ensure the connection is closed
            if connection:
                connection.disconnect()

    def read_csv_from_onedrive(file_path, client_id, client_secret, redirect_uri, delimiter=",", encoding="utf-8"):
        """
        Reads a CSV file directly from OneDrive without downloading it.

        :param file_path: OneDrive file path (e.g., "onedrive://item-id").
        :param client_id: Your OneDrive app client ID.
        :param client_secret: Your OneDrive app client secret.
        :param redirect_uri: Redirect URI set in your OneDrive app configuration.
        :param delimiter: CSV delimiter (default is ",").
        :param encoding: File encoding (default is "utf-8").
        :return: Pandas DataFrame with the file content.
        """
        try:
            # Initialize the OneDrive client
            client = get_default_client(
                client_id=client_id,
                client_secret=client_secret,
                scopes=['Files.ReadWrite']
            )
            
            # Authenticate
            auth_url = client.auth_provider.get_auth_url(redirect_uri)
            print(f"Please go to this URL and authenticate: {auth_url}")
            code = input("Enter the authentication code here: ")
            client.auth_provider.authenticate(code, redirect_uri, client_secret)

            # Extract the file ID from the OneDrive path
            file_id = file_path.split("onedrive://")[-1]  # Assuming OneDrive paths are prefixed with "onedrive://"

            # Fetch the file content from OneDrive
            file_item = client.item(drive="me", id=file_id).get()
            content = client.item(drive="me", id=file_id).download().read().decode(encoding)

            # Load the content into a Pandas DataFrame
            df = pd.read_csv(StringIO(content), delimiter=delimiter)
            return df
        except Exception as e:
            raise ValueError(f"Error reading CSV file from OneDrive: {e}")
        