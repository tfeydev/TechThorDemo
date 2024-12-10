import pandas as pd
import requests
import pymysql
import psycopg2
from pymongo import MongoClient
from pydrive2.auth import GoogleAuth
from pydrive2.drive import GoogleDrive
import uuid
import msal
from smbprotocol.connection import Connection
from smbprotocol.session import Session
from smbprotocol.tree import TreeConnect
from smbprotocol import Open, FileAttributes


class ValidationService:
    @staticmethod
    def validate_csv(file_path, delimiter=",", encoding="utf-8", source_type="local"):
        try:
            if source_type == "gdrive":
                return ValidationService.read_csv_from_gdrive(file_path, delimiter, encoding)
            elif source_type == "onedrive":
                return ValidationService.read_csv_from_onedrive(file_path, delimiter, encoding)
            elif source_type == "smb":
                return ValidationService.read_csv_from_smb(file_path, delimiter, encoding)
            else:  # Assume local
                return pd.read_csv(file_path, delimiter=delimiter, encoding=encoding)
        except Exception as e:
            raise ValueError(f"CSV validation failed: {e}")

    @staticmethod
    def validate_json(file_path, encoding="utf-8", source_type="local"):
        try:
            if source_type == "gdrive":
                return ValidationService.read_json_from_gdrive(file_path, encoding)
            elif source_type == "onedrive":
                return ValidationService.read_json_from_onedrive(file_path, encoding)
            else:  # Assume local
                import json
                with open(file_path, "r", encoding=encoding) as f:
                    data = json.load(f)
                return pd.DataFrame(data) if isinstance(data, list) else pd.DataFrame([data])
        except Exception as e:
            raise ValueError(f"JSON validation failed: {e}")


    @staticmethod
    def validate_api(url, headers=None, params=None):
        try:
            response = requests.get(url, headers=headers, params=params)
            response.raise_for_status()
            data = response.json()
            if isinstance(data, list):
                return pd.DataFrame(data)
            elif isinstance(data, dict):
                return pd.DataFrame([data])
            else:
                raise ValueError("Invalid API response structure.")
        except Exception as e:
            raise ValueError(f"API validation failed: {e}")

    @staticmethod
    def validate_sql(db_type, host, port, user, password, db_name, query=None, tables=None):
        conn = None
        try:HTTP
            if db_type == "mysql":
                conn = pymysql.connect(host=host, port=port, user=user, password=password, database=db_name)
            elif db_type == "postgresql":
                conn = psycopg2.connect(host=host, port=port, user=user, password=password, dbname=db_name)
            else:
                raise ValueError(f"Unsupported database type: {db_type}")

            if query:
                df = pd.read_sql(query, conn)
            elif tables:
                dfs = [pd.read_sql(f"SELECT * FROM {table}", conn) for table in tables]
                df = pd.concat(dfs, ignore_index=True)
            else:
                raise ValueError("Either 'query' or 'tables' must be provided.")
            if df.empty:
                raise ValueError("Query or tables returned no results.")
            return df
        except Exception as e:
            raise ValueError(f"SQL validation failed: {e}")
        finally:
            if conn:
                conn.close()

    @staticmethod
    def validate_mongo(host, port, username, password, db_name, collection_name, filter_query=None):
        try:
            client = MongoClient(host=host, port=port, username=username, password=password)
            db = client[db_name]
            collection = db[collection_name]
            data = list(collection.find(filter_query or {}))
            if not data:
                raise ValueError("Query returned no results.")
            return pd.DataFrame(data)
        except Exception as e:
            raise ValueError(f"MongoDB validation failed: {e}")
        
    @staticmethod
    def read_json_from_gdrive(file_path, encoding="utf-8"):
        try:
            gauth = GoogleAuth()
            gauth.LocalWebserverAuth()
            drive = GoogleDrive(gauth)

            file_id = file_path.split("gdrive://")[-1]
            file = drive.CreateFile({'id': file_id})
            content = file.GetContentString(encoding=encoding)  # Read as a string

            import json
            data = json.loads(content)  # Parse JSON directly
            return pd.DataFrame(data) if isinstance(data, list) else pd.DataFrame([data])
        except Exception as e:
            raise ValueError(f"Error accessing Google Drive JSON file: {e}")
            
    staticmethod
    def read_csv_from_onedrive(file_path, delimiter=",", encoding="utf-8"):
        try:
            client = get_default_client(
                client_id='YOUR_CLIENT_ID',
                scopes=['wl.signin', 'wl.offline_access', 'onedrive.readwrite']
            )
            client.auth_provider.authenticate()

            item_id = file_path.split("onedrive://")[-1]  # Extract item ID
            item = client.item(drive='me', id=item_id).get()
            content = client.item(drive='me', id=item_id).content.download_to_stream().read().decode(encoding)

            # Load into a Pandas DataFrame
            from io import StringIO
            df = pd.read_csv(StringIO(content), delimiter=delimiter)
            if df.empty:
                raise ValueError("The CSV file is empty.")
            return df
        except Exception as e:
            raise ValueError(f"Error accessing OneDrive file: {e}")
        
    @staticmethod
    def read_csv_from_smb(file_path, delimiter=",", encoding="utf-8"):
        try:
            conn = Connection(uuid.uuid4().hex, "smb://<your-server>", 445)
            conn.connect()
            session = Session(conn, "<username>", "<password>")
            session.connect()
            tree = TreeConnect(session, "smb://<your-share>")
            tree.connect()

            smb_file = Open(tree, file_path, access=FileAttributes.FILE_READ_DATA)
            smb_file.open()

            content = smb_file.read(0, smb_file.file_size).decode(encoding)  # Read file content as a string

            # Load into a Pandas DataFrame
            from io import StringIO
            df = pd.read_csv(StringIO(content), delimiter=delimiter)
            if df.empty:
                raise ValueError("The CSV file is empty.")
            return df
        except Exception as e:
            raise ValueError(f"Error accessing SMB file: {e}")
        