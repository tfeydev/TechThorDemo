import yaml
from app.config import CONFIG_PATH
import logging
logging.basicConfig(level=logging.INFO)


def load_sources():
    """Load sources from the YAML file."""
    logging.info("Loading sources from YAML...")
    try:
        with open(CONFIG_PATH, "r") as file:
            # Parse the YAML file and return its contents
            return yaml.safe_load(file) or {"sources": []}
    except FileNotFoundError:
        # If the file doesn't exist, return an empty structure
        logging.warning("YAML file not found. Returning empty sources.")
        return {"sources": []}
    

def save_sources(data):
    """Save sources to the YAML file."""
    with open(CONFIG_PATH, "w") as file:
        yaml.dump(data, file)
