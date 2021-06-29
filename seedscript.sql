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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 205 (class 1259 OID 16421)
-- Name: article; Type: TABLE; Schema: public; Owner: postgres
--

CREATE DATABASE realworld WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'en_US.utf8' LC_CTYPE = 'en_US.utf8';


ALTER DATABASE realworld OWNER TO "user";

\connect realworld


CREATE TABLE public.article (
    id integer NOT NULL,
    slug character varying NOT NULL,
    title character varying NOT NULL,
    description character varying DEFAULT ''::character varying NOT NULL,
    body character varying DEFAULT ''::character varying NOT NULL,
    created timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "tagList" text NOT NULL,
    "favoriteCount" integer DEFAULT 0 NOT NULL,
    "authorId" integer
);


ALTER TABLE public.article OWNER TO postgres;

--
-- TOC entry 204 (class 1259 OID 16419)
-- Name: article_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.article_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.article_id_seq OWNER TO postgres;

--
-- TOC entry 3058 (class 0 OID 0)
-- Dependencies: 204
-- Name: article_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.article_id_seq OWNED BY public.article.id;


--
-- TOC entry 203 (class 1259 OID 16410)
-- Name: comment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comment (
    id integer NOT NULL,
    body character varying NOT NULL,
    "articleId" integer
);


ALTER TABLE public.comment OWNER TO postgres;

--
-- TOC entry 202 (class 1259 OID 16408)
-- Name: comment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.comment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.comment_id_seq OWNER TO postgres;

--
-- TOC entry 3059 (class 0 OID 0)
-- Dependencies: 202
-- Name: comment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.comment_id_seq OWNED BY public.comment.id;


--
-- TOC entry 207 (class 1259 OID 16437)
-- Name: follows; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.follows (
    id integer NOT NULL,
    "followerId" integer NOT NULL,
    "followingId" integer NOT NULL
);


ALTER TABLE public.follows OWNER TO postgres;

--
-- TOC entry 206 (class 1259 OID 16435)
-- Name: follows_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.follows_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.follows_id_seq OWNER TO postgres;

--
-- TOC entry 3060 (class 0 OID 0)
-- Dependencies: 206
-- Name: follows_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.follows_id_seq OWNED BY public.follows.id;


--
-- TOC entry 209 (class 1259 OID 16445)
-- Name: tag; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tag (
    id integer NOT NULL,
    tag character varying NOT NULL
);


ALTER TABLE public.tag OWNER TO postgres;

--
-- TOC entry 208 (class 1259 OID 16443)
-- Name: tag_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tag_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tag_id_seq OWNER TO postgres;

--
-- TOC entry 3061 (class 0 OID 0)
-- Dependencies: 208
-- Name: tag_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tag_id_seq OWNED BY public.tag.id;


--
-- TOC entry 201 (class 1259 OID 16397)
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    username character varying NOT NULL,
    email character varying NOT NULL,
    bio character varying DEFAULT ''::character varying NOT NULL,
    image character varying DEFAULT ''::character varying NOT NULL,
    password character varying NOT NULL
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- TOC entry 210 (class 1259 OID 16454)
-- Name: user_favorites_article; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_favorites_article (
    "userId" integer NOT NULL,
    "articleId" integer NOT NULL
);


ALTER TABLE public.user_favorites_article OWNER TO postgres;

--
-- TOC entry 200 (class 1259 OID 16395)
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_id_seq OWNER TO postgres;

--
-- TOC entry 3062 (class 0 OID 0)
-- Dependencies: 200
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- TOC entry 2886 (class 2604 OID 16424)
-- Name: article id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.article ALTER COLUMN id SET DEFAULT nextval('public.article_id_seq'::regclass);


--
-- TOC entry 2885 (class 2604 OID 16413)
-- Name: comment id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment ALTER COLUMN id SET DEFAULT nextval('public.comment_id_seq'::regclass);


--
-- TOC entry 2892 (class 2604 OID 16440)
-- Name: follows id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.follows ALTER COLUMN id SET DEFAULT nextval('public.follows_id_seq'::regclass);


