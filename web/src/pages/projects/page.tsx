import api from "@/api/api";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import type { Project } from "@/types";
import { useEffect, useState } from "react";
import ProjectsTable from "./components/projects-table";

export default function ProjectsPage() {
	useHeaderInitializer("MIIT| Proposals", "Project Proposals");

	const [projects, setProjects] = useState<Project[]>([]);

	const getProjects = async () => {
		const res = await api.get("/projects");
		// console.log(res.data);
		setProjects(res.data);
	};

	useEffect(() => {
		getProjects();
	}, []);

	return (
		<div className="mx-auto max-w-7xl">
			<h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
				Projects List
			</h1>
			<p className="text-sm text-neutral-500">
				Browse and manage project proposals with team assignments and
				supervisors.
			</p>
			{projects && <ProjectsTable projects={projects} />}
		</div>
	);
}
