import json
from dotenv import load_dotenv, dotenv_values
from fastapi import FastAPI
from db.dbConn import PostgresConn
from model.model import ModelTraining
from model.chat import Chat

load_dotenv()
settings = dotenv_values(".env")
app = FastAPI()

@app.get("/")
async def home():
    return {"message": "Olá mundo!"}

@app.get("/update-model")
async def update():

    db = PostgresConn(settings)
    ModelTraining(json.loads(db.get_full_report()), 300)
    db.close()

    return {"message": "Modelo treinado"}

@app.post("/msg/{msg}")
async def answer(msg):

    db = PostgresConn(settings)
    ans = Chat(json.loads(db.get_full_report())).chatting(msg)
    db.close()

    return {"answer":ans}

