from fastapi import FastAPI
from services.source_service import SourceService

app = FastAPI()

# Initialize services
source_service = SourceService()

@app.get("/sources")
async def get_sources():
    return source_service.get_sources()

@app.post("/sources")
async def add_source(source: dict):
    return source_service.add_source(source)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
