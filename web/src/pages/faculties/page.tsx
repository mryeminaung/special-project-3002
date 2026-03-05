import api from "@/api/api";
import Heading from "@/components/heading";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import type { UsersData } from "@/types";
import { useEffect, useState } from "react";
import UsersTable from "./components/faculties-table";

export default function FacultiesPage() {
	useHeaderInitializer("MIIT | Faculties", "Faculties List");

	const [facultyData, setFacultyData] = useState<UsersData[]>([]);

	const getFacultyData = async () => {
		const res = await api.get("/faculties/lists");
		setFacultyData(res.data);
	};

	useEffect(() => {
		getFacultyData();
	}, []);

	return (
		<div className="mx-auto max-w-7xl">
			<Heading
				title="Faculties"
				description="Browse and manage project proposals with team assignments and
				supervisors."
			/>
			{facultyData && <UsersTable facultyData={facultyData} />}
		</div>
	);
}
