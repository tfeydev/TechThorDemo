import yaml

CONFIG_PATH = "app/config/config.yaml"

def load_sources():
    """Load sources from the YAML file."""
    try:
        with open(CONFIG_PATH, "r") as file:
            return yaml.safe_load(file) or {"sources": []}
    except FileNotFoundError:
        return {"sources": []}


def save_source_to_yaml(source, overwrite=False):
    """Save or overwrite sources in the YAML file."""
    if overwrite:
        config = source
    else:
        config = load_sources()
        config["sources"].append(source)

    with open(CONFIG_PATH, "w") as file:
        yaml.dump(config, file)
