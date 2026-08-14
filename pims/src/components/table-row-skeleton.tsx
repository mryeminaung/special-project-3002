import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";

interface TableRowSkeletonProps {
	rows?: number;
	colSpan?: number;
	cells?: string[];
}

const DEFAULT_CELLS = [
	"h-4 w-48",
	"h-4 w-28",
	"h-4 w-32",
	"h-4 w-14",
	"h-4 w-20",
	"h-5 w-20 rounded-full",
	"h-4 w-24",
	"mx-auto h-8 w-16 rounded-md",
];

export default function TableRowSkeleton({
	rows = 5,
	colSpan,
	cells,
}: TableRowSkeletonProps) {
	const cellClasses = cells ?? DEFAULT_CELLS.slice(0, colSpan ?? DEFAULT_CELLS.length);

	return Array.from({ length: rows }).map((_, rowIndex) => (
		<TableRow key={`table-row-skeleton-${rowIndex}`}>
			{cellClasses.map((className, cellIndex) => (
				<TableCell key={`table-row-skeleton-cell-${rowIndex}-${cellIndex}`}>
					<Skeleton className={className} />
				</TableCell>
			))}
		</TableRow>
	));
}
