import { Button } from "@/components/ui/button";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface AnnouncementPaginationProps {
	currentPage: number;
	totalPages: number;
	totalItems: number;
	itemsPerPage: number;
	onPageChange: (page: number) => void;
}

export default function AnnouncementPagination({
	currentPage,
	totalPages,
	totalItems,
	itemsPerPage,
	onPageChange,
}: AnnouncementPaginationProps) {
	if (totalPages <= 1) return null;

	const startItem = (currentPage - 1) * itemsPerPage + 1;
	const endItem = Math.min(currentPage * itemsPerPage, totalItems);

	const getPageNumbers = (): (number | "...")[] => {
		const pages: (number | "...")[] = [];
		const maxVisible = 5;

		if (totalPages <= maxVisible) {
			for (let i = 1; i <= totalPages; i++) pages.push(i);
			return pages;
		}

		pages.push(1);

		if (currentPage > 3) pages.push("...");

		const start = Math.max(2, currentPage - 1);
		const end = Math.min(totalPages - 1, currentPage + 1);

		for (let i = start; i <= end; i++) pages.push(i);

		if (currentPage < totalPages - 2) pages.push("...");

		pages.push(totalPages);

		return pages;
	};

	return (
		<div className="flex items-center justify-between pt-4">
			<span className="text-sm text-muted-foreground">
				Showing {startItem}–{endItem} of {totalItems}
			</span>
			<div className="flex items-center gap-1">
				<Button
					variant="outline"
					size="icon"
					className="size-8"
					onClick={() => onPageChange(currentPage - 1)}
					disabled={currentPage === 1}>
					<IconChevronLeft size={16} />
				</Button>
				{getPageNumbers().map((page, index) =>
					page === "..." ? (
						<span
							key={`ellipsis-${index}`}
							className="px-1 text-muted-foreground text-sm">
							…
						</span>
					) : (
						<Button
							key={page}
							variant={currentPage === page ? "default" : "outline"}
							size="icon"
							className={cn(
								"size-8 text-sm",
								currentPage === page && "pointer-events-none",
							)}
							onClick={() => onPageChange(page)}>
							{page}
						</Button>
					),
				)}
				<Button
					variant="outline"
					size="icon"
					className="size-8"
					onClick={() => onPageChange(currentPage + 1)}
					disabled={currentPage === totalPages}>
					<IconChevronRight size={16} />
				</Button>
			</div>
		</div>
	);
}
