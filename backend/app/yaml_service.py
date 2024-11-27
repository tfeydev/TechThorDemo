import yaml
from pathlib import Path

CONFIG_PATH = Path("backend/config/config.yaml")

def load_sources():
    """Load sources from the YAML file."""
    try:
        if not CONFIG_PATH.exists():
            return {"sources": []}
        with CONFIG_PATH.open("r") as file:
            return yaml.safe_load(file) or {"sources": []}
    except Exception as e:
        raise RuntimeError(f"Failed to load YAML: {e}")


def save_source_to_yaml(source, overwrite=False):
    """Save or overwrite sources in the YAML file."""
    try:
        if overwrite:
            config = source
        else:
            config = load_sources()
            config["sources"].append(source)
        with CONFIG_PATH.open("w") as file:
            yaml.dump(config, file)
    except Exception as e:
        raise RuntimeError(f"Failed to save YAML: {e}")
