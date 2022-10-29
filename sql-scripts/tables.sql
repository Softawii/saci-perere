SET timezone = 'America/Sao_Paulo';

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

DROP TABLE IF EXISTS saci.topic;
CREATE TABLE IF NOT EXISTS saci.topic
(
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) UNIQUE NOT NULL,
    description VARCHAR(200)
);

DROP TABLE IF EXISTS saci.category;
CREATE TABLE IF NOT EXISTS saci.category
(
    id          SERIAL PRIMARY KEY,
    topic_id    INTEGER             NOT NULL REFERENCES saci.topic (id) ON DELETE CASCADE,
    name        VARCHAR(100) UNIQUE NOT NULL,
    description VARCHAR(200)
);

DROP TABLE IF EXISTS saci.user_topic_favorite;
CREATE TABLE IF NOT EXISTS saci.user_topic_favorite
(
    user_id  INTEGER NOT NULL REFERENCES saci.user (id) ON DELETE CASCADE,
    topic_id INTEGER NOT NULL REFERENCES saci.topic (id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, topic_id)
);

DROP TABLE IF EXISTS saci.user_category_favorite;
CREATE TABLE IF NOT EXISTS saci.user_category_favorite
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
    answer_id   INTEGER      NOT NULL REFERENCES saci.answer (id) ON DELETE CASCADE,
    value       VARCHAR(500) NOT NULL
);

DROP TABLE IF EXISTS saci.unknown_question;
CREATE TABLE IF NOT EXISTS saci.unknown_question
(
    id                    SERIAL PRIMARY KEY,
    user_question         VARCHAR(100) NOT NULL,
    predicted_question_id INTEGER      NOT NULL REFERENCES saci.question (id) ON DELETE RESTRICT,
    predicted_score       REAL         NOT NULL
);

DROP TABLE IF EXISTS saci.platform;
CREATE TABLE IF NOT EXISTS saci.platform
(
    id   SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

INSERT INTO saci.platform (name)
VALUES ('unknown'),
       ('discord');

DROP TABLE IF EXISTS saci.history;
CREATE TABLE IF NOT EXISTS saci.history
(
    id                SERIAL PRIMARY KEY,
    time              timestamptz  NOT NULL,
    user_question     VARCHAR(100) NOT NULL,
    found_question_id INTEGER      NOT NULL REFERENCES saci.question (id) ON DELETE RESTRICT,
    platform_id       INTEGER      NOT NULL REFERENCES saci.platform (id) ON DELETE RESTRICT
);

DROP TABLE IF EXISTS saci.feedback;
CREATE TABLE IF NOT EXISTS saci.feedback
(
    id            SERIAL PRIMARY KEY,
    history_id    INTEGER       NOT NULL UNIQUE REFERENCES saci.history (id) ON DELETE RESTRICT,
    status        NUMERIC(2, 0) NOT NULL,
    user_feedback VARCHAR(200)
);

CREATE OR REPLACE FUNCTION saci.full_report()
    RETURNS VARCHAR AS
$result$
DECLARE
    result VARCHAR;
BEGIN
    SELECT json_agg(row_to_json(data))
    INTO result
    FROM (SELECT topic.id           AS topic_id,
                 topic.name         AS topic_name,
                 topic.description  AS topic_description,
                 json_agg(category) AS categories
          from saci.topic topic
                   INNER JOIN (SELECT category.id              AS category_id,
                                      category.description     AS category_description,
                                      category.name            AS category_name,
                                      category.topic_id        AS topic_id,
                                      json_agg(question_table) AS questions
                               FROM saci.category category
                                        INNER JOIN saci.topic topic ON category.topic_id = topic.id
                                        INNER JOIN (SELECT question.id            AS question_id,
                                                           question.value         AS question,
                                                           question.category_id   as category_id,
                                                           json_agg(answer_table) AS answers
                                                    FROM saci.question question
                                                             INNER JOIN saci.category category ON question.category_id = category.id
                                                             INNER JOIN (SELECT answer.id AS answer_id, answer.value as answer
                                                                         FROM saci.answer answer
                                                                                  INNER JOIN saci.question ON question.answer_id = answer.id) answer_table
                                                                        ON question.answer_id = answer_table.answer_id
                                                    GROUP BY question.id) question_table
                                                   ON category.id = question_table.category_id

                               GROUP BY category.id) category
                              ON topic.id = category.topic_id
          GROUP BY topic.id) data;
    RETURN result;
END;
$result$ LANGUAGE plpgsql;
