import pandas as pd
import requests
import pymysql
import psycopg2
from pymongo import MongoClient


class ValidationService:
    @staticmethod
    def validate_csv(file_path, delimiter=",", encoding="utf-8"):
        try:
            df = pd.read_csv(file_path, delimiter=delimiter, encoding=encoding)
            if df.empty:
                raise ValueError("The CSV file is empty.")
            return df
        except Exception as e:
            raise ValueError(f"CSV validation failed: {e}")

    @staticmethod
    def validate_json(file_path, encoding="utf-8"):
        try:
            import json
            with open(file_path, "r", encoding=encoding) as f:
                data = json.load(f)
            if isinstance(data, list):
                return pd.DataFrame(data)
            elif isinstance(data, dict):
                return pd.DataFrame([data])
            else:
                raise ValueError("Invalid JSON structure.")
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
        try:
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
