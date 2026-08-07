import api from "@/api/api";
import { PAGE_META } from "@/constants/navigation";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { useRoleChecker } from "@/hooks/use-role-checker";
import { useQuery } from "@tanstack/react-query";
import UnAuthorized from "../../../components/auth/un-authorized";
import SupervisorsTable from "../components/supervisors-table";

export default function SupervisorsPage() {
	useHeaderInitializer(PAGE_META.supervisors.title, PAGE_META.supervisors.subtitle);

	const fetchSupervisors = async () => {
		const res = await api.get("/supervisors");
		return res.data.data;
	};

	const { data: supervisors } = useQuery({
		queryKey: ["supervisors"],
		queryFn: fetchSupervisors,
	});

	const { isStudent } = useRoleChecker();

	if (isStudent) return <UnAuthorized />;

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
