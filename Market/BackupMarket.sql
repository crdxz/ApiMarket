--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2025-08-03 20:44:13

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
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
-- TOC entry 220 (class 1259 OID 16403)
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying(255),
    description text
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16402)
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO postgres;

--
-- TOC entry 4974 (class 0 OID 0)
-- Dependencies: 219
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- TOC entry 228 (class 1259 OID 16468)
-- Name: messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.messages (
    id integer NOT NULL,
    purchase_request_id integer,
    sender_id integer,
    receiver_id integer,
    message text,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.messages OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16467)
-- Name: messages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.messages_id_seq OWNER TO postgres;

--
-- TOC entry 4975 (class 0 OID 0)
-- Dependencies: 227
-- Name: messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.messages_id_seq OWNED BY public.messages.id;


--
-- TOC entry 224 (class 1259 OID 16433)
-- Name: product_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_images (
    id integer NOT NULL,
    product_id integer,
    image_url character varying(1024)
);


ALTER TABLE public.product_images OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16432)
-- Name: product_images_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_images_id_seq OWNER TO postgres;

--
-- TOC entry 4976 (class 0 OID 0)
-- Dependencies: 223
-- Name: product_images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_images_id_seq OWNED BY public.product_images.id;


--
-- TOC entry 222 (class 1259 OID 16412)
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id integer NOT NULL,
    seller_id integer,
    title character varying(255),
    description text,
    price numeric(10,2),
    stock integer,
    category_id integer,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.products OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16411)
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO postgres;

--
-- TOC entry 4977 (class 0 OID 0)
-- Dependencies: 221
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- TOC entry 226 (class 1259 OID 16447)
-- Name: purchase_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.purchase_requests (
    id integer NOT NULL,
    product_id integer,
    buyer_id integer,
    quantity integer,
    note text,
    status character varying(50),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.purchase_requests OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16446)
-- Name: purchase_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.purchase_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.purchase_requests_id_seq OWNER TO postgres;

--
-- TOC entry 4978 (class 0 OID 0)
-- Dependencies: 225
-- Name: purchase_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.purchase_requests_id_seq OWNED BY public.purchase_requests.id;


--
-- TOC entry 230 (class 1259 OID 16493)
-- Name: transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transactions (
    id integer NOT NULL,
    purchase_request_id integer,
    status character varying(50),
    confirmation_date timestamp without time zone
);


ALTER TABLE public.transactions OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16492)
-- Name: transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transactions_id_seq OWNER TO postgres;

--
-- TOC entry 4979 (class 0 OID 0)
-- Dependencies: 229
-- Name: transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.transactions_id_seq OWNED BY public.transactions.id;


--
-- TOC entry 218 (class 1259 OID 16391)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(255),
    email character varying(255),
    password_hash character varying(255),
    phone character varying(50),
    address text,
    user_type character varying(50),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16390)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 4980 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4774 (class 2604 OID 16406)
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- TOC entry 4782 (class 2604 OID 16471)
-- Name: messages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages ALTER COLUMN id SET DEFAULT nextval('public.messages_id_seq'::regclass);


--
-- TOC entry 4778 (class 2604 OID 16436)
-- Name: product_images id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images ALTER COLUMN id SET DEFAULT nextval('public.product_images_id_seq'::regclass);


--
-- TOC entry 4775 (class 2604 OID 16415)
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- TOC entry 4779 (class 2604 OID 16450)
-- Name: purchase_requests id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_requests ALTER COLUMN id SET DEFAULT nextval('public.purchase_requests_id_seq'::regclass);


--
-- TOC entry 4784 (class 2604 OID 16496)
-- Name: transactions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions ALTER COLUMN id SET DEFAULT nextval('public.transactions_id_seq'::regclass);


