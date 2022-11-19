--
-- PostgreSQL database dump
--

-- Dumped from database version 14.3 (Ubuntu 14.3-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.3 (Ubuntu 14.3-0ubuntu0.22.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: saci; Type: SCHEMA; Schema: -; Owner: saci
--

CREATE SCHEMA saci;


ALTER SCHEMA saci OWNER TO "saci";

--
-- Name: full_report(); Type: FUNCTION; Schema: saci; Owner: saci
--

CREATE FUNCTION saci.full_report() RETURNS character varying
    LANGUAGE plpgsql
    AS $$
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
$$;


ALTER FUNCTION saci.full_report() OWNER TO "saci";

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: answer; Type: TABLE; Schema: saci; Owner: saci
--

CREATE TABLE saci.answer (
    id integer NOT NULL,
    value character varying(1000) NOT NULL
);


ALTER TABLE saci.answer OWNER TO "saci";

--
-- Name: answer_id_seq; Type: SEQUENCE; Schema: saci; Owner: saci
--

CREATE SEQUENCE saci.answer_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE saci.answer_id_seq OWNER TO "saci";

--
-- Name: answer_id_seq; Type: SEQUENCE OWNED BY; Schema: saci; Owner: saci
--

ALTER SEQUENCE saci.answer_id_seq OWNED BY saci.answer.id;


--
-- Name: category; Type: TABLE; Schema: saci; Owner: saci
--

CREATE TABLE saci.category (
    id integer NOT NULL,
    topic_id integer NOT NULL,
    name character varying(100) NOT NULL,
    description character varying(200)
);


ALTER TABLE saci.category OWNER TO "saci";

--
-- Name: category_id_seq; Type: SEQUENCE; Schema: saci; Owner: saci
--

CREATE SEQUENCE saci.category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE saci.category_id_seq OWNER TO "saci";

--
-- Name: category_id_seq; Type: SEQUENCE OWNED BY; Schema: saci; Owner: saci
--

ALTER SEQUENCE saci.category_id_seq OWNED BY saci.category.id;


--
-- Name: feedback; Type: TABLE; Schema: saci; Owner: saci
--

CREATE TABLE saci.feedback (
    id integer NOT NULL,
    history_id integer NOT NULL,
    status numeric(2,0) NOT NULL,
    user_feedback character varying(200)
);


ALTER TABLE saci.feedback OWNER TO "saci";

--
-- Name: feedback_id_seq; Type: SEQUENCE; Schema: saci; Owner: saci
--

CREATE SEQUENCE saci.feedback_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE saci.feedback_id_seq OWNER TO "saci";

--
-- Name: feedback_id_seq; Type: SEQUENCE OWNED BY; Schema: saci; Owner: saci
--

ALTER SEQUENCE saci.feedback_id_seq OWNED BY saci.feedback.id;


--
-- Name: history; Type: TABLE; Schema: saci; Owner: saci
--

CREATE TABLE saci.history (
    id integer NOT NULL,
    "time" timestamp with time zone NOT NULL,
    user_question character varying(100) NOT NULL,
    found_question_id integer,
    platform_id integer,
    predicted_score real NOT NULL
);


ALTER TABLE saci.history OWNER TO "saci";

--
-- Name: history_id_seq; Type: SEQUENCE; Schema: saci; Owner: saci
--

CREATE SEQUENCE saci.history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE saci.history_id_seq OWNER TO "saci";

--
-- Name: history_id_seq; Type: SEQUENCE OWNED BY; Schema: saci; Owner: saci
--

ALTER SEQUENCE saci.history_id_seq OWNED BY saci.history.id;


--
-- Name: platform; Type: TABLE; Schema: saci; Owner: saci
--

CREATE TABLE saci.platform (
    id integer NOT NULL,
    name character varying(50) NOT NULL
);


ALTER TABLE saci.platform OWNER TO "saci";

--
-- Name: platform_id_seq; Type: SEQUENCE; Schema: saci; Owner: saci
--

CREATE SEQUENCE saci.platform_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE saci.platform_id_seq OWNER TO "saci";

--
-- Name: platform_id_seq; Type: SEQUENCE OWNED BY; Schema: saci; Owner: saci
--

ALTER SEQUENCE saci.platform_id_seq OWNED BY saci.platform.id;


--
-- Name: question; Type: TABLE; Schema: saci; Owner: saci
--

CREATE TABLE saci.question (
    id integer NOT NULL,
    category_id integer NOT NULL,
    answer_id integer NOT NULL,
    value character varying(500) NOT NULL
);


ALTER TABLE saci.question OWNER TO "saci";

--
-- Name: question_id_seq; Type: SEQUENCE; Schema: saci; Owner: saci
--

CREATE SEQUENCE saci.question_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE saci.question_id_seq OWNER TO "saci";

--
-- Name: question_id_seq; Type: SEQUENCE OWNED BY; Schema: saci; Owner: saci
--

ALTER SEQUENCE saci.question_id_seq OWNED BY saci.question.id;


--
-- Name: topic; Type: TABLE; Schema: saci; Owner: saci
--

CREATE TABLE saci.topic (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    description character varying(200)
);


ALTER TABLE saci.topic OWNER TO "saci";

--
-- Name: topic_id_seq; Type: SEQUENCE; Schema: saci; Owner: saci
--

CREATE SEQUENCE saci.topic_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE saci.topic_id_seq OWNER TO "saci";

--
-- Name: topic_id_seq; Type: SEQUENCE OWNED BY; Schema: saci; Owner: saci
--

ALTER SEQUENCE saci.topic_id_seq OWNED BY saci.topic.id;


--
-- Name: unknown_question; Type: TABLE; Schema: saci; Owner: saci
--

CREATE TABLE saci.unknown_question (
    id integer NOT NULL,
    user_question character varying(100) NOT NULL,
    predicted_question_id integer,
    predicted_score real NOT NULL
);


ALTER TABLE saci.unknown_question OWNER TO "saci";

--
-- Name: unknown_question_id_seq; Type: SEQUENCE; Schema: saci; Owner: saci
--

CREATE SEQUENCE saci.unknown_question_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE saci.unknown_question_id_seq OWNER TO "saci";

--
-- Name: unknown_question_id_seq; Type: SEQUENCE OWNED BY; Schema: saci; Owner: saci
--

ALTER SEQUENCE saci.unknown_question_id_seq OWNED BY saci.unknown_question.id;


--
-- Name: user; Type: TABLE; Schema: saci; Owner: saci
--

CREATE TABLE saci."user" (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(60) NOT NULL,
    name character varying(60) NOT NULL,
    email character varying(320) NOT NULL,
    isadmin boolean DEFAULT false NOT NULL
);


ALTER TABLE saci."user" OWNER TO "saci";

--
-- Name: user_category_favorite; Type: TABLE; Schema: saci; Owner: saci
--

CREATE TABLE saci.user_category_favorite (
    user_id integer NOT NULL,
    category_id integer NOT NULL
);


ALTER TABLE saci.user_category_favorite OWNER TO "saci";

--
-- Name: user_id_seq; Type: SEQUENCE; Schema: saci; Owner: saci
--

CREATE SEQUENCE saci.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE saci.user_id_seq OWNER TO "saci";

--
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: saci; Owner: saci
--

ALTER SEQUENCE saci.user_id_seq OWNED BY saci."user".id;


--
-- Name: user_topic_favorite; Type: TABLE; Schema: saci; Owner: saci
--

CREATE TABLE saci.user_topic_favorite (
    user_id integer NOT NULL,
    topic_id integer NOT NULL
);


ALTER TABLE saci.user_topic_favorite OWNER TO "saci";

--
-- Name: answer id; Type: DEFAULT; Schema: saci; Owner: saci
--

ALTER TABLE ONLY saci.answer ALTER COLUMN id SET DEFAULT nextval('saci.answer_id_seq'::regclass);


--
-- Name: category id; Type: DEFAULT; Schema: saci; Owner: saci
--

ALTER TABLE ONLY saci.category ALTER COLUMN id SET DEFAULT nextval('saci.category_id_seq'::regclass);


--
-- Name: feedback id; Type: DEFAULT; Schema: saci; Owner: saci
--

ALTER TABLE ONLY saci.feedback ALTER COLUMN id SET DEFAULT nextval('saci.feedback_id_seq'::regclass);


--
-- Name: history id; Type: DEFAULT; Schema: saci; Owner: saci
--

ALTER TABLE ONLY saci.history ALTER COLUMN id SET DEFAULT nextval('saci.history_id_seq'::regclass);


--
-- Name: platform id; Type: DEFAULT; Schema: saci; Owner: saci
--

ALTER TABLE ONLY saci.platform ALTER COLUMN id SET DEFAULT nextval('saci.platform_id_seq'::regclass);


--
-- Name: question id; Type: DEFAULT; Schema: saci; Owner: saci
--

ALTER TABLE ONLY saci.question ALTER COLUMN id SET DEFAULT nextval('saci.question_id_seq'::regclass);


--
-- Name: topic id; Type: DEFAULT; Schema: saci; Owner: saci
--

ALTER TABLE ONLY saci.topic ALTER COLUMN id SET DEFAULT nextval('saci.topic_id_seq'::regclass);


--
-- Name: unknown_question id; Type: DEFAULT; Schema: saci; Owner: saci
--

ALTER TABLE ONLY saci.unknown_question ALTER COLUMN id SET DEFAULT nextval('saci.unknown_question_id_seq'::regclass);


--
-- Name: user id; Type: DEFAULT; Schema: saci; Owner: saci
--

ALTER TABLE ONLY saci."user" ALTER COLUMN id SET DEFAULT nextval('saci.user_id_seq'::regclass);


--
-- Data for Name: answer; Type: TABLE DATA; Schema: saci; Owner: saci
--

INSERT INTO saci.answer VALUES (1, 'A apresentação se encontra no link: https://www.cc.ufrrj.br/wp-content/uploads/2019/11/Apresenta%C3%A7%C3%A3oAtividadesAut%C3%B4nomas.pdf');
INSERT INTO saci.answer VALUES (2, 'O manual se encontra em: https://www.cc.ufrrj.br/wp-content/uploads/2014/03/manual_de_atividades_academicas_complementares.pdf');
INSERT INTO saci.answer VALUES (3, 'Os responsáveis pelas atividades autônomas são:
Prof. Daniel Fabio Domingues Posner; Prof. Leandro Guimarães Marques Alvim; Prof. Ubiratam Carvalho de Paula Junior
E-mail: ac.dcc.ufrrj@gmail.com');
INSERT INTO saci.answer VALUES (4, '1 – Entrar no SIGAA;
2 – Abrir a aba de Ensino;
3 – Clicar em Registro de Atividades Autônomas;
4 – Clicar em Cadastrar Novo Registro;
5 – Preencher Dados da Atividade;
5.1 – Comprovante da Atividade: anexar num único arquivo os documentos exigidos na deliberação CEPE 78/2007, no formato PDF;
5.2 – Tipo de Atividade Autônoma: selecionar atividade;
5.3 – Observação/Descrição: descrever o nome do evento/atividade;
6 – Clicar em Cadastrar;');
INSERT INTO saci.answer VALUES (5, 'O prazo de envio é na semana anterior à semana das Provas Optativas.
Envios realizados fora do prazo correm risco de não serem contabilizados no mesmo período.');
INSERT INTO saci.answer VALUES (6, 'As AAs são uma exigência legal para a integralização de currículo.
Resolução CNE/CP Nº 2, de 19/02/2002
Deliberação CEPE Nº 78, de 05/10/2007');
INSERT INTO saci.answer VALUES (7, 'Conforme a deliberação CEPE Nº 78, de 05/10/2007, são exigidas 200 horas de atividades autônomas.');
INSERT INTO saci.answer VALUES (8, 'O aluno não deve associar uma hora concluída de AA com uma hora real realizada. Considere uma hora de AA concluída como um ponto realizado de 200 pontos totais.');
INSERT INTO saci.answer VALUES (9, 'Os grupos são: ensino, pesquisa, extensão e representação estudantil.');
INSERT INTO saci.answer VALUES (10, '1. O aluno deverá realizar atividades de pelo menos 2 (dois) grupos;
2. Apresentar documentação comprobatória da atividade de acordo com o que está
especificado nas tabelas da seção anterior e na tabela do ANEXO I. Nos documentos
comprobatórios deve constar carga horária, dia, mês, ano e instituição;
3. Quando não houver possibilidade de certificação, apresentar um breve relato por
escrito da atividade que assistiu e/ou participou efetivamente, demonstrando a importância
para sua formação profissional; datar e assinar e colher a assinatura de um responsável pela
atividade;
4. Os documentos comprobatórios deverão ser entregues em conjunto com o formulário
de encaminhamento (anexo) devidamente preenchido. O original dos documentos será
posteriormente solicitado pela comissão para a verificação e devem ser guardados pelo aluno.
5. A avaliação dos documentos entregues e a contabilização das horas no sistema
acadêmico será realizada posteriormente pela com comissão.');
INSERT INTO saci.answer VALUES (11, 'a) as horas reais não correspondem às horas das AAs.
b) O conceito semestre não é relativo a fazer apenas dentro do período
c) Se uma atividade contabiliza x horas por semestre e você realizou em menos de seis meses, então contabilize proporcional ao número de meses');
INSERT INTO saci.answer VALUES (12, 'E-mail: ac.dcc.ufrrj@gmail.com
Pessoalmente: Leandro Alvim - Sala 211 MUL; Ubiratan de Paula - Sala 211 MUL; Daniel Posner - Sala 205 MUL;
Informações no site do DCC;
https://www.cc.ufrrj.br/coordenacoes/#symple-tab-comissao-de-ativ-autonomas');
INSERT INTO saci.answer VALUES (13, 'Tipo de Atividade: Participação em órgãos colegiados da UFRRJ ou Comissões designadas por portaria oficial.
Documentação Comprobatória: Declaração da Secretaria dos Conselhos atestando a participação e a frequência do aluno no semestre ou Portaria.
Horas obtidas: 10 horas por semestre.');
INSERT INTO saci.answer VALUES (14, 'Vale 30 horas por disciplina.
Comprobatório: Apresentação de histórico escolar oficial ou declaração da instituição atestando a aprovação, anexando o programa da disciplina e bibliografia.');
INSERT INTO saci.answer VALUES (15, 'Valem 30 horas por semestre.
Comprobatório: Declaração atestando a condição de bolsista durante o semestre e o tipo de
bolsa e apresentação de relatório das atividades.');
INSERT INTO saci.answer VALUES (16, 'Valem 30 horas por semestre.
Comprobatório: Declaração da instituição atestando a condição de estagiário e o horário do estágio e apresentação de relatório das atividades desenvolvidas no semestre com o “de acordo” do orientador de estágio.');
INSERT INTO saci.answer VALUES (17, 'Valem 20 horas por semestre.
Comprobatório: Declaração do curso atestando matrícula e aprovação no módulo ou nível no semestre.
');
INSERT INTO saci.answer VALUES (18, 'Valem 10 horas por semestre.
Comprobatório: Entrega do material ou declaração de docente atestando sua realização e sua relação com o ensino da disciplina.');
INSERT INTO saci.answer VALUES (19, 'Valem 10 horas por participação, acrescido de 10 a 30%, em caso de premiação nos três primeiros lugares.
Comprobatório: Apresentação da monografia e declaração da instituição ou sociedade promotora do concurso.');
INSERT INTO saci.answer VALUES (20, 'Valem 30 horas por participação.
Comprobatório: Declaração da instituição onde foi realizado o intercâmbio mencionado e o período de sua realização.');
INSERT INTO saci.answer VALUES (21, 'Valem 30 horas por semestre.
Comprobatório: Apresentação da carta-contrato ou termo de responsabilidade do bolsista, além de relatório da pesquisa aprovado realizado referente ao semestre.');
INSERT INTO saci.answer VALUES (22, 'Valem 10 horas por produto.
Comprobatório: Apresentação do produto (resenha, relatório, artigo, monografia).');
INSERT INTO saci.answer VALUES (23, 'Valem 20 horas por artigo.
Comprobatório: Apresentação do produto publicado no periódico, na obra coletiva ou o livro.');
INSERT INTO saci.answer VALUES (24, 'Valem 5 horas por artigo.
Comprobatório: Fotocópia do texto publicado pelo evento.');
INSERT INTO saci.answer VALUES (25, 'Valem 10 horas por evento.
Comprobatório: Certificado de apresentação.');
INSERT INTO saci.answer VALUES (26, 'Valem 30 horas por projeto.
Comprobatório: Declaração do Decanato de Extensão ou do responsável pelo programa ou projeto e apresentação de relatório.');
INSERT INTO saci.answer VALUES (27, 'Valem 30 horas por semestre.
Comprobatório: Declaração ou Certificado de participação e apresentação de relatório sobre o curso/oficina.');
INSERT INTO saci.answer VALUES (28, 'Valem 5 horas por evento.
Comprobatório: Declaração ou Certificado de participação.');
INSERT INTO saci.answer VALUES (29, 'Valem 10 horas por trabalho.
Comprobatório: Certificado de apresentação do trabalho e declaração do organizador do evento.');
INSERT INTO saci.answer VALUES (30, 'Valem 2 horas por evento.
Comprobatório: Declaração ou Certificado de participação no evento.');
INSERT INTO saci.answer VALUES (31, 'Valem 10 horas por evento.
Comprobatório: Declaração da instituição ou sociedade responsável pelo evento.');
INSERT INTO saci.answer VALUES (32, 'Valem 5 horas por período letivo de participação.
Comprobatório: Declaração do Maestro do Coral da UFRRJ.');
INSERT INTO saci.answer VALUES (33, 'Valem 5 horas por período letivo de participação.
Comprobatório: Declaração do Decanato de Extensão (DEXT) da UFRRJ ou Setor Responsável do DEXT.');
INSERT INTO saci.answer VALUES (34, 'Valem 4 horas por participação.
Comprobatório: Declaração do Decanato de Extensão da UFRRJ ou Setor Responsável do DEXT.');
INSERT INTO saci.answer VALUES (35, 'Valem 2 horas por período letivo.
Comprobatório: Declaração do Decanato de Extensão da UFRRJ ou Setor Responsável do DEXT.');
INSERT INTO saci.answer VALUES (36, 'Valem até 30 horas por participação, a critério da Coordenação do Curso.
Comprobatório: Declaração da Instituição beneficiada pelo trabalho voluntário.');
INSERT INTO saci.answer VALUES (37, 'Valem 10 horas por semestre.
Comprobatório: Declaração da Secretaria dos Conselhos atestando a participação e a frequência do aluno no semestre ou Portaria.');
INSERT INTO saci.answer VALUES (38, 'Não há limite de tempo para envio de certificados. Basta estar dentro do período de tempo que cursam a universidade.');
INSERT INTO saci.answer VALUES (39, 'Cursos com ch >=30h ---> 30h de atividades Autônomas.
Cursos com ch<10h ---> 5h de atividades Autônomas.
Entre 10h e 30h de ch ---> 15h de atividades Autônomas');
INSERT INTO saci.answer VALUES (40, 'Não há limite por grupo. Entretanto, há de se preencher pelo menos dois grupos.');
INSERT INTO saci.answer VALUES (41, 'Você deve enviar um contrato ou termo aditivo, pois é necessário comprovar a vigência do estágio.');
INSERT INTO saci.answer VALUES (42, 'Não. Não é permitida a duplicidade no aproveitamento.');


--
-- Data for Name: category; Type: TABLE DATA; Schema: saci; Owner: saci
--

INSERT INTO saci.category VALUES (1, 1, 'Atividades Autônomas', NULL);


--
-- Data for Name: feedback; Type: TABLE DATA; Schema: saci; Owner: saci
--



--
-- Data for Name: history; Type: TABLE DATA; Schema: saci; Owner: saci
--



--
-- Data for Name: platform; Type: TABLE DATA; Schema: saci; Owner: saci
--

INSERT INTO saci.platform VALUES (1, 'unknown');
INSERT INTO saci.platform VALUES (2, 'discord');


--
-- Data for Name: question; Type: TABLE DATA; Schema: saci; Owner: saci
--

INSERT INTO saci.question VALUES (1, 1, 1, 'Aonde encontro a apresentação de atividades autônomas ?');
INSERT INTO saci.question VALUES (2, 1, 2, 'Aonde encontro o manual de atividades autônomas ?');
INSERT INTO saci.question VALUES (3, 1, 3, 'Quem são os responsáveis pelas atividades autônomas?');
INSERT INTO saci.question VALUES (4, 1, 4, 'Como eu envio as Atividades Autônomas ?');
INSERT INTO saci.question VALUES (5, 1, 5, 'Qual o prazo de envio das Atividades Autônomas ?');
INSERT INTO saci.question VALUES (6, 1, 6, 'O que é uma atividade autônoma ?');
INSERT INTO saci.question VALUES (7, 1, 7, 'Quantas horas são exigidas para integralização das Atividades Autônomas ?');
INSERT INTO saci.question VALUES (8, 1, 8, 'O que representa uma hora de atividade autônoma ?');
INSERT INTO saci.question VALUES (9, 1, 9, 'Quais são os grupos das Atividades Autônomas ?');
INSERT INTO saci.question VALUES (10, 1, 10, 'Qual o critério para a integralização (completar) as Atividades Autônomas ?');
INSERT INTO saci.question VALUES (11, 1, 11, 'Quais são os erros (dificuldades) comuns ?');
INSERT INTO saci.question VALUES (12, 1, 12, 'Como entro em contato ?');
INSERT INTO saci.question VALUES (13, 1, 13, 'O que é o grupo Representação Estudantil ?');
INSERT INTO saci.question VALUES (14, 1, 14, 'Quantas horas vale a disciplina não curricular cursada fora da UFRRJ e disciplina de Livre Escolha ?');
INSERT INTO saci.question VALUES (15, 1, 15, 'Quantas horas valem Bolsas concedidas pela UFRRJ (monitoria, estágio
interno, entre outras) ?');
INSERT INTO saci.question VALUES (16, 1, 16, 'Quantas horas valem Estágios extracurriculares ?');
INSERT INTO saci.question VALUES (17, 1, 17, 'Quanto vale em horas Realização de curso regular de língua estrangeira ?');
INSERT INTO saci.question VALUES (18, 1, 18, 'Quantas horas valem Desenvolvimento de material didático ?');
INSERT INTO saci.question VALUES (19, 1, 19, 'Quantas horas valem Participação em concursos de monografia ?');
INSERT INTO saci.question VALUES (20, 1, 20, 'Quantas horas valem Participação em intercâmbio ou convênio
cultural aprovado pela instituição ?');
INSERT INTO saci.question VALUES (21, 1, 21, 'Quantas horas valem Bolsas de iniciação científica concedidas pela UFRRJ ou por
agências de fomento ?');
INSERT INTO saci.question VALUES (22, 1, 22, 'Quantas horas valem Desenvolvimento de pesquisa com produto final ?');
INSERT INTO saci.question VALUES (23, 1, 23, 'Quantas horas valem Participação em artigos publicados em periódicos nacionais e internacionais, capítulo de livro ou autoria de livro ?');
INSERT INTO saci.question VALUES (24, 1, 24, 'Quantas horas valem Participação em resumos e anais de Eventos Científicos
publicados a partir de Congressos, Simpósios, Jornadas de Iniciação Científica e de Extensão ?');
INSERT INTO saci.question VALUES (25, 1, 25, 'Quantas horas valem Apresentação de trabalho científico em eventos ?');
INSERT INTO saci.question VALUES (26, 1, 26, 'Quantas horas valem Participação em programas e projetos de extensão ?');
INSERT INTO saci.question VALUES (27, 1, 27, 'Quantas horas valem Realização de cursos de extensão ou participação em oficinas ?');
INSERT INTO saci.question VALUES (28, 1, 28, 'Quantas horas valem Participação como ouvinte em congressos, seminários,
simpósios, conferências, oficinas de trabalho e similares ?');
INSERT INTO saci.question VALUES (29, 1, 29, 'Quantas horas valem Apresentação de trabalho em congressos, seminários,
simpósios, conferências, oficinas de trabalho e similares ?');
INSERT INTO saci.question VALUES (30, 1, 30, 'Quantas horas valem Participação como conferencista, mediador ou debatedor em eventos acadêmicos e científicos ?');
INSERT INTO saci.question VALUES (31, 1, 31, 'Quantas horas valem Organização de eventos acadêmicos, científicos, culturais ?');
INSERT INTO saci.question VALUES (32, 1, 32, 'Quantas horas valem Participação no Coral da UFRRJ ?');
INSERT INTO saci.question VALUES (33, 1, 33, 'Quantas horas valem Participação em grupos de teatro ou grupos regionais reconhecidos na UFRRJ ?');
INSERT INTO saci.question VALUES (34, 1, 34, 'Quantas horas valem Representação da UFRRJ em eventos esportivos oficiais ?');
INSERT INTO saci.question VALUES (35, 1, 35, 'Quantas horas valem Participação em atividades esportivas ou em competições internas da UFRRJ ?');
INSERT INTO saci.question VALUES (36, 1, 36, 'Quantas horas valem Participação, como voluntário, em atividades de caráter humanitário e social ?');
INSERT INTO saci.question VALUES (37, 1, 37, 'Quantas horas valem Participação em órgãos colegiados da UFRRJ ou
Comissões designadas por portaria oficial ?');
INSERT INTO saci.question VALUES (38, 1, 38, 'Existe limite de tempo para envio de certificados ?');
INSERT INTO saci.question VALUES (39, 1, 39, 'Quantas horas valem realização de cursos de extensão ou participação em oficinas Declaração ou Certificado de participação e apresentação de relatório sobre o curso/oficina ?');
INSERT INTO saci.question VALUES (40, 1, 40, 'Qual é o limite mínimo e máximo de horas por grupo?');
INSERT INTO saci.question VALUES (41, 1, 41, 'Qual é o documento que devemos enviar para contabilizar as horas complementares de estágio ?');
INSERT INTO saci.question VALUES (42, 1, 42, 'Se eu usar essas AAs como eletiva. Posso usar a eletiva para outra coisa ?');


--
-- Data for Name: topic; Type: TABLE DATA; Schema: saci; Owner: saci
--

INSERT INTO saci.topic VALUES (1, 'DCC', NULL);


--
-- Data for Name: unknown_question; Type: TABLE DATA; Schema: saci; Owner: saci
--



--
-- Data for Name: user; Type: TABLE DATA; Schema: saci; Owner: saci
--



--
-- Data for Name: user_category_favorite; Type: TABLE DATA; Schema: saci; Owner: saci
--



--
-- Data for Name: user_topic_favorite; Type: TABLE DATA; Schema: saci; Owner: saci
--



--
-- Name: answer_id_seq; Type: SEQUENCE SET; Schema: saci; Owner: saci
--

SELECT pg_catalog.setval('saci.answer_id_seq', 42, true);


--
-- Name: category_id_seq; Type: SEQUENCE SET; Schema: saci; Owner: saci
--

SELECT pg_catalog.setval('saci.category_id_seq', 1, true);


--
-- Name: feedback_id_seq; Type: SEQUENCE SET; Schema: saci; Owner: saci
--

SELECT pg_catalog.setval('saci.feedback_id_seq', 1, false);


--
-- Name: history_id_seq; Type: SEQUENCE SET; Schema: saci; Owner: saci
--

SELECT pg_catalog.setval('saci.history_id_seq', 1, false);


--
-- Name: platform_id_seq; Type: SEQUENCE SET; Schema: saci; Owner: saci
--

SELECT pg_catalog.setval('saci.platform_id_seq', 2, true);


--
-- Name: question_id_seq; Type: SEQUENCE SET; Schema: saci; Owner: saci
--

SELECT pg_catalog.setval('saci.question_id_seq', 42, true);


--
-- Name: topic_id_seq; Type: SEQUENCE SET; Schema: saci; Owner: saci
--

SELECT pg_catalog.setval('saci.topic_id_seq', 1, true);


--
-- Name: unknown_question_id_seq; Type: SEQUENCE SET; Schema: saci; Owner: saci
--

SELECT pg_catalog.setval('saci.unknown_question_id_seq', 1, false);


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: saci; Owner: saci
--

SELECT pg_catalog.setval('saci.user_id_seq', 1, false);


--
-- Name: answer answer_pkey; Type: CONSTRAINT; Schema: saci; Owner: saci
--

ALTER TABLE ONLY saci.answer
    ADD CONSTRAINT answer_pkey PRIMARY KEY (id);


--
-- Name: category category_name_key; Type: CONSTRAINT; Schema: saci; Owner: saci
--

ALTER TABLE ONLY saci.category
    ADD CONSTRAINT category_name_key UNIQUE (name);


--
-- Name: category category_pkey; Type: CONSTRAINT; Schema: saci; Owner: saci
--

ALTER TABLE ONLY saci.category
    ADD CONSTRAINT category_pkey PRIMARY KEY (id);


--
-- Name: feedback feedback_history_id_key; Type: CONSTRAINT; Schema: saci; Owner: saci
--

ALTER TABLE ONLY saci.feedback
    ADD CONSTRAINT feedback_history_id_key UNIQUE (history_id);


--
-- Name: feedback feedback_pkey; Type: CONSTRAINT; Schema: saci; Owner: saci
--

ALTER TABLE ONLY saci.feedback
    ADD CONSTRAINT feedback_pkey PRIMARY KEY (id);


--
-- Name: history history_pkey; Type: CONSTRAINT; Schema: saci; Owner: saci
--

ALTER TABLE ONLY saci.history
    ADD CONSTRAINT history_pkey PRIMARY KEY (id);


--
-- Name: platform platform_name_key; Type: CONSTRAINT; Schema: saci; Owner: saci
--

ALTER TABLE ONLY saci.platform
    ADD CONSTRAINT platform_name_key UNIQUE (name);


--
-- Name: platform platform_pkey; Type: CONSTRAINT; Schema: saci; Owner: saci
--

ALTER TABLE ONLY saci.platform
    ADD CONSTRAINT platform_pkey PRIMARY KEY (id);


--
-- Name: question question_pkey; Type: CONSTRAINT; Schema: saci; Owner: saci
--

ALTER TABLE ONLY saci.question
    ADD CONSTRAINT question_pkey PRIMARY KEY (id);


--
-- Name: topic topic_name_key; Type: CONSTRAINT; Schema: saci; Owner: saci
--

ALTER TABLE ONLY saci.topic
    ADD CONSTRAINT topic_name_key UNIQUE (name);


--
-- Name: topic topic_pkey; Type: CONSTRAINT; Schema: saci; Owner: saci
--

ALTER TABLE ONLY saci.topic
    ADD CONSTRAINT topic_pkey PRIMARY KEY (id);


--
-- Name: unknown_question unknown_question_pkey; Type: CONSTRAINT; Schema: saci; Owner: saci
--

ALTER TABLE ONLY saci.unknown_question
    ADD CONSTRAINT unknown_question_pkey PRIMARY KEY (id);


--
-- Name: user_category_favorite user_category_favorite_pkey; Type: CONSTRAINT; Schema: saci; Owner: saci
--

ALTER TABLE ONLY saci.user_category_favorite
    ADD CONSTRAINT user_category_favorite_pkey PRIMARY KEY (user_id, category_id);


--
-- Name: user user_email_key; Type: CONSTRAINT; Schema: saci; Owner: saci
--

ALTER TABLE ONLY saci."user"
    ADD CONSTRAINT user_email_key UNIQUE (email);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: saci; Owner: saci
--

ALTER TABLE ONLY saci."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: user_topic_favorite user_topic_favorite_pkey; Type: CONSTRAINT; Schema: saci; Owner: saci
--

ALTER TABLE ONLY saci.user_topic_favorite
    ADD CONSTRAINT user_topic_favorite_pkey PRIMARY KEY (user_id, topic_id);


--
-- Name: user user_username_key; Type: CONSTRAINT; Schema: saci; Owner: saci
--

ALTER TABLE ONLY saci."user"
    ADD CONSTRAINT user_username_key UNIQUE (username);


--
-- Name: category category_topic_id_fkey; Type: FK CONSTRAINT; Schema: saci; Owner: saci
--

ALTER TABLE ONLY saci.category
    ADD CONSTRAINT category_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES saci.topic(id) ON DELETE CASCADE;


--
-- Name: feedback feedback_history_id_fkey; Type: FK CONSTRAINT; Schema: saci; Owner: saci
--

ALTER TABLE ONLY saci.feedback
    ADD CONSTRAINT feedback_history_id_fkey FOREIGN KEY (history_id) REFERENCES saci.history(id) ON DELETE RESTRICT;


--
-- Name: history history_found_question_id_fkey; Type: FK CONSTRAINT; Schema: saci; Owner: saci
--

ALTER TABLE ONLY saci.history
    ADD CONSTRAINT history_found_question_id_fkey FOREIGN KEY (found_question_id) REFERENCES saci.question(id) ON DELETE SET NULL;


--
-- Name: history history_platform_id_fkey; Type: FK CONSTRAINT; Schema: saci; Owner: saci
--

ALTER TABLE ONLY saci.history
    ADD CONSTRAINT history_platform_id_fkey FOREIGN KEY (platform_id) REFERENCES saci.platform(id) ON DELETE SET NULL;


--
-- Name: question question_answer_id_fkey; Type: FK CONSTRAINT; Schema: saci; Owner: saci
--

ALTER TABLE ONLY saci.question
    ADD CONSTRAINT question_answer_id_fkey FOREIGN KEY (answer_id) REFERENCES saci.answer(id) ON DELETE CASCADE;


--
-- Name: question question_category_id_fkey; Type: FK CONSTRAINT; Schema: saci; Owner: saci
--

ALTER TABLE ONLY saci.question
    ADD CONSTRAINT question_category_id_fkey FOREIGN KEY (category_id) REFERENCES saci.category(id) ON DELETE CASCADE;


--
-- Name: unknown_question unknown_question_predicted_question_id_fkey; Type: FK CONSTRAINT; Schema: saci; Owner: saci
--

ALTER TABLE ONLY saci.unknown_question
    ADD CONSTRAINT unknown_question_predicted_question_id_fkey FOREIGN KEY (predicted_question_id) REFERENCES saci.question(id) ON DELETE SET NULL;


--
-- Name: user_category_favorite user_category_favorite_category_id_fkey; Type: FK CONSTRAINT; Schema: saci; Owner: saci
--

ALTER TABLE ONLY saci.user_category_favorite
    ADD CONSTRAINT user_category_favorite_category_id_fkey FOREIGN KEY (category_id) REFERENCES saci.category(id) ON DELETE CASCADE;


--
-- Name: user_category_favorite user_category_favorite_user_id_fkey; Type: FK CONSTRAINT; Schema: saci; Owner: saci
--

ALTER TABLE ONLY saci.user_category_favorite
    ADD CONSTRAINT user_category_favorite_user_id_fkey FOREIGN KEY (user_id) REFERENCES saci."user"(id) ON DELETE CASCADE;


--
-- Name: user_topic_favorite user_topic_favorite_topic_id_fkey; Type: FK CONSTRAINT; Schema: saci; Owner: saci
--

ALTER TABLE ONLY saci.user_topic_favorite
    ADD CONSTRAINT user_topic_favorite_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES saci.topic(id) ON DELETE CASCADE;


--
-- Name: user_topic_favorite user_topic_favorite_user_id_fkey; Type: FK CONSTRAINT; Schema: saci; Owner: saci
--

ALTER TABLE ONLY saci.user_topic_favorite
    ADD CONSTRAINT user_topic_favorite_user_id_fkey FOREIGN KEY (user_id) REFERENCES saci."user"(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

