import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import RootLayout from "@/layouts/RootLayout";
import { HasRole } from "@/lib/utils";
import UnAuthorized from "../UnAuthorized";

export default function SupervisorsPage() {
	useHeaderInitializer("MIIT| Supervisors", "Project Supervisors");

	if (HasRole("Student")) return <UnAuthorized />;

	return (
		<RootLayout>
			<h1 className="px-6">Supervisors Page</h1>
		</RootLayout>
	);
}
