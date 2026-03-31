import UnAuthorized from "@/components/un-authorized";
import { HasRole } from "@/lib/utils";
import EventsSetting from "./components/events-setting";

export default function Events() {
	if (HasRole("IC")) return <EventsSetting />;
	else return <UnAuthorized />;
}
