import { FieldLabel } from "@/components/ui/field";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export function MajorsDropdown({
	filterKey,
	setFilterKey,
}: {
	filterKey: "all" | "cse" | "ece";
	setFilterKey: (key: "all" | "cse" | "ece") => void;
}) {
	return (
		<div className="flex items-center space-x-2">
			<FieldLabel className="w-28">Filter By: </FieldLabel>
			<Select
				onValueChange={(value: any) => setFilterKey(value)}
				value={filterKey}>
				<SelectTrigger className="w-full">
					<SelectValue placeholder="All" />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectLabel>Majors</SelectLabel>
						<SelectItem value="all">All</SelectItem>
						<SelectItem value="cse">CSE</SelectItem>
						<SelectItem value="ece">ECE</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>
	);
}
