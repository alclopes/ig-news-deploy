// Componente criado para entendermos como fazer testes em componentes assincronos #testAssyncComponents#

// Tela que é carregada inicialmente com o h1 e o botão
// e depois de um segundo o botão some.
import { useEffect, useState } from 'react';

export function AsyncInvisible() {
	const [isButtonInvisible, setIsButtonInVisible] = useState(false);

	// useEffect para simular assincronicidade.
	useEffect(() => {
		setTimeout(() => {
			setIsButtonInVisible(true);
		}, 1000);
		//eslint-disable-next-line
	}, []);

	return (
		<div>
			<div>Hello World</div>
			<h1>This is an Async component</h1>
			{isButtonInvisible && <button>Button</button>}
		</div>
	);
}
