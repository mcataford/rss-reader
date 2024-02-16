interface LocalStorageHookReturnType {
	getValue: <T>(k: string) => T;
	setValue: <T>(k: string, v: T) => void;
}

/*
 * Encapsulates Local Storage interactions.
 */
export default function useLocalStorage(
	{ isJSON }: { isJSON: boolean } = { isJSON: false },
): LocalStorageHookReturnType {
	if (!window.localStorage) throw new Error("Local Storage is not available");

	return {
		getValue: <T>(key: string): T => {
			const raw = window.localStorage.getItem(key);
			return (isJSON ? JSON.parse(raw) : raw) as T;
		},
		setValue: <T>(key: string, value: T) => {
			window.localStorage.setItem(
				key,
				(isJSON ? JSON.stringify(value) : value) as string,
			);
		},
	};
}
