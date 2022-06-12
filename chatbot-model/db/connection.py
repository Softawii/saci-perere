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

    async def get_questions_report(self):
        async with self._pool.acquire() as con:
            results = await con.fetch("SELECT * FROM questions_report() AS result")
            return results[0][0]
