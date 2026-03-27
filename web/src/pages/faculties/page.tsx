import api from "@/api/api";
import Heading from "@/components/heading";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { useQuery } from "@tanstack/react-query";
import FacultiesTable from "./components/faculties-table";

export default function FacultiesPage() {
	useHeaderInitializer("MIIT | Faculties", "Faculties List");

	const getFacultyData = async () => {
		const res = await api.get("/faculties/lists");
		return res.data;
	};

	const { data: facultyData } = useQuery({
		queryKey: ["faculties"],
		queryFn: getFacultyData,
	});

	return (
		<div className="mx-auto max-w-7xl">
			<Heading
				title="Faculties"
				description="Browse and manage project proposals with team assignments and
				supervisors."
			/>
			{facultyData && <FacultiesTable facultyData={facultyData} />}
		</div>
	);
}
