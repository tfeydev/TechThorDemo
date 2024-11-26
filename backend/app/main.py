from fastapi import FastAPI
from app.endpoints.source_endpoints import source_router
from app.endpoints.data_endpoints import data_router

app = FastAPI(title="TechThor Backend")

# Include Routers
app.include_router(source_router, prefix="/sources", tags=["Sources"])
app.include_router(data_router, prefix="/data", tags=["Data"])

@app.get("/")
async def root():
    return {"message": "Welcome to the TechThor Backend"}