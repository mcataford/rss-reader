import FeedsPanel from "@/components/FeedsPanel";
import NavigationBar from "@/components/NavigationBar";
import SettingsPanel from "@/components/SettingsPanel";
import useNavigation, { routes } from "@/hooks/useNavigation";

export default function App() {
	const { location } = useNavigation();

	return (
		<>
			<NavigationBar />
			{location === routes.FEEDS ? <FeedsPanel /> : null}
			{location === routes.SETTINGS ? <SettingsPanel /> : null}
		</>
	);
}
