import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
	const mq = window.matchMedia(QUERY);
	mq.addEventListener("change", onChange);

	return () => mq.removeEventListener("change", onChange);
}

function getSnapshot() {
	return window.matchMedia(QUERY).matches;
}

function getServerSnapshot() {
	return false;
}

/**
 * Preferência de movimento reduzido sem quebrar a hidratação. O
 * `useReducedMotion` do motion lê o `matchMedia` já no primeiro render do
 * cliente; com a preferência ligada, o cliente desenhava outra árvore que a do
 * servidor. Aqui a hidratação usa o valor do servidor e só depois o do navegador.
 */
export function usePrefersReducedMotion(): boolean {
	return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
