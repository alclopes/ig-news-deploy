/* Aqui mostramos parcialmente a pagina do post com a opção de se inscrever // para ter acesso ao conteudo integral */

import { GetStaticPaths, GetStaticProps } from 'next';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { RichText } from 'prismic-dom';
import { useEffect } from 'react';
import { getPrismicClient } from '../../../services/prismic';
import styles from '../post.module.scss';

interface PostPreviewProps {
	post: {
		slug: string;
		title: string;
		content: string;
		updatedAt: string;
	};
}

export default function PostPreview({ post }: PostPreviewProps) {
	const [session] = useSession();
	const router = useRouter();

	//se estiver logado redirecionamos para post completo.
	// #validandoSessao# #isSignInBrowser# 
	useEffect(() => {
		if (session?.activeSubscription) {
			router.push(`/posts/${post.slug}`);
		}
	}, [session]);

	return (
		<>
			<Head>
				<title>{post.title} | Ignews</title>
			</Head>

			<main className={styles.container}>
				<article className={styles.post}>
					<h1>{post.title}</h1>
					<time>{post.updatedAt}</time>
					<div
						className={`${styles.postContent} ${styles.previewContent}`}
						dangerouslySetInnerHTML={{ __html: post.content }}
					/>

					<div className={styles.continueReading}>
						Wanna continue reading?
						<Link href='/'>
							<a>Subscribe now 🤗</a>
						</Link>
					</div>
				</article>
			</main>
		</>
	);
}

// o paths vazio indica que todas as páginas da aplicação serão geradas no momento do build. #getStaticPaths#
export const getStaticPaths: GetStaticPaths = async () => {
	return {
		paths: [],
		fallback: 'blocking',
	};
};
// Este é um post statico (publica) pois o preview
// não precisa que o user tenha inscrição ativa
// Notar que o contexto do getStaticprops não tem informações da sessão
export const getStaticProps: GetStaticProps = async ({ params }) => {
	const { slug } = params;

	const prismic = getPrismicClient();

	const response = await prismic.getByUID('publication', String(slug), {});

	// Aqui pegamos via splice os 3 primeiros paragrafos do conteudo do post.
	const post = {
		slug,
		title: RichText.asText(response.data.title),
		content: RichText.asHtml(response.data.content.splice(0, 3)),
		updatedAt: new Date(response.last_publication_date).toLocaleDateString(
			'pt-BR',
			{
				day: '2-digit',
				month: 'long',
				year: 'numeric',
			}
		),
	};

	return {
		props: {
			post,
		},
		revalidate: 60 * 30, // #revalidacao# do post a cada 30 minutes
	};
};
