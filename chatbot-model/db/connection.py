import asyncpg

class Database():
    def __init__(self, settings):
        self.settings = settings

    async def close(self):
        if self._pool: await self._pool.close()
    
    async def create_pool(self):
        if hasattr(self,'_pool'): return
        self._pool = await asyncpg.create_pool(database=self.settings['database'],
                                user = self.settings['user'],
                                password = self.settings['password'],
                                host = self.settings['host'],
                                port = self.settings['port'])
    
    async def get_full_report(self):
        async with self._pool.acquire() as con:
            results = await con.fetch("SELECT * FROM full_report() AS result")
            return results[0][0]

    async def get_questions_from_category_id(self, id):
        async with self._pool.acquire() as con:
            results = await con.fetch("SELECT id, value, answer_id from saci.question WHERE category_id = ($1)", id)
            return results

    async def get_answer(self, id):
        async with self._pool.acquire() as con:
            results = await con.fetchrow("SELECT value from saci.answer WHERE id = ($1)", id)
            return results

    async def get_question(self, id):
        async with self._pool.acquire() as con:
            results = await con.fetch("SELECT value from saci.question WHERE id = ($1)", id)
            return results

    async def get_categories(self):
        async with self._pool.acquire() as con:
            results = await con.fetch("SELECT * from saci.category")
            return results

    async def get_categories_by_topic_id(self, topic_id):
        async with self._pool.acquire() as con:
            results = await con.fetch("SELECT * FROM saci.category WHERE topic_id = ($1)", topic_id)
            return results

    async def get_topics(self):
        async with self._pool.acquire() as con:
            results = await con.fetch("SELECT * from saci.topic")
            return results

    async def save_unkwnown_question(self, user_question, predicted_question_id, predicted_score):
        async with self._pool.acquire() as con:
            await con.execute(
                """
                INSERT INTO saci.unknown_question(user_question, predicted_question_id, predicted_score)
                VALUES ($1, $2, $3)
                """, user_question, predicted_question_id, predicted_score)
