import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import RootLayout from "@/layouts/RootLayout";
import TeamsTable from "./components/teams-table";

export default function TeamsPage() {
	useHeaderInitializer("MIIT | Teams", "Teams");

	return (
		<RootLayout>
			<div className="flex flex-col mx-auto max-w-7xl gap-3 px-4 lg:px-6">
				<div className="">
					<h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
						Teams List
					</h1>
					<p className="text-sm text-neutral-500">
						Browse and manage project proposals with team assignments and
						supervisors.
					</p>
				</div>
				<TeamsTable supervisorData={[]} />
			</div>
		</RootLayout>
	);
}
