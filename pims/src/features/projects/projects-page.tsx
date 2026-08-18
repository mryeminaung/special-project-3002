import { getProjects } from "./services/project.service";
import { PAGE_META, HEADINGS } from "@/constants/navigation";
import Heading from "@/components/heading";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { useRoleChecker } from "@/hooks/use-role-checker";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import UnAuthorized from "../../components/auth/un-authorized";
import ProjectsTable from "./components/projects-table";
import { getAcademicYears } from "@/features/admin/services/admin.service";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export default function ProjectsPage() {
	useHeaderInitializer(PAGE_META.projects.title, PAGE_META.projects.subtitle);
	const { isIC } = useRoleChecker();
	const [yearId, setYearId] = useState<number | undefined>(undefined);

	const { data: years } = useQuery({
		queryKey: ["academicYears"],
		queryFn: getAcademicYears,
		staleTime: 60_000,
	});

	const { data: projects, isFetching } = useQuery({
		queryKey: ["projects", yearId],
		queryFn: () => getProjects(yearId),
	});

	if (!isIC) return <UnAuthorized />;

	return (
		<>
			<Heading
				title={HEADINGS.projects.title}
				description="Browse and manage project proposals with team assignments and supervisors."
			/>
			<div className="flex items-center gap-3 mt-4 mb-4">
				<Select
					value={yearId ? String(yearId) : "all"}
					onValueChange={(v) => setYearId(v === "all" ? undefined : Number(v))}>
					<SelectTrigger className="w-48 h-8 text-xs">
						<SelectValue placeholder="All academic years" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All academic years</SelectItem>
						{years?.map((y) => (
							<SelectItem key={y.id} value={String(y.id)}>
								{y.label ?? y.year}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<ProjectsTable projects={projects ?? []} isLoading={isFetching} />
		</>
	);
}
