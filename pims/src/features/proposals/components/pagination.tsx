import {
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
	Pagination as ShadcnPagination,
} from "@/components/ui/pagination";
import type { PaginationMeta } from "@/types/api";
import { useSearchParams } from "react-router";

interface PaginationProps {
	meta: PaginationMeta;
	pageParamName?: string;
}

function getVisiblePages(currentPage: number, lastPage: number) {
	if (lastPage <= 7) {
		return Array.from({ length: lastPage }, (_, index) => index + 1);
	}

	if (currentPage <= 4) {
		return [1, 2, 3, 4, 5, "ellipsis", lastPage] as const;
	}

	if (currentPage >= lastPage - 3) {
		return [
			1,
			"ellipsis",
			lastPage - 4,
			lastPage - 3,
			lastPage - 2,
			lastPage - 1,
			lastPage,
		] as const;
	}

	return [
		1,
		"ellipsis",
		currentPage - 1,
		currentPage,
		currentPage + 1,
		"ellipsis",
		lastPage,
	] as const;
}

export default function Pagination({
	meta,
	pageParamName = "page",
}: PaginationProps) {
	const [searchParams, setSearchParams] = useSearchParams();
	const { currentPage, lastPage, perPage, total } = meta;
	const start = total === 0 ? 0 : (currentPage - 1) * perPage + 1;
	const end = total === 0 ? 0 : Math.min(currentPage * perPage, total);
	const pages = getVisiblePages(currentPage, lastPage);

	const buildSearchParams = (page: number) => {
		const nextSearchParams = new URLSearchParams(searchParams);

		if (page <= 1) {
			nextSearchParams.delete(pageParamName);
		} else {
			nextSearchParams.set(pageParamName, String(page));
		}

		return nextSearchParams;
	};

	const getHref = (page: number) => {
		const query = buildSearchParams(page).toString();
		return query ? `?${query}` : "?";
	};

	const handlePageChange =
		(page: number) => (event: React.MouseEvent<HTMLAnchorElement>) => {
			event.preventDefault();

			if (page < 1 || page > lastPage) {
				return;
			}

			setSearchParams(buildSearchParams(page));
		};

	return (
		<div className="flex flex-col gap-3 rounded-xl border bg-card/80 px-4 py-2 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-5">
			<div className="space-y-1">
				<p className="text-sm font-medium text-foreground">
					Showing {start} to {end} of {total} proposals
				</p>
			</div>

			<ShadcnPagination className="mx-0 w-auto justify-start sm:justify-end">
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious
							href={getHref(currentPage - 1)}
							onClick={handlePageChange(currentPage - 1)}
							className={
								currentPage === 1 ? "pointer-events-none opacity-50" : ""
							}
						/>
					</PaginationItem>

					{pages.map((page, index) => (
						<PaginationItem key={`${page}-${index}`}>
							{page === "ellipsis" ? (
								<PaginationEllipsis />
							) : (
								<PaginationLink
									href={getHref(page)}
									onClick={handlePageChange(page)}
									isActive={page === currentPage}
									className={
										page === currentPage
											? "border-primary-800 bg-primary-800 text-white hover:bg-primary-800 hover:text-white"
											: ""
									}>
									{page}
								</PaginationLink>
							)}
						</PaginationItem>
					))}

					<PaginationItem>
						<PaginationNext
							href={getHref(currentPage + 1)}
							onClick={handlePageChange(currentPage + 1)}
							className={
								currentPage === lastPage ? "pointer-events-none opacity-50" : ""
							}
						/>
					</PaginationItem>
				</PaginationContent>
			</ShadcnPagination>
		</div>
	);
}
