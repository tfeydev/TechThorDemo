from services.source_service import SourceService

def main():
    service = SourceService("config.yaml")

    # Test: Hinzufügen einer neuen Quelle
    print("TEST: Hinzufügen einer neuen Quelle")
    service.add_source({
        "name": "test1",
        "type": "csv",
        "file_path": "data/example.csv",
        "delimiter": ",",
        "encoding": "utf-8"
    })

    # Test: Hinzufügen einer weiteren Quelle
    print("TEST: Hinzufügen einer weiteren Quelle")
    service.add_source({
        "name": "test2",
        "type": "json",
        "file_path": "data/example.json",
        "encoding": "utf-8"
    })

    # Test: Aktualisieren einer bestehenden Quelle
    print("TEST: Aktualisieren der Quelle 'test1'")
    service.update_source("test1", {"encoding": "latin-1"})

    # Test: Löschen einer Quelle
    print("TEST: Löschen der Quelle 'test2'")
    service.delete_source("test2")

    # Test: Anzeigen der verbleibenden Quellen
    print("TEST: Anzeigen aller verbleibenden Quellen")
    sources = service.get_sources()
    print("DEBUG: Verbleibende Quellen:", sources)

    # Test: Überprüfen der Reihenfolge in der config.yaml
    print("TEST: Überprüfen der Reihenfolge in der config.yaml")
    with open("config.yaml", "r") as file:
        print("DEBUG: Inhalt der config.yaml:")
        print(file.read())

if __name__ == "__main__":
    main()