--
-- TOC entry 2893 (class 2604 OID 16448)
-- Name: tag id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tag ALTER COLUMN id SET DEFAULT nextval('public.tag_id_seq'::regclass);


--
-- TOC entry 2882 (class 2604 OID 16400)
-- Name: user id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- TOC entry 3047 (class 0 OID 16421)
-- Dependencies: 205
-- Data for Name: article; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.article (id, slug, title, description, body, created, updated, "tagList", "favoriteCount", "authorId") FROM stdin;
8	Paul	title	Real world test	body	2021-06-25 16:45:26.873151	2021-06-25 16:45:26.873151	tags	1	\N
9	Allen	title	Real world test	body	2021-06-25 16:45:26.873151	2021-06-25 16:45:26.873151	tags	1	\N
10	Teddy	title	Real world test	body	2021-06-25 16:45:26.873151	2021-06-25 16:45:26.873151	tags	1	\N
11	Mark	title	Real world test	body	2021-06-25 16:45:26.873151	2021-06-25 16:45:26.873151	tags	1	\N
12	David	title	Real world test	body	2021-06-25 16:45:26.873151	2021-06-25 16:45:26.873151	tags	1	\N
13	Kim	title	Real world test	body	2021-06-25 16:45:26.873151	2021-06-25 16:45:26.873151	tags	1	\N
14	James	title	Real world test	body	2021-06-25 16:45:26.873151	2021-06-25 16:45:26.873151	tags	1	\N
15	Paul	title	Real world test	body	2021-06-25 17:45:13.854614	2021-06-25 17:45:13.854614	tags	1	\N
16	Allen	title	Real world test	body	2021-06-25 17:45:13.854614	2021-06-25 17:45:13.854614	tags	1	\N
17	Teddy	title	Real world test	body	2021-06-25 17:45:13.854614	2021-06-25 17:45:13.854614	tags	1	\N
18	Mark	title	Real world test	body	2021-06-25 17:45:13.854614	2021-06-25 17:45:13.854614	tags	1	\N
19	David	title	Real world test	body	2021-06-25 17:45:13.854614	2021-06-25 17:45:13.854614	tags	1	\N
20	Kim	title	Real world test	body	2021-06-25 17:45:13.854614	2021-06-25 17:45:13.854614	tags	1	\N
21	James	title	Real world test	body	2021-06-25 17:45:13.854614	2021-06-25 17:45:13.854614	tags	1	\N
\.


--
-- TOC entry 3045 (class 0 OID 16410)
-- Dependencies: 203
-- Data for Name: comment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comment (id, body, "articleId") FROM stdin;
3	Hello World	\N
4	Hello World	\N
5	Hello World	\N
6	Hello World	\N
7	Hello World	\N
8	Hello World	\N
9	Hello World	\N
\.


--
-- TOC entry 3049 (class 0 OID 16437)
-- Dependencies: 207
-- Data for Name: follows; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.follows (id, "followerId", "followingId") FROM stdin;
1	1	2
2	2	1
3	2	3
4	1	3
5	1	4
6	3	1
7	3	6
\.


--
-- TOC entry 3051 (class 0 OID 16445)
-- Dependencies: 209
-- Data for Name: tag; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tag (id, tag) FROM stdin;
1	reactjs
2	reactjs
3	reactjs
4	reactjs
5	reactjs
6	reactjs
7	reactjs
\.


--
-- TOC entry 3043 (class 0 OID 16397)
-- Dependencies: 201
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (id, username, email, bio, image, password) FROM stdin;
1	Paul	hassan@gmail.com	testing		12345
2	Allen	hassan@gmail.com	testing		12345
3	Teddy	hassan@gmail.com	testing		12345
4	Mark	hassan@gmail.com	testing		12345
5	David	hassan@gmail.com	testing		12345
6	Kim	hassan@gmail.com	testing		12345
7	James	hassan@gmail.com	testing		12345
\.


