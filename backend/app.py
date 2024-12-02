from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from services.source_service import SourceService

app = FastAPI()

# Initialize services
source_service = SourceService()

# CORS Middleware for Frontend Integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],  # Frontend origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, PUT, DELETE)
    allow_headers=["*"],  # Allow all headers
)

@app.get("/sources")
async def get_sources():
    return source_service.get_sources()

@app.post("/sources")
async def add_source(source: dict):
    """Add a new source."""
    result = source_service.add_source(source)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result


@app.put("/sources/{source_name}")
async def update_source(source_name: str, updated_data: dict):
    """Update an existing source."""
    result = source_service.update_source(source_name, updated_data)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result


@app.delete("/sources/{source_name}")
async def delete_source(source_name: str):
    """Delete an existing source."""
    result = source_service.delete_source(source_name)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
