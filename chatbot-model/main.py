import json
from dotenv import load_dotenv, dotenv_values
from fastapi import FastAPI, Request
from db.connection import Database
from model.model import ModelTraining
from model.chat import Chat
from request.model import Question

def create_app():
    load_dotenv()
    settings = dotenv_values(".env")
    app, db = FastAPI(), Database(settings)

    @app.middleware("http")
    async def db_session_middleware(request: Request, call_next):
        request.state.pool = db._pool
        response = await call_next(request)
        return response

    @app.on_event("startup")
    async def startup():
        await db.create_pool()

    @app.on_event("shutdown")
    async def shutdown():
        await db.close()
        pass

    @app.get("/")
    async def home(request: Request):
        return {"message": "Olá mundo!"}

    @app.get("/train-model")
    async def update(request: Request):
        report = await db.get_full_report()
        ModelTraining(json.loads(report), 5000)

        return {
            "message": "Modelo treinado"
        }

    @app.post("/question")
    async def answer(request: Request, question: Question):
        question = question.question
        report = await db.get_full_report()
        chat = Chat(json.loads(report))
        ans = chat.make_question(question)

        return ans
    
    return app

app = create_app()
