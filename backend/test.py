from services.yaml_service import YamlService

# Initialize the YamlService
service = YamlService("config.yaml")

# Load and print the YAML data
data = service.load_yaml()
print("Before Reordering:")
print(data)

# Save to enforce reordering
service.save_yaml(data)

# Reload and print the reordered YAML data
reordered_data = service.load_yaml()
print("After Reordering:")
print(reordered_data)
