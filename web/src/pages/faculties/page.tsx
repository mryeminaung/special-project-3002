import api from "@/api/api";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import RootLayout from "@/layouts/RootLayout";
import { useEffect, useState } from "react";
import { UserTable } from "./components/user-table";

type FacultyData = {
	id: number;
	total: string;
	title: string;
	description: string;
};

export default function FacultiesPage() {
	useHeaderInitializer("MIIT| Faculties", "Faculties List");

	const [facultyData, setFacultyData] = useState<FacultyData[]>([]);

	const getFacultyData = async () => {
		const res = await api.get("/faculty-data");
		setFacultyData(res.data);
	};

	useEffect(() => {
		getFacultyData();
	}, []);

	return (
		<RootLayout>
			<div className="grid grid-cols-1 gap-6 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-5">
				{/* <FacultyCards facultyData={facultyData} /> */}
			</div>
			<div className="px-4 lg:px-6 mt-5">
				<h2 className="text-2xl font-semibold">Faculty Lists</h2>
				<p className="text-muted-foreground text-sm">View</p>
				<UserTable />
			</div>
		</RootLayout>
	);
}
