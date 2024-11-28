import yaml
from app.config import CONFIG_PATH
import logging
logging.basicConfig(level=logging.INFO)


def load_sources():
    """Load sources from the YAML file."""
    try:
        logging.info(f"Loading sources from {CONFIG_PATH}...")
        with open(CONFIG_PATH, "r") as file:
            data = yaml.safe_load(file) or {"sources": []}
            logging.info(f"Loaded sources: {data}")
            return data
    except FileNotFoundError:
        logging.error(f"YAML file not found at {CONFIG_PATH}.")
        return {"sources": []}
    except Exception as e:
        logging.error(f"Error loading YAML: {e}")
        raise
    
def save_sources(data):
    """Save sources to the YAML file."""
    with open(CONFIG_PATH, "w") as file:
        yaml.dump(data, file)
        print(f"Saved data: {data}")