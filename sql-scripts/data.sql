INSERT INTO chatbot.user (username, password, email, name)
VALUES ('eduardo', '$2b$10$YNGKtTOqftxiWRBbo.JIx.O4GvhSeSbKIhn7Oz2nUm.zeCJryYI9a', 'email@email.com', 'eduardo'),
       ('romulo', '$2b$10$YNGKtTOqftxiWRBbo.JIx.O4GvhSeSbKIhn7Oz2nUm.zeCJryYI9a', 'email@email.com', 'romulo');

INSERT INTO chatbot.category (name)
VALUES ('Compiladores'),
       ('Computação Estruturada'),
       ('Aprendizado de Máquina'),
       ('Grafos'),
       ('Orientação a Objetos');

INSERT INTO chatbot.category_question (category_id, question)
SELECT id, concat('O que é ', name, '?')
FROM chatbot.category;

INSERT INTO chatbot.question_answer (question_id, answer)
SELECT q.id, concat(name, ' é o que é')
FROM chatbot.category_question q
         INNER JOIN chatbot.category c ON c.id = q.category_id;

INSERT INTO chatbot.question_answer (question_id, answer)
SELECT q.id, concat(name, ' é a revolução')
FROM chatbot.category_question q
         INNER JOIN chatbot.category c ON c.id = q.category_id;