import { useSearchParams } from "react-router";

interface UseCurrentPageOptions {
	paramName?: string;
	defaultPage?: number;
}

export function useCurrentPage({
	paramName = "page",
	defaultPage = 1,
}: UseCurrentPageOptions = {}) {
	const [searchParams] = useSearchParams();
	const rawPage = Number(searchParams.get(paramName));

	return Number.isInteger(rawPage) && rawPage > 0 ? rawPage : defaultPage;
}
