import UnAuthorized from "@/components/auth/un-authorized";
import { useRoleChecker } from "@/hooks/use-role-checker";
import EventsSetting from "../components/events-setting";

export default function Events() {
	const { isIC } = useRoleChecker();

	if (isIC) return <EventsSetting />;
	else return <UnAuthorized />;
}
