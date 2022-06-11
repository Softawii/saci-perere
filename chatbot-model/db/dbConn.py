import psycopg2 as ps

class PostgresConn():
    _conn = None
    def __init__(self, settings):
        self._conn = ps.connect(database=settings['database'],
                                user = settings['user'],
                                password = settings['password'],
                                host = settings['host'],
                                port = settings['port'])
    
    def get_full_report(self):
        cur = self._conn.cursor()
        cur.execute("SELECT * FROM full_report() AS result")
        results = cur.fetchall()
        return results[0][0]

    def get_questions_report(self):
        cur = self._conn.cursor()
        cur.execute("SELECT * FROM questions_report() AS result")
        results = cur.fetchall()
        return results[0][0]
    
    def close(self):
        self._conn.close()
