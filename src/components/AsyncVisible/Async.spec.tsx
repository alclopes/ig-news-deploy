// // #testAssyncComponents# #logTestingPlaygroundURL#

import { render, screen, waitFor } from '@testing-library/react';
import { AsyncVisible } from '.';

it('AsyncVisible - it renders correctly', async () => {
	render(<AsyncVisible />);

	// cria uma pagina com todo o html gerado e dá uma ferramenta de seleção de elemento HTML e mostra as opções de querys para poder trabalhar com ele.
	//screen.logTestingPlaygroundURL()

	// getByText => ok funciona
	expect(screen.getByText('Hello World')).toBeInTheDocument();

	//getByText => dá erro pois o botão só surge apos 1 segundo da renderização
	//expect(screen.getByText('Button')).toBeInTheDocument();

	// findByText => ok funciona (para componentes texto em tela) (espera o retorno da chamada) (tem parametro timeout)
	expect(await screen.findByText('Button')).toBeInTheDocument();

	// waitFor => ok funciona para (para qualquer elemento) (espera o retorno da chamada) (test vai demorar mais para finalizar tem parametro timeout)
	await waitFor(
		() => {
			return expect(screen.getByText('Button')).toBeInTheDocument();
		},
		{ timeout: 1000 }
	);
});

// get => testa no ato
// find => se aparecer em algum momento -OK
// query => se não encontrar não dá erro

// 		{ timeout: 1000 }
