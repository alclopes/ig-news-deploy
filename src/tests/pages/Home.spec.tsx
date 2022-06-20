// https://app.rocketseat.com.br/node/testes-unitarios-no-react/group/testando-paginas/lesson/testando-pagina-home

import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';

import { stripe } from '../../services/stripe';
import Home, { getStaticProps } from '../../pages';

jest.mock('next/router');
// mock para usuario deslogado
jest.mock('next-auth/client', () => {
	return {
		useSession: () => [null, false],
	};
});
jest.mock('../../services/stripe');

describe('Home page', () => {
	it('renders correctly', () => {
		render(<Home product={{ priceId: 'fake-price-id', amount: 'R$ 10,00' }} />);

		// na tela esta <span>for { product.amount } month</span>
		// logo não vai encontrar no span só 'R$ 10,00' então usamos regex
		expect(screen.getByText(/R\$ 10,00/i)).toBeInTheDocument();
	});

	it('loads initial data', async () => {
		const retriveStripepricesMocked = mocked(stripe.prices.retrieve);

		// note que  não usou: mockReturnValueOnce
		// Como o retriveStripedMocked é um promise usamos "mockResolvedValueOnce"
		retriveStripepricesMocked.mockResolvedValueOnce({
			id: 'fake-price-id',
			unit_amount: 1000, //=> 10,00 pois o stripe grava os valores X100
		} as any); // usamos "as any" pois não usamos todos os valores do produto e assim não reclama da tipagem

		// enviando um objeto vazio
		const response = await getStaticProps({});
		//console.log(response); // vemos que ele retornou uma promise, então usamos await e async, mas da para ver no texto do getStaticProps

		expect(response).toEqual(
			expect.objectContaining({
				props: {
					product: {
						priceId: 'fake-price-id',
						amount: '$10.00',
					},
				},
			})
		);
	});
});
