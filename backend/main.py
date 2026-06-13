from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.router import user
from config.database import Base, engine
from models import models

Base.metadata.create_all(bind=engine)

app = FastAPI(title="API de clientes")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user) 

