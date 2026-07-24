import api from "@/api/api";
import ErrorMessage from "@/components/error-message";
import { Field, FieldLabel } from "@/components/ui/field";
import {
	MultiSelect,
	MultiSelectContent,
	MultiSelectGroup,
	MultiSelectItem,
	MultiSelectTrigger,
	MultiSelectValue,
} from "@/components/ui/multi-select";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { MajorsDropdown } from "./majors-dropdown";

interface Props {
	control: any;
	error?: string;
}

type User = {
	id: number;
	name: string;
	email: string;
};

export default function MembersSelection({ control, error }: Props) {
	const { data: students = [] } = useQuery<User[]>({
		queryKey: ["students-for-proposal"],
		queryFn: async () => {
			const studentsRes = await api.get("students-for-proposal");
			return studentsRes.data;
		},
	});
	const [filterKey, setFilterKey] = useState<"all" | "cse" | "ece">("all");

	const filteredStudents = students.filter((student) => {
		if (filterKey === "all") return true;
		else if (filterKey === "cse")
			return student.email.toLowerCase().includes("cse");
		else if (filterKey === "ece")
			return student.email.toLowerCase().includes("ece");
	});

	return (
		<Field>
			<div className="flex flex-col md:flex-row gap-y-2 md:items-center justify-between">
				<FieldLabel htmlFor="members">
					Team Members <span className="text-red-500">*</span>
				</FieldLabel>
				<MajorsDropdown
					filterKey={filterKey}
					setFilterKey={setFilterKey}
				/>
			</div>

			<Controller
				name="members"
				control={control}
				rules={{
					required: "Team members are required",
					validate: (val: string[]) => {
						if (val.length < 2) return "Minimum 2 members required";
						if (val.length > 5) return "Maximum 5 members allowed";
						return true;
					},
				}}
				render={({ field }) => (
					<MultiSelect
						onValuesChange={field.onChange}
						values={field.value || []}>
						<MultiSelectTrigger
							id="members"
							className="w-full py-2.5">
							<MultiSelectValue placeholder="Select 2-4 team members..." />
						</MultiSelectTrigger>
						<MultiSelectContent className="overflow-auto">
							<MultiSelectGroup>
								{filteredStudents.map((student) => (
									<MultiSelectItem
										key={student.id}
										value={student.id.toString()}>
										<p className="flex flex-col justify-start items-start">
											{student.name}
											<span>{student.email}</span>
										</p>
									</MultiSelectItem>
								))}
							</MultiSelectGroup>
						</MultiSelectContent>
					</MultiSelect>
				)}
			/>

			{error && <ErrorMessage error={error} />}
		</Field>
	);
}
