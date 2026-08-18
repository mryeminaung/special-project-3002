import { getMyProjects } from "../services/student-project.service";
import { PAGE_META, HEADINGS } from "@/constants/navigation";
import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { useQuery } from "@tanstack/react-query";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { ProjectCard } from "../components/project-card";
import { getAcademicYears } from "@/features/admin/services/admin.service";

export default function MyProjects() {
	useHeaderInitializer(PAGE_META.myProjects.title, PAGE_META.myProjects.subtitle);

	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [yearId, setYearId] = useState<number | undefined>(undefined);

	const { data: academicYears = [] } = useQuery({
		queryKey: ["academicYears"],
		queryFn: getAcademicYears,
		staleTime: 60_000,
	});

	const { data: projects, isLoading } = useQuery({
		queryKey: ["my-projects", yearId],
		queryFn: () => getMyProjects(yearId),
	});

	const projectList = projects?.data || [];

	const filteredProjects = projectList.filter((project: any) => {
		const matchesSearch =
			search === "" ||
			project.title.toLowerCase().includes(search.toLowerCase()) ||
			project.description.toLowerCase().includes(search.toLowerCase());

		const matchesStatus =
			statusFilter === "all" || project.status === statusFilter;

		return matchesSearch && matchesStatus;
	});

	const hasActiveFilters = search !== "" || statusFilter !== "all" || yearId !== undefined;

	const clearFilters = () => {
		setSearch("");
		setStatusFilter("all");
		setYearId(undefined);
	};

	return (
		<>
			<Heading
				title={HEADINGS.myProjects.title}
				description="Oversee your active collaborations, track project status, and
					coordinate with supervisors."
			/>

			{/* Filters */}
			<div className="flex flex-col gap-3 mt-5 sm:flex-row sm:items-center">
				<div className="relative flex-1">
					<MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
					<Input
						placeholder="Search by title or description..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="pl-9"
					/>
				</div>
				<Select value={statusFilter} onValueChange={setStatusFilter}>
					<SelectTrigger className="w-full sm:w-44">
						<SelectValue placeholder="Status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Status</SelectItem>
						<SelectItem value="active">Active</SelectItem>
						<SelectItem value="under review">Under Review</SelectItem>
						<SelectItem value="completed">Completed</SelectItem>
					</SelectContent>
				</Select>
				<Select
					value={yearId ? String(yearId) : "all"}
					onValueChange={(v) => setYearId(v === "all" ? undefined : Number(v))}
				>
					<SelectTrigger className="w-full sm:w-40">
						<SelectValue placeholder="Academic Year" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Years</SelectItem>
						{academicYears.map((y: any) => (
							<SelectItem key={y.id} value={String(y.id)}>
								{y.year}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				{hasActiveFilters && (
					<Button
						variant="ghost"
						size="sm"
						onClick={clearFilters}
						className="gap-1 text-gray-500">
						<XMarkIcon className="h-4 w-4" />
						Clear
					</Button>
				)}
			</div>

			{/* Results */}
			{isLoading ? (
				<div className="flex items-center justify-center py-20">
					<p className="text-gray-500">Loading projects...</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
					{filteredProjects.length > 0 ? (
						filteredProjects.map((project: any) => (
							<ProjectCard
								key={project.id}
								project={project}
							/>
						))
					) : (
						<div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
							<p className="text-gray-500">
								{hasActiveFilters
									? "No projects match your filters."
									: "You don't have any projects yet."}
							</p>
							{hasActiveFilters && (
								<Button
									variant="link"
									onClick={clearFilters}
									className="mt-2">
									Clear filters
								</Button>
							)}
						</div>
					)}
				</div>
			)}
		</>
	);
}