--
-- TOC entry 4772 (class 2604 OID 16394)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4958 (class 0 OID 16403)
-- Dependencies: 220
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, name, description) FROM stdin;
1	Electrónicos	Productos electrónicos y tecnología
2	Hogar	Artículos para el hogar y cocina
3	Deportes	Equipamiento y ropa deportiva
4	Libros	Libros y material educativo
5	Moda	Ropa, calzado y accesorios
\.


--
-- TOC entry 4966 (class 0 OID 16468)
-- Dependencies: 228
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.messages (id, purchase_request_id, sender_id, receiver_id, message, "timestamp") FROM stdin;
\.


--
-- TOC entry 4962 (class 0 OID 16433)
-- Dependencies: 224
-- Data for Name: product_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_images (id, product_id, image_url) FROM stdin;
4	16	/static/product_images/1a5d32de-aeb8-4d0e-9f7f-5149edf6f4a0.jpg
5	20	/static/product_images/1f543b09-87f5-48f9-9450-1b8eb345863d.webp
6	24	/static/product_images/5d7316eb-bab7-46a2-97a8-c6eb7331c927.jpeg
7	28	/static/product_images/38c7aef1-495b-463d-9be1-a20e5acd69ca.webp
8	32	/static/product_images/87c0b631-551d-4441-9519-76c77d576432.webp
9	13	/static/product_images/cc9b9036-de02-44db-8348-524a638de14a.webp
10	17	/static/product_images/a7d8765b-dd24-453e-a1ca-a816830105c2.png
11	21	/static/product_images/1aecefde-1bf8-478c-b6ef-2485893b3f01.webp
12	25	/static/product_images/845f4806-18af-4024-b1ce-18288c093136.jpg
13	29	/static/product_images/7efab560-0e03-4238-822b-9dd2990e032f.jpeg
14	14	/static/product_images/8b5d49e1-b017-4692-a4c4-c64a07e18ba0.jpeg
15	18	/static/product_images/2443f3ce-abf0-4360-85c1-6c1e28e8de17.webp
16	22	/static/product_images/bedf8aba-4e14-4b41-8379-de5be64d0e54.webp
17	26	/static/product_images/10b35acf-90e9-4bf5-b839-d4dff86cac32.jpeg
18	30	/static/product_images/da726703-dede-48d2-bfb4-5f64c08187b8.jpeg
19	15	/static/product_images/c1eb8a8d-9d01-41b1-9157-b176473a6741.jpeg
20	19	/static/product_images/ab91d4c1-ebb6-4375-a5af-17a4ff1fa8a7.webp
21	23	/static/product_images/19bfe620-6adf-4c1c-87e1-1e0197103b85.webp
22	27	/static/product_images/a5c1f955-711e-4612-82ea-d871e12acaef.webp
23	31	/static/product_images/9ed10f45-5c3d-4c7c-8211-9412b69d9091.jpg
\.


