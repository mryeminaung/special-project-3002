import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import RootLayout from "@/layouts/RootLayout";
import { useRoleCheck } from "@/lib/utils";
import UnAuthorized from "../UnAuthorized";

export default function SupervisorsPage() {
	useHeaderInitializer("MIIT| Supervisors", "Project Supervisors");

	if (useRoleCheck("Student")) return <UnAuthorized />;

	return (
		<RootLayout>
			<h1 className="px-6">Supervisors Page</h1>
		</RootLayout>
	);
}
