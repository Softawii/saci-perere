import json
from dotenv import load_dotenv, dotenv_values
from fastapi import FastAPI
from db.dbConn import PostgresConn
from model.model import ModelTraining
from model.chat import Chat
from request.model import Question

load_dotenv()
settings = dotenv_values(".env")
app = FastAPI()

@app.get("/")
async def home():
    return {"message": "Olá mundo!"}

@app.get("/update-model")
async def update():
    
    db = PostgresConn(settings)
    try:
        ModelTraining(json.loads(db.get_full_report()), 300)
    finally:
        db.close()

    return {
        "message": "Modelo treinado"
    }

@app.post("/msg")
async def answer(question: Question):

    db = PostgresConn(settings)
    try:
        chat = Chat(json.loads(db.get_full_report()))
        ans = chat.make_question(question)
    finally:
        db.close()

    return ans

