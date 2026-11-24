
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import check_database_connection
from nutrition import router as nutrition_router
from ai import router as ai_router

app = FastAPI(
    title="NutriSync AI API",
    description="Backend API for NutriSync AI Wellness Platform",
    version="1.0.0"
)
app.include_router(nutrition_router)
app.include_router(ai_router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8443",
        "http://127.0.0.1:8443",
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {
        "message": "Welcome to NutriSync AI Backend!"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "success",
        "message": "NutriSync AI API is running"
    }
@app.get("/api/db-health")
def database_health():
    if check_database_connection():
        return {
            "status": "success",
            "message": "MongoDB connected successfully!"
        }

    return {
        "status": "error",
        "message": "MongoDB connection failed"
    }
