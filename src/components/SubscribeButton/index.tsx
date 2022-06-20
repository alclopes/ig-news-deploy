// tags: #CheckoutSession# #Subscribe#
// https://stripe.com/docs/api/checkout/sessions

import { signIn, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';
import styles from './styles.module.scss';

export function SubscribeButton() {
	const [session] = useSession();
	const router = useRouter();

	async function handleSubscribe() {
		// se o usuário não estiver logado vai para o signIn do Github
		if (!session) {
			signIn('github');
			return;
		}

		// se o usuário não esta logado mas não tem uma subscribe ativa vai ser direcionado para uma página de posts
		if (session.activeSubscription) {
			router.push('/posts');
			return;
		}

		// chamando o API route para
		try {
			const response = await api.post('/subscribe');

			const { sessionId } = response.data;

			const stripe = await getStripeJs();

			await stripe.redirectToCheckout({
				sessionId,
			});
		} catch (err) {
			alert(err.message);
		}
	}

	return (
		<button
			type='button'
			className={styles.subscribeButton}
			onClick={handleSubscribe}
		>
			Subscribe now
		</button>
	);
}
