import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { HasRole } from "@/lib/utils";
import UnAuthorized from "../UnAuthorized";

export default function SupervisorDashboard() {
	useHeaderInitializer("MIIT | Supervisor Dashboard", "Dashboard");

	if (HasRole("Student")) return <UnAuthorized />;

	return <>SupervisorDashboard</>;
}
