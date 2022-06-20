// tags: #screenTestingLibrary# #testHeader# #logTestingPlaygroundURL#
import { render, screen } from '@testing-library/react';
import { Header } from '.';

jest.mock('next/router', () => {
	return {
		useRouter() {
			return {
				asPath: '/',
			};
		},
	};
});
jest.mock('next-auth/client', () => {
	return {
		useSession() {
			return [null, false];
		},
	};
});

describe('Header component', () => {
	it('renders correctly', () => {
		render(<Header />);

		// cria uma pagina com todo o html gerado e dá uma ferramenta de seleção de elemento HTML e mostra as opções de querys para poder trabalhar com ele.
		//screen.logTestingPlaygroundURL()

		expect(screen.getByText('Home')).toBeInTheDocument();
		expect(screen.getByText('Posts')).toBeInTheDocument();
	});
});
