import { useCurrentPage } from "./use-current-page";

export function usePagination(paramName = "page") {
	const page = useCurrentPage({ paramName });
	return { page };
}
