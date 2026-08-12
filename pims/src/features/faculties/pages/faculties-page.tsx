import api from "@/api/api";
import Heading from "@/components/heading";
import { HEADINGS, PAGE_META } from "@/constants/navigation";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { useQuery } from "@tanstack/react-query";
import FacultiesTable from "../components/faculties-table";

export default function FacultiesPage() {
	useHeaderInitializer(
		PAGE_META.faculties.title,
		PAGE_META.faculties.subtitle,
	);

	const getFacultyData = async () => {
		const res = await api.get("/faculties");
		return res.data;
	};

	const { data: facultyData, isFetching } = useQuery({
		queryKey: ["faculties"],
		queryFn: getFacultyData,
	});

	return (
		<>
			<Heading
				title={HEADINGS.faculties.title}
				description="Browse and manage faculty members."
			/>
			<FacultiesTable
				facultyData={facultyData?.data ?? []}
				isLoading={isFetching}
			/>
		</>
	);
}
