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


def save_source_to_yaml(data, overwrite=False):
    """
    Save the YAML configuration.
    :param data: Data to save.
    :param overwrite: If True, overwrite the entire file. Otherwise, append.
    """
    if overwrite:
        config = data
    else:
        config = load_sources()
        config["sources"].append(data)

    with open(CONFIG_PATH, "w") as file:
        yaml.dump(config, file)

