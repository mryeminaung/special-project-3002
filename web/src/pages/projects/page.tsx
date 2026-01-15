import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import RootLayout from "@/layouts/RootLayout";
import ProjectsTable from "./components/projects-table";

export default function ProjectsPage() {
	useHeaderInitializer("MIIT | Projects", "Projects");

	return (
		<RootLayout>
			<div className="flex flex-col mx-auto max-w-7xl gap-3 px-4 lg:px-6">
				<div className="">
					<h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
						Projects List
					</h1>
					<p className="text-sm text-neutral-500">
						Browse and manage project proposals with team assignments and
						supervisors.
					</p>
				</div>
				<ProjectsTable supervisorData={[]} />
			</div>
		</RootLayout>
	);
}
