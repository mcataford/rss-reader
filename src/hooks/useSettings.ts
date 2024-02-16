import { Settings } from "../types";

import useLocalStorage from "./useLocalStorage";

const defaultSettings = {
	feedUrls: [],
};

export default function useSettings(): {
	getSettings: () => Settings;
	setSettings: <T>(k: string, value: T) => void;
} {
	const { getValue, setValue } = useLocalStorage({ isJSON: true });

	const getSettings = (): Settings =>
		getValue<Settings>("settings") ?? defaultSettings;

	const setSettings = <T>(key: string, value: T) => {
		const current = getSettings();

		setValue<Settings>("settings", { ...current, [key]: value });
	};

	return { getSettings, setSettings };
}