--
-- TOC entry 3052 (class 0 OID 16454)
-- Dependencies: 210
-- Data for Name: user_favorites_article; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_favorites_article ("userId", "articleId") FROM stdin;
1	8
1	9
2	8
3	13
3	14
2	16
1	10
\.


--
-- TOC entry 3063 (class 0 OID 0)
-- Dependencies: 204
-- Name: article_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.article_id_seq', 21, true);


--
-- TOC entry 3064 (class 0 OID 0)
-- Dependencies: 202
-- Name: comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.comment_id_seq', 9, true);


--
-- TOC entry 3065 (class 0 OID 0)
-- Dependencies: 206
-- Name: follows_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.follows_id_seq', 7, true);


--
-- TOC entry 3066 (class 0 OID 0)
-- Dependencies: 208
-- Name: tag_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tag_id_seq', 7, true);


--
-- TOC entry 3067 (class 0 OID 0)
-- Dependencies: 200
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_id_seq', 7, true);


--
-- TOC entry 2897 (class 2606 OID 16418)
-- Name: comment PK_0b0e4bbc8415ec426f87f3a88e2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY (id);


--
-- TOC entry 2899 (class 2606 OID 16434)
-- Name: article PK_40808690eb7b915046558c0f81b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.article
    ADD CONSTRAINT "PK_40808690eb7b915046558c0f81b" PRIMARY KEY (id);


--
-- TOC entry 2901 (class 2606 OID 16442)
-- Name: follows PK_8988f607744e16ff79da3b8a627; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.follows
    ADD CONSTRAINT "PK_8988f607744e16ff79da3b8a627" PRIMARY KEY (id);


--
-- TOC entry 2903 (class 2606 OID 16453)
-- Name: tag PK_8e4052373c579afc1471f526760; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tag
    ADD CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY (id);


--
-- TOC entry 2895 (class 2606 OID 16407)
-- Name: user PK_cace4a159ff9f2512dd42373760; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id);


--
-- TOC entry 2907 (class 2606 OID 16458)
-- Name: user_favorites_article PK_eb153a9f549f934488deb1c6025; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_favorites_article
    ADD CONSTRAINT "PK_eb153a9f549f934488deb1c6025" PRIMARY KEY ("userId", "articleId");


--
-- TOC entry 2904 (class 1259 OID 16459)
-- Name: IDX_3b80ae56288924ab30cc9e7043; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_3b80ae56288924ab30cc9e7043" ON public.user_favorites_article USING btree ("userId");


--
-- TOC entry 2905 (class 1259 OID 16460)
-- Name: IDX_9ea0140751b603ea826c19e1a3; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_9ea0140751b603ea826c19e1a3" ON public.user_favorites_article USING btree ("articleId");


--
-- TOC entry 2910 (class 2606 OID 16471)
-- Name: user_favorites_article FK_3b80ae56288924ab30cc9e70435; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_favorites_article
    ADD CONSTRAINT "FK_3b80ae56288924ab30cc9e70435" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- TOC entry 2911 (class 2606 OID 16476)
-- Name: user_favorites_article FK_9ea0140751b603ea826c19e1a33; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_favorites_article
    ADD CONSTRAINT "FK_9ea0140751b603ea826c19e1a33" FOREIGN KEY ("articleId") REFERENCES public.article(id) ON DELETE CASCADE;


--
-- TOC entry 2909 (class 2606 OID 16466)
-- Name: article FK_a9c5f4ec6cceb1604b4a3c84c87; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.article
    ADD CONSTRAINT "FK_a9c5f4ec6cceb1604b4a3c84c87" FOREIGN KEY ("authorId") REFERENCES public."user"(id);


--
-- TOC entry 2908 (class 2606 OID 16461)
-- Name: comment FK_c20404221e5c125a581a0d90c0e; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT "FK_c20404221e5c125a581a0d90c0e" FOREIGN KEY ("articleId") REFERENCES public.article(id);



--
-- PostgreSQL database dump complete
--

