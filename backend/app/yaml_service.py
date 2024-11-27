from typing import List
import yaml

CONFIG_PATH = "app/config/config.yaml"

def load_sources() -> dict:
    """Load sources from YAML file."""
    try:
        with open(CONFIG_PATH, "r") as file:
            return yaml.safe_load(file) or {"sources": []}
    except FileNotFoundError:
        return {"sources": []}
    except yaml.YAMLError as e:
        raise ValueError(f"Failed to parse YAML: {str(e)}")


def save_source_to_yaml(new_source: dict, overwrite: bool = False):
    """Save or overwrite sources in YAML file."""
    config = load_sources()
    if overwrite:
        config["sources"] = [new_source]
    else:
        config["sources"].append(new_source)
    with open(CONFIG_PATH, "w") as file:
        yaml.dump(config, file)
