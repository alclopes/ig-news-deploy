import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';
import { useSession } from 'next-auth/client';
import { SignInButton } from '.';

// mock sem informação se o cliente esta logado ou não
jest.mock('next-auth/client');

// Usando o moked dp ts-jest para agregar: status de login do usuario
const useSessionMocked = mocked(useSession);

describe('SignInButton component', () => {
	it('renders correctly when user is not authenticated', () => {
		// Aqui passamos o staus de login: deslogado somente para 1º renderização
		useSessionMocked.mockReturnValueOnce([null, false]);

		render(<SignInButton />);

		expect(screen.getByText('Sign in with Github')).toBeInTheDocument();
	});

	it('renders correctly when user is authenticated', () => {
		// Aqui passamos o staus de login: logado para as prx renderizações
		useSessionMocked.mockReturnValueOnce([
			{
				user: { name: 'John Doe', email: 'john.doe@example.com' },
				expires: 'fake-expires',
			},
			false,
		]);

		render(<SignInButton />);

		expect(screen.getByText('John Doe')).toBeInTheDocument();
	});
});
