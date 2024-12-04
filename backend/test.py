from services.source_service import SourceService

service = SourceService()

service.add_source({
    "name": "test3",
    "type": "csv",
    "file_path": "data/example.csv",
    "delimiter": ",",
    "encoding": "utf-8"
})

print("DEBUG: Sources in memory:", service.get_sources())
