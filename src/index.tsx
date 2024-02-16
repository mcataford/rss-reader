import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";

import App from "./App";
import { NavigationProvider } from "./hooks/useNavigation";

const queryClient = new QueryClient();

const root = createRoot(document.getElementById("app"))

root.render(
	<NavigationProvider>
		<QueryClientProvider client={queryClient}>
			<App />
		</QueryClientProvider>
	</NavigationProvider>
);