--
-- TOC entry 4960 (class 0 OID 16412)
-- Dependencies: 222
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, seller_id, title, description, price, stock, category_id, is_active, created_at) FROM stdin;
16	6	Smartwatch Samsung Galaxy Watch 6	Reloj inteligente con monitor de salud	299.99	7	1	t	2025-08-04 01:14:33.879053
20	6	Lámpara LED de Escritorio	Lámpara regulable con puerto USB	34.99	12	2	t	2025-08-04 01:15:08.744946
24	6	Set de Pesas Ajustables	Pesas de 2 a 10 kg	89.99	6	3	t	2025-08-04 01:15:34.788638
28	6	1984	George Orwell	12.99	22	4	t	2025-08-04 01:15:55.729265
32	6	Bolso de Mano Elegante	Bolso de cuero sintético	39.99	8	5	t	2025-08-04 01:16:21.686932
13	3	iPhone 15 Pro	Último modelo de iPhone	1299.99	5	1	t	2025-08-04 01:13:26.263859
17	3	Aspiradora Robot Xiaomi	Limpieza automática para tu hogar	199.99	8	2	t	2025-08-04 01:14:47.387925
21	3	Bicicleta de Montaña	Bicicleta con suspensión delantera	499.99	4	3	t	2025-08-04 01:15:14.394922
25	3	Cien Años de Soledad	Gabriel García Márquez	14.99	30	4	t	2025-08-04 01:15:40.893876
29	3	Camisa Casual Hombre	Camisa de algodón, varias tallas	24.99	14	5	t	2025-08-04 01:16:04.096134
14	4	Laptop Dell XPS 13	Ultrabook potente y ligera	999.99	3	1	t	2025-08-04 01:14:19.839402
18	4	Set de Sartenes Antiadherentes	Juego de 3 sartenes de alta calidad	59.99	15	2	t	2025-08-04 01:14:57.979059
22	4	Balón de Fútbol Adidas	Balón oficial tamaño 5	29.99	25	3	t	2025-08-04 01:15:20.033774
26	4	El Principito	Antoine de Saint-Exupéry	9.99	40	4	t	2025-08-04 01:15:45.703233
30	4	Vestido de Verano Mujer	Vestido fresco y cómodo	29.99	10	5	t	2025-08-04 01:16:08.4824
15	5	Auriculares Sony WH-1000XM4	Cancelación de ruido premium	349.99	10	1	t	2025-08-04 01:14:26.536942
19	5	Cafetera Italiana	Cafetera de aluminio para 6 tazas	24.99	20	2	t	2025-08-04 01:15:02.728292
23	5	Guantes de Boxeo Everlast	Guantes profesionales para entrenamiento	49.99	10	3	t	2025-08-04 01:15:28.158057
27	5	Sapiens: De animales a dioses	Yuval Noah Harari	19.99	18	4	t	2025-08-04 01:15:51.219273
31	5	Zapatillas Deportivas	Zapatillas ligeras para correr	49.99	20	5	t	2025-08-04 01:16:15.604294
\.


--
-- TOC entry 4964 (class 0 OID 16447)
-- Dependencies: 226
-- Data for Name: purchase_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.purchase_requests (id, product_id, buyer_id, quantity, note, status, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4968 (class 0 OID 16493)
-- Dependencies: 230
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transactions (id, purchase_request_id, status, confirmation_date) FROM stdin;
\.


--
-- TOC entry 4956 (class 0 OID 16391)
-- Dependencies: 218
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password_hash, phone, address, user_type, created_at) FROM stdin;
1	Juan Pérez	juan@example.com	scrypt:32768:8:1$I2o0cdlcuiaRw016$b8855e0448e6605d2d2b02d9edda5cea907c4c4d29d3c7deed5d092a463fb5dcb0fb835889ac74280e7410ed1269290841b14d44b8c7b69fe6cbff4c20128923	555-111-2222	Av. Siempre Viva 123	buyer	2025-08-04 01:05:39.053509
2	Ana Torres	ana.torres@example.com	scrypt:32768:8:1$ODjLd8R9VneAHdMM$291ea469fd17d994fdfcaa7574baa5fa4b31353aec9de85c17148b7db63e93de84c160428f23854f0a4a92ee85a0331d8f9e034844784c21f169b853cec20f7e	555-333-4444	Calle Luna 456	buyer	2025-08-04 01:06:02.154907
3	María García	maria.garcia@example.com	scrypt:32768:8:1$87n7x6I53DQYn6nL$0aea073315e516dbfdf8ff66a52df66b8656667c6a5224262b5a17a68693615b7083957317f89ac21497b4d137fcf9d09fca690fdc87783d03b5fc6dba681157	555-555-6666	Calle Comercio 789	seller	2025-08-04 01:06:16.740656
4	Carlos Ruiz	carlos.ruiz@example.com	scrypt:32768:8:1$Khd9yGTgfwAwfVAU$f39f4e564953df589cfe2028554c3114b19514e615fd419169240e0989fad6edea3628d2edf19c5b50f40b3223c5cb4ca0180f846b55fa4927bbc43d44730fac	555-777-8888	Av. Central 321	seller	2025-08-04 01:06:29.144608
5	Laura Méndez	laura.mendez@example.com	scrypt:32768:8:1$v2RIGZZB7p6rRc4O$e25ad071bc1635cae85ae4eb089031be06c7249b01a3aa2a76a63b12e8cc0a7e82730088e8c32dd03bee278e2ff8c36a8d74954824a0c92260337c1330695430	555-999-0000	Calle Sol 654	both	2025-08-04 01:06:47.844569
6	Pedro López	pedro.lopez@example.com	scrypt:32768:8:1$Emj3HRZtiGi69cDA$22b00aa7e6c18b5d76fb00eeb999740ec1225772b05745652203bb490e8db4adef5c5725ba90bcea956ab092b6a58691cfc7ee95fc76e4e86b7d3c5a61dd56dc	555-222-3333	Av. Libertad	both	2025-08-04 01:06:58.285029
\.


--
-- TOC entry 4981 (class 0 OID 0)
-- Dependencies: 219
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 10, true);


--
-- TOC entry 4982 (class 0 OID 0)
-- Dependencies: 227
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.messages_id_seq', 11, true);


--
-- TOC entry 4983 (class 0 OID 0)
-- Dependencies: 223
-- Name: product_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_images_id_seq', 23, true);


--
-- TOC entry 4984 (class 0 OID 0)
-- Dependencies: 221
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 32, true);


--
-- TOC entry 4985 (class 0 OID 0)
-- Dependencies: 225
-- Name: purchase_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.purchase_requests_id_seq', 11, true);


--
-- TOC entry 4986 (class 0 OID 0)
-- Dependencies: 229
-- Name: transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transactions_id_seq', 1, false);


--
-- TOC entry 4987 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 11, true);


--
-- TOC entry 4790 (class 2606 OID 16410)
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- TOC entry 4798 (class 2606 OID 16476)
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- TOC entry 4794 (class 2606 OID 16440)
-- Name: product_images product_images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_pkey PRIMARY KEY (id);


--
-- TOC entry 4792 (class 2606 OID 16421)
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- TOC entry 4796 (class 2606 OID 16456)
-- Name: purchase_requests purchase_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_requests
    ADD CONSTRAINT purchase_requests_pkey PRIMARY KEY (id);


--
-- TOC entry 4800 (class 2606 OID 16498)
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- TOC entry 4786 (class 2606 OID 16401)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4788 (class 2606 OID 16399)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4806 (class 2606 OID 16477)
-- Name: messages messages_purchase_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_purchase_request_id_fkey FOREIGN KEY (purchase_request_id) REFERENCES public.purchase_requests(id);


--
-- TOC entry 4807 (class 2606 OID 16487)
-- Name: messages messages_receiver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES public.users(id);


--
-- TOC entry 4808 (class 2606 OID 16482)
-- Name: messages messages_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(id);


--
-- TOC entry 4803 (class 2606 OID 16441)
-- Name: product_images product_images_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- TOC entry 4801 (class 2606 OID 16427)
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- TOC entry 4802 (class 2606 OID 16422)
-- Name: products products_seller_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.users(id);


--
-- TOC entry 4804 (class 2606 OID 16462)
-- Name: purchase_requests purchase_requests_buyer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_requests
    ADD CONSTRAINT purchase_requests_buyer_id_fkey FOREIGN KEY (buyer_id) REFERENCES public.users(id);


--
-- TOC entry 4805 (class 2606 OID 16457)
-- Name: purchase_requests purchase_requests_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_requests
    ADD CONSTRAINT purchase_requests_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- TOC entry 4809 (class 2606 OID 16499)
-- Name: transactions transactions_purchase_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_purchase_request_id_fkey FOREIGN KEY (purchase_request_id) REFERENCES public.purchase_requests(id);


-- Completed on 2025-08-03 20:44:13

--
-- PostgreSQL database dump complete
--

