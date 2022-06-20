// #testAssyncComponents# #logTestingPlaygroundURL#

import {
	render,
	screen,
	waitFor,
	waitForElementToBeRemoved,
} from '@testing-library/react';
import { AsyncInvisible } from '.';

test('AsyncInvisible - it renders correctly', async () => {
	render(<AsyncInvisible />);

	// getByText => ok funciona
	expect(screen.getByText('Hello World')).toBeInTheDocument();

	// // getByText => ok funciona 	pois o botão, irá desaparecer apenas apos 1 segundo da renderização
	// expect(screen.getByText('Button')).toBeInTheDocument();

	// findByText => dá erro (para componentes texto em tela) (espera o retorno da chamada) (tem parametro timeout)
	//expect(await screen.findByText('Button')).toBeInTheDocument();

	// waitFor + not => ok (para qualquer elemento) (espera o retorno da chamada) (test vai demorar mais para finalizar tem parametro timeout)
	await waitFor(() => {
		return expect(screen.queryByText('Button')).not.toBeInTheDocument();
	});
});

// get => testa no ato
// find => se aparecer em algum momento -OK
// query => se não encontrar não dá erro

// 		{ timeout: 1000 }
