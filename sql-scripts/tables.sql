DROP SCHEMA IF EXISTS saci CASCADE;
CREATE SCHEMA IF NOT EXISTS saci;

DROP TABLE IF EXISTS saci.user;
CREATE TABLE IF NOT EXISTS saci.user
(
    id       SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE  NOT NULL,
    password VARCHAR(60)         NOT NULL,
    name     VARCHAR(60)         NOT NULL,
    email    VARCHAR(320) UNIQUE NOT NULL,
    isadmin  BOOL                NOT NULL DEFAULT false
);

DROP TABLE IF EXISTS saci.category;
CREATE TABLE IF NOT EXISTS saci.category
(
    id   SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description VARCHAR(200)
);

DROP TABLE IF EXISTS saci.user_favorite;
CREATE TABLE IF NOT EXISTS saci.user_favorite
(
    user_id     INTEGER NOT NULL REFERENCES saci.user (id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES saci.category (id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, category_id)
);

DROP TABLE IF EXISTS saci.answer;
CREATE TABLE IF NOT EXISTS saci.answer
(
    id    SERIAL PRIMARY KEY,
    value VARCHAR(1000) NOT NULL
);

DROP TABLE IF EXISTS saci.question;
CREATE TABLE IF NOT EXISTS saci.question
(
    id          SERIAL PRIMARY KEY,
    category_id INTEGER      NOT NULL REFERENCES saci.category (id) ON DELETE CASCADE,
    answer_id   INTEGER      NOT NULL REFERENCES saci.answer (id) ON DELETE RESTRICT ,
    value       VARCHAR(100) NOT NULL
);

CREATE OR REPLACE FUNCTION saci.full_report()
    RETURNS VARCHAR AS
$result$
DECLARE
    result VARCHAR;
BEGIN
    SELECT json_agg(row_to_json(data))
    INTO result
    FROM (SELECT question.id          as question_id,
                 question.category_id as category_id,
                 question.value       as question,
                 answer.id            as answer_id,
                 answer.value         as answer
          FROM saci.question question
                   INNER JOIN saci.answer answer on answer.id = question.answer_id) data;
    RETURN result;
END;
$result$ LANGUAGE plpgsql;
