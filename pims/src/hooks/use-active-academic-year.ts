import { getActiveAcademicYear } from "@/features/admin/services/admin.service";
import { useQuery } from "@tanstack/react-query";

export function useActiveAcademicYear() {
	const { data, isLoading } = useQuery({
		queryKey: ["activeAcademicYear"],
		queryFn: getActiveAcademicYear,
		staleTime: 60_000,
		refetchOnWindowFocus: false,
	});

	const hasActiveYear = !!data;

	return {
		activeYear: data ?? null,
		hasActiveYear,
		isLoading,
	};
}
