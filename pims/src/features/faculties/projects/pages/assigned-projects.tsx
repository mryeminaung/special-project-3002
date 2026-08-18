import { getAssignedProjects } from "@/features/projects/services/project.service";
import { getAcademicYears } from "@/features/admin/services/admin.service";
import { HEADINGS } from "@/constants/navigation";
import Heading from "@/components/heading";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import AssignedProjectsTable from "../components/assigned-projects-table";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export default function AssignedProjects() {
	const [yearId, setYearId] = useState<number | undefined>(undefined);

	const { data: years } = useQuery({
		queryKey: ["academicYears"],
		queryFn: getAcademicYears,
		staleTime: 60_000,
	});

	const { data: assignedProjects, isFetching } = useQuery({
		queryKey: ["assignedProjects", yearId],
		queryFn: () => getAssignedProjects(yearId),
	});

	return (
		<div className="space-y-6">
			<Heading
				title={HEADINGS.assignedProjects.title}
				description={HEADINGS.assignedProjects.description}
			/>

			<div className="flex items-center gap-3">
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

			<AssignedProjectsTable projects={assignedProjects ?? []} isLoading={isFetching} />
		</div>
	);
}
