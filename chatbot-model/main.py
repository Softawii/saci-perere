import json

from db.dbConn import PostgresConn

with open("config.json", encoding="utf-8") as configJson:
    configs = json.load(configJson)

db = PostgresConn(configs["database"], configs["user"], configs["password"], configs["host"], configs["port"])

print(db.get_data())

db.close()