COPY public."user" (id, username, email, bio, image, password) FROM stdin;
3	tuser	t@example.com			$argon2i$v=19$m=4096,t=3,p=1$hkW9lWIvluDwbjqDDbktiw$/tI+NXp4i+fI4vcDy6rbhvl3GsD4XDjFQfrLHvqfLaU
\.

COPY public.article (slug, title, description, body, created, updated, "tagList", "favoriteCount", "authorId") FROM stdin;
how-to-train-your-dragon-rxoz69	How to train your dragon	Ever wonder how?		2021-06-21 10:12:59.798815	2021-06-21 10:12:59.798815	dragons,training	0	3
how-to-train-your-dragon-2wtpgn	How to train your dragon	Ever wonder how?		2021-06-21 10:13:02.672336	2021-06-21 10:13:02.672336	dragons,training	0	3
how-to-train-your-dragon-6qshw6	How to train your dragon	Ever wonder how?		2021-06-21 10:13:06.389754	2021-06-21 10:13:06.389754	dragons,training	0	3
how-to-train-your-dragon-ge1ojt	How to train your dragon	Ever wonder how?		2021-06-21 10:13:37.589353	2021-06-21 10:13:37.589353	dragons,training	0	3
how-to-train-your-dragon-uyq5qe	How to train your dragon	Ever wonder how?		2021-06-21 10:13:41.40624	2021-06-21 10:13:41.40624	dragons,training	0	3
\.
