import { useCallback, useContext, useState, createContext } from "react";

interface INavigationContext {
	location: string;
	navigate: (url: string) => void;
}

const NavigationContext = createContext(null);

export default function useNavigation(): INavigationContext {
	const context = useContext(NavigationContext);

	if (!context) throw Error("Invalid navigation context");

	return context;
}

export const routes = {
	FEEDS: "/feeds/",
	SETTINGS: "/settings/",
};

export function NavigationProvider({
	children,
}: {
	children;
}) {
	const [location, setLocation] = useState<string>(window.location.pathname);

	const navigate = useCallback((url: string) => {
		window.history.pushState({}, "", url);
		setLocation(url);
	}, []);

	const suffixedLocation = location.endsWith("/") ? location : `${location}/`;

	if (suffixedLocation !== location) {
		window.history.replaceState({}, "", suffixedLocation);
		setLocation(suffixedLocation);
	}

	if (!Object.values(routes).includes(suffixedLocation)) navigate(routes.FEEDS);

	return (
		<NavigationContext.Provider value={{ location, navigate }}>
			{children}
		</NavigationContext.Provider>
	);
}
