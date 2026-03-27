import api from "@/api/api";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { HasRole } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import UnAuthorized from "../../components/un-authorized";
import SupervisorsTable from "./components/supervisors-table";

export default function SupervisorsPage() {
	useHeaderInitializer("MIIT| Supervisors", "Assigned Supervisors");

	const fetchSupervisors = async () => {
		const res = await api.get("/supervisors");
		return res.data;
	};

	const { data: supervisors } = useQuery({
		queryKey: ["supervisors"],
		queryFn: fetchSupervisors,
	});

	if (HasRole("Student")) return <UnAuthorized />;

	return (
		<div className="mx-auto max-w-7xl">
			<h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
				Supervisors
			</h1>
			<p className="text-sm text-neutral-500">
				Browse and manage project supervisors with their assignments and
				departments.
			</p>
			{supervisors && <SupervisorsTable supervisors={supervisors} />}
		</div>
	);
}
