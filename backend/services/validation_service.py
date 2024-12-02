import pandas as pd
import json
import requests
import pymysql
import psycopg2
from pymongo import MongoClient


class ValidationService:
    # CSV Validation and Normalization
    @staticmethod
    def validate_csv(file_path, delimiter=",", encoding="utf-8"):
        try:
            df = pd.read_csv(file_path, delimiter=delimiter, encoding=encoding)
            if df.empty:
                raise ValueError("The file is empty.")
            return df
        except Exception as e:
            raise ValueError(f"CSV validation failed: {e}")

    @staticmethod
    def normalize_csv(df):
        # Example: Fill missing values with empty strings
        return df.fillna("")

    # JSON Validation and Normalization
    @staticmethod
    def validate_json(file_path, encoding="utf-8"):
        try:
            with open(file_path, "r", encoding=encoding) as f:
                data = json.load(f)
            if not isinstance(data, (list, dict)):
                raise ValueError("Invalid JSON structure: Must be a dictionary or a list.")
            return data
        except Exception as e:
            raise ValueError(f"JSON validation failed: {e}")

    @staticmethod
    def normalize_json(data):
        # Normalize JSON data into a DataFrame
        if isinstance(data, list):
            return pd.DataFrame(data)
        elif isinstance(data, dict):
            return pd.DataFrame([data])  # Wrap dict as a single-row DataFrame

    # API Validation and Normalization
    @staticmethod
    def validate_api(url, headers=None, params=None):
        try:
            response = requests.get(url, headers=headers, params=params)
            response.raise_for_status()
            data = response.json()
            if not isinstance(data, (list, dict)):
                raise ValueError("Invalid API response structure: Must be a dictionary or a list.")
            return data
        except Exception as e:
            raise ValueError(f"API validation failed: {e}")

    @staticmethod
    def normalize_api(data):
        # Normalize API data into a DataFrame
        return ValidationService.normalize_json(data)

    # SQL Database Validation and Normalization
    @staticmethod
    def validate_sql(db_type, host, port, username, password, db_name, query):
        conn = None
        try:
            if db_type == "mysql":
                conn = pymysql.connect(
                    host=host, port=port, user=username, password=password, database=db_name
                )
            elif db_type == "postgresql":
                conn = psycopg2.connect(
                    host=host, port=port, user=username, password=password, dbname=db_name
                )
            else:
                raise ValueError(f"Unsupported database type: {db_type}")
            df = pd.read_sql(query, conn)
            if df.empty:
                raise ValueError("Query returned no results.")
            return df
        except Exception as e:
            raise ValueError(f"SQL validation failed: {e}")
        finally:
            if conn:
                conn.close()

    # MongoDB Validation and Normalization
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
