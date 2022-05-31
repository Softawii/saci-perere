DROP SCHEMA IF EXISTS chatbot CASCADE;
CREATE SCHEMA IF NOT EXISTS chatbot;

DROP TABLE IF EXISTS chatbot.user;
CREATE TABLE IF NOT EXISTS chatbot.user
(
    id       SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(60)        NOT NULL,
    name     VARCHAR(60)        NOT NULL,
    email    VARCHAR(120)       NOT NULL
);

DROP TABLE IF EXISTS chatbot.user_preferences;
CREATE TABLE IF NOT EXISTS chatbot.user_preferences
(
    user_id  INTEGER NOT NULL REFERENCES chatbot.user (id),
    favorite INTEGER[]
);

DROP TABLE IF EXISTS chatbot.category;
CREATE TABLE IF NOT EXISTS chatbot.category
(
    id   SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

DROP TABLE IF EXISTS chatbot.category_question;
CREATE TABLE IF NOT EXISTS chatbot.category_question
(
    id          SERIAL PRIMARY KEY,
    category_id INTEGER      NOT NULL REFERENCES chatbot.category (id),
    question    VARCHAR(100) NOT NULL
);

DROP TABLE IF EXISTS chatbot.question_answer;
CREATE TABLE IF NOT EXISTS chatbot.question_answer
(
    question_id INTEGER      NOT NULL REFERENCES chatbot.category_question (id),
    answer      VARCHAR(300) NOT NULL
);

DROP TABLE IF EXISTS chatbot.system;
CREATE TABLE IF NOT EXISTS chatbot.system
(
    last_change TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE OR REPLACE FUNCTION process_update_last_change() RETURNS TRIGGER as
$update_last_change$
BEGIN
    IF (SELECT count(*) FROM chatbot.system) = 1 THEN
        UPDATE chatbot.system
        SET last_change = current_timestamp
        WHERE last_change = (SELECT last_change
                             FROM chatbot.system
                             LIMIT 1);
    ELSE
        INSERT INTO chatbot.system (last_change) VALUES (current_timestamp);
    END IF;
    RETURN NULL;
END;
$update_last_change$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_last_change_category_trigger ON chatbot.category;
CREATE TRIGGER update_last_change_category_trigger
    AFTER INSERT OR UPDATE OR DELETE
    ON chatbot.category
    FOR EACH STATEMENT
EXECUTE FUNCTION process_update_last_change();

DROP TRIGGER IF EXISTS update_last_change_category_question_trigger ON chatbot.category_question;
CREATE TRIGGER update_last_change_category_question_trigger
    AFTER INSERT OR UPDATE OR DELETE
    ON chatbot.category_question
    FOR EACH STATEMENT
EXECUTE FUNCTION process_update_last_change();

DROP TRIGGER IF EXISTS update_last_change_question_answer_trigger ON chatbot.question_answer;
CREATE TRIGGER update_last_change_question_answer_trigger
    AFTER INSERT OR UPDATE OR DELETE
    ON chatbot.question_answer
    FOR EACH STATEMENT
EXECUTE FUNCTION process_update_last_change();
