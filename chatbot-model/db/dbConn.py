import psycopg2 as ps

class PostgresConn():
    _conn = None
    def __init__(self, db, usr, pwd, hostName, prt):
        self._conn = ps.connect(database=db, user = usr, password = pwd, host = hostName, port = prt)
    
    def get_data(self):
        cur = self._conn.cursor()
        sql = "SELECT json_agg(row_to_json(questions)) AS result FROM (SELECT question.id, question.question, (SELECT json_agg(answers.answer) AS answers FROM (SELECT answer.answer from chatbot.question_answer answer WHERE answer.question_id = question.id) answers) from chatbot.category_question question) questions"

        cur.execute(sql)
        results = cur.fetchall()
        return results
    
    def close(self):
        self._conn.close()
