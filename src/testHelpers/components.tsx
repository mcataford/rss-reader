import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NavigationProvider } from "@/hooks/useNavigation";

export function TestComponentWrapper({ children }) {
	return (
		<NavigationProvider>
			<QueryClientProvider client={new QueryClient()}>
				{children}
			</QueryClientProvider>
		</NavigationProvider>
	);
}
