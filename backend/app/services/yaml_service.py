import yaml
import logging
from pathlib import Path

CONFIG_PATH = "app/config/config.yaml"

# Ensure the directory exists
Path(CONFIG_PATH).parent.mkdir(parents=True, exist_ok=True)

def ensure_default_config():
    """Ensure the YAML file exists with a default structure."""
    if not Path(CONFIG_PATH).exists():
        logging.warning(f"YAML file not found at {CONFIG_PATH}. Creating default file.")
        with open(CONFIG_PATH, "w") as file:
            yaml.safe_dump({"sources": []}, file)
            
            
def initialize_config():
    """Initialize the config.yaml with default content if it doesn't exist."""
    if not Path(CONFIG_PATH).exists():
        logging.warning(f"Config file not found at {CONFIG_PATH}. Initializing default config.")
        default_data = {"sources": []}
        with open(CONFIG_PATH, "w") as file:
            yaml.safe_dump(default_data, file)
        logging.info(f"Default config initialized at {CONFIG_PATH}.")            


def load_sources():
    """Load sources from the YAML file."""
    try:
        logging.info(f"Loading sources from {CONFIG_PATH}...")
        if not Path(CONFIG_PATH).exists():
            logging.error(f"YAML file not found at {CONFIG_PATH}. Returning default configuration.")
            return {"sources": []}  # Default return value
        
        with open(CONFIG_PATH, "r") as file:
            data = yaml.safe_load(file) or {"sources": []}
            logging.info(f"Loaded sources: {data}")
            return data
    except yaml.YAMLError as e:
        logging.error(f"YAML parsing error: {e}")
        raise
    except Exception as e:
        logging.error(f"Unexpected error loading YAML: {e}")
        raise

    
def save_sources(data):
    """Save sources to the YAML file."""
    with open(CONFIG_PATH, "w") as file:
        yaml.dump(data, file)
        print(f"Saved data: {data}")