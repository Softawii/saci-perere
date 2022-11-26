from dotenv import load_dotenv, dotenv_values
from fastapi import FastAPI, Request
from db.connection import Database
from model import Distiluse_Base_Multilingual_Cased_v2 as QA
from request.model import User_Question, Feedback
import asyncio

def create_app():
    load_dotenv()
    settings = dotenv_values(".env")
    app, db = FastAPI(), Database(settings)

    @app.middleware("http")
    async def db_session_middleware(request: Request, call_next):
        request.state.pool = db._pool
        request.state.model = QA()
        response = await call_next(request)
        return response

    @app.on_event("startup")
    async def startup():
        await QA().compare('', '')
        await db.create_pool()

    @app.on_event("shutdown")
    async def shutdown():
        await db.close()
        pass

    @app.post("/question")
    async def answer(request: Request, user_question: User_Question):
        question = user_question.question
        category_id = user_question.category
        model: QA = request.state.model
        questions_db = await db.get_questions_from_category_id(category_id)
        questions = [question['value'] for question in questions_db]
        result = await model.batch_compare(question, questions)
        best_list_index = result['question_id']
        best = questions_db[best_list_index]
        result['question_id'] = best['id']
        for hit in result['hits']: hit['id'] = questions_db[hit['id']]['id']
        result['answer'] = (await db.get_answer(best['answer_id']))['value']

        platform_id = await db.find_platform(user_question.platform)
        history_id = await db.save_to_history(question, best['id'], platform_id, result['score'])
        result['history_id'] = history_id

        # fire and forget
        if result['score'] < 0.5:
            asyncio.ensure_future(db.save_unkwnown_question(question, result['question_id'], result['score']))

        return result

    @app.post("/give-feedback")
    async def give_feedback(feedback: Feedback):
        # fire and forget
        asyncio.ensure_future(db.save_feedback(feedback))

    @app.get("/categories")
    async def categories():
        return await db.get_categories()

    @app.get("/categories/{topic_id}")
    async def categories_by_topic(topic_id: int):
        return await db.get_categories_by_topic_id(topic_id)

    @app.get("/topics")
    async def topics():
        return await db.get_topics()
    
    return app

app = create_app()
