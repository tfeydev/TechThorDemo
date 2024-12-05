from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import source, data


app = FastAPI()


# CORS Middleware for Frontend Integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],  # Frontend origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, PUT, DELETE)
    allow_headers=["*"],  # Allow all headers
)


# Include routers
app.include_router(source.router, prefix="/api", tags=["sources"])
app.include_router(data.router, prefix="/api", tags=["data"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
