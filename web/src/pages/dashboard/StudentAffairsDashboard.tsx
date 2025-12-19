import api from "@/api/api";
import { Button } from "@/components/ui/button";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import RootLayout from "@/layouts/RootLayout";

export default function StudentAffairsDashboard() {
	useHeaderInitializer("MIIT| Student Affairs Dashboard", "Dashboard");

	const testAuthRole = async () => {
		const res = await api.get("role-info");
		console.log(res);
	};

	return (
		<RootLayout>
			<div className="px-6">
				StudentAffairsDashboard
				<br />
				<Button onClick={testAuthRole}>Test Auth Role</Button>
			</div>
		</RootLayout>
	);
}
