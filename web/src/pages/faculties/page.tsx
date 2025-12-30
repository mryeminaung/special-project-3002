import api from "@/api/api";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import RootLayout from "@/layouts/RootLayout";
import type { UsersData } from "@/types";
import { IconLoader } from "@tabler/icons-react";
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
			{/* <div className="grid grid-cols-1 gap-6 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-5">
				<FacultyCards facultyData={facultyData} />
			</div> */}
			<div className="px-4 lg:px-6">
				<h1 className="text-3xl font-bold text-foreground">Faculties List</h1>
				<p className="text-muted-foreground">
					Browse and manage project proposals with team assignments and
					supervisors.
				</p>
				{facultyData.length > 0 ? (
					<UsersTable facultyData={facultyData} />
				) : (
					<div className="flex items-center justify-center">
						<IconLoader className="animate-spin" />
					</div>
				)}
			</div>
		</RootLayout>
	);
}
