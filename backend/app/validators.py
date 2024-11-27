def validate_database_source(source):
    if "connection" not in source or not source["connection"]:
        raise ValueError("Missing database connection details.")
    # Add further database validations here


def validate_csv_source(source):
    if "file_path" not in source or not source["file_path"]:
        raise ValueError("CSV source must have a file path.")


def validate_json_source(source):
    if "file_path" not in source or not source["file_path"]:
        raise ValueError("JSON source must have a file path.")


def validate_api_source(source):
    if "url" not in source or not source["url"]:
        raise ValueError("API source must have a URL.")
