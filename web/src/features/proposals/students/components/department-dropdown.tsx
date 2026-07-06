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

interface DepartmentDropdownProps {
	departments: string[];
	value: string;
	onValueChange: (departmentName: string) => void;
}

const ALL_DEPARTMENTS = "__ALL_DEPARTMENTS__";

export function DepartmentDropdown({
	departments,
	value,
	onValueChange,
}: DepartmentDropdownProps) {
	return (
		<div className="flex items-center space-x-2">
			<FieldLabel className="w-25">Filter By: </FieldLabel>
			<Select
				onValueChange={(nextValue) => {
					onValueChange(nextValue === ALL_DEPARTMENTS ? "" : nextValue);
				}}
				value={value || ALL_DEPARTMENTS}>
				<SelectTrigger className="w-full">
					<SelectValue placeholder="Choose a department" />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectLabel>Department Names</SelectLabel>
						<SelectItem value={ALL_DEPARTMENTS}>All Departments</SelectItem>
						{departments.map((department) => (
							<SelectItem
								key={department}
								value={department}>
								{department}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>
	);
}
