from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routes import auth, transactions

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Personal Finance Tracker API",
    description="A FastAPI backend for managing personal finances",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://frontend:5173",
        "https://your-frontend-domain.netlify.app",  # Replace with your actual frontend URL
        "https://your-frontend-domain.vercel.app",   # Or Vercel URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(transactions.router)

@app.get("/")
def read_root():
    return {"message": "Personal Finance Tracker API is running!"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
