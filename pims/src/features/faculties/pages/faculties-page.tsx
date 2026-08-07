import api from "@/api/api";
import { PAGE_META, HEADINGS } from "@/constants/navigation";
import Heading from "@/components/heading";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { useQuery } from "@tanstack/react-query";
import FacultiesTable from "../components/faculties-table";

export default function FacultiesPage() {
	useHeaderInitializer(PAGE_META.faculties.title, PAGE_META.faculties.subtitle);

	const getFacultyData = async () => {
		const res = await api.get("/faculties");
		return res.data;
	};

	const { data: facultyData } = useQuery({
		queryKey: ["faculties"],
		queryFn: getFacultyData,
	});

	return (
		<div className="mx-auto max-w-7xl">
			<Heading
				title={HEADINGS.faculties.title}
				description="Browse and manage project proposals with team assignments and
				supervisors."
			/>
			{facultyData && <FacultiesTable facultyData={facultyData} />}
		</div>
	);
}
