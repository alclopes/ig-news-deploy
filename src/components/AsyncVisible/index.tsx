// Componente criado para entendermos como fazer testes em componentes assincronos #testAssyncComponents#

// Tela que é carregada inicialmente so com o h1
// e depois de um segundo surge um botão.
import { useEffect, useState } from 'react';

export function AsyncVisible() {
	const [isButtonVisible, setIsButtonVisible] = useState(false);

	// useEffect para simular assincronicidade.
	useEffect(() => {
		setTimeout(() => {
			setIsButtonVisible(true);
		}, 1000);
		//eslint-disable-next-line
	}, []);

	return (
		<div>
			<div>Hello World</div>
			<h1>This is an Async component</h1>
			{isButtonVisible && <button>Button</button>}
		</div>
	);
}
