import yaml
from ..config import CONFIG_PATH

def load_sources():
    """Load sources from the YAML file."""
    try:
        with open(CONFIG_PATH, "r") as file:
            return yaml.safe_load(file) or {"sources": []}
    except FileNotFoundError:
        return {"sources": []}

def save_sources(data):
    """Save sources to the YAML file."""
    with open(CONFIG_PATH, "w") as file:
        yaml.dump(data, file)
