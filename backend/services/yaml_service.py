import yaml


class YamlService:
    def __init__(self, config_file="config.yaml"):
        self.config_file = config_file

    def load_yaml(self):
        try:
            with open(self.config_file, "r") as file:
                return yaml.safe_load(file)
        except FileNotFoundError:
            return {}

    def save_yaml(self, data):
        with open(self.config_file, "w") as file:
            yaml.dump(data, file)

    def update_yaml(self, key, value):
        data = self.load_yaml()
        data[key] = value
        self.save_yaml(data)
