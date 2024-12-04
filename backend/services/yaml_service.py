import yaml
from collections import OrderedDict

# Custom representer for OrderedDict
def represent_ordereddict(dumper, data):
    return dumper.represent_mapping(
        yaml.resolver.BaseResolver.DEFAULT_MAPPING_TAG, data.items(), flow_style=False
    )

# Register the representer globally for both SafeDumper and Dumper
yaml.add_representer(OrderedDict, represent_ordereddict)
yaml.SafeDumper.add_representer(OrderedDict, represent_ordereddict)  # SafeDumper fix

class BaseYamlService:
    def __init__(self, config_file="config.yaml"):
        self.config_file = config_file

    def load_yaml(self):
        """Load YAML file."""
        try:
            with open(self.config_file, "r") as file:
                data = yaml.safe_load(file) or {}
                print("DEBUG: Loaded YAML data:", data)  # Debugging
                return data
        except FileNotFoundError:
            print("DEBUG: YAML file not found.")  # Debugging
            return {}

    def save_yaml(self, data):
        """Save data to YAML with proper handling for empty objects."""
        def clean_data(obj):
            if isinstance(obj, dict):
                return OrderedDict((k, clean_data(v)) for k, v in obj.items())
            if isinstance(obj, list):
                return [clean_data(item) for item in obj]
            return obj

        cleaned_data = clean_data(data)
        with open(self.config_file, "w") as file:
            yaml.safe_dump(cleaned_data, file, default_flow_style=False, sort_keys=False, allow_unicode=True)
