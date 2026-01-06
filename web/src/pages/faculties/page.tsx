import api from "@/api/api";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import RootLayout from "@/layouts/RootLayout";
import type { UsersData } from "@/types";
import { useEffect, useState } from "react";
import UsersTable from "./components/users-table";

export default function FacultiesPage() {
	useHeaderInitializer("MIIT| Faculties", "Faculties List");

	const [facultyData, setFacultyData] = useState<UsersData[]>([]);

	const getFacultyData = async () => {
		const res = await api.get("/faculties/lists");
		setFacultyData(res.data);
	};

	useEffect(() => {
		getFacultyData();
	}, []);

	return (
		<RootLayout>
			<div className="px-4 lg:px-6">
				<h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
					Faculties List
				</h1>
				<p className="text-sm text-neutral-500">
					Browse and manage project proposals with team assignments and
					supervisors.
				</p>
				{facultyData && <UsersTable facultyData={facultyData} />}
			</div>
		</RootLayout>
	);
}
