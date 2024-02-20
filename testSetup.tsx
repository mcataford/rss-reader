import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { NavigationProvider } from "@/hooks/useNavigation";

export function TestComponentWrappers({ children }) {
	return (
		<NavigationProvider>
			<QueryClientProvider client={new QueryClient()}>
				{children}
			</QueryClientProvider>
		</NavigationProvider>
	);
}
