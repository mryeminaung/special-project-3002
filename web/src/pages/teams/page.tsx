import api from "@/api/api";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import type { TeamsData } from "@/types";
import { useEffect, useState } from "react";
import TeamsTable from "./components/teams-table";

export default function TeamsPage() {
	useHeaderInitializer("MIIT | Teams", "Teams");

	const [teams, setTeams] = useState<TeamsData[]>([]);

	const fetchTeams = async () => {
		const res = await api.get("/teams");
		console.log(res.data);
		setTeams(res.data);
	};

	useEffect(() => {
		fetchTeams();
	}, []);

	return (
		<div className=" mx-auto max-w-7xl ">
			<div className="">
				<h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
					Teams List
				</h1>
				<p className="text-sm text-neutral-500">
					Browse and manage project proposals with team assignments and
					supervisors.
				</p>
			</div>
			<TeamsTable teamsData={teams} />
		</div>
	);
}
