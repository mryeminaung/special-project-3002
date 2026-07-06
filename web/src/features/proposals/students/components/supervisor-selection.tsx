import api from "@/api/api";
import ErrorMessage from "@/components/error-message";
import { Field, FieldLabel } from "@/components/ui/field";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Controller } from "react-hook-form";
import { DepartmentDropdown } from "./department-dropdown";

interface Props {
	control: any;
	error?: string;
}

type Faculty = {
	id: number;
	name: string;
	email: string;
	department?: string;
};

export default function SupervisorSelection({ control, error }: Props) {
	const [selectedDepartment, setSelectedDepartment] = useState("");

	const { data: supervisors = [] } = useQuery<Faculty[]>({
		queryKey: ["faculties-for-proposal"],
		queryFn: async () => {
			const res = await api.get("faculties-for-proposal");
			return res.data;
		},
	});

	const departmentNames = useMemo(() => {
		const names = supervisors
			.map((supervisor) => supervisor.department?.trim())
			.filter((name): name is string => Boolean(name));

		return Array.from(new Set(names)).sort((a, b) => a.localeCompare(b));
	}, [supervisors]);

	const filteredSupervisors = useMemo(() => {
		if (!selectedDepartment) return supervisors;

		return supervisors.filter(
			(supervisor) => supervisor.department === selectedDepartment,
		);
	}, [selectedDepartment, supervisors]);

	return (
		<Field>
			<Controller
				name="supervisor_id"
				control={control}
				rules={{ required: "Supervisor should not be empty" }}
				render={({ field }) => (
					<>
						<div className="flex flex-col md:flex-row gap-y-2 md:items-center justify-between">
							<FieldLabel htmlFor="supervisor">
								Project Supervisor <span className="text-red-500">*</span>
							</FieldLabel>
							<DepartmentDropdown
								departments={departmentNames}
								value={selectedDepartment}
								onValueChange={(departmentName) => {
									setSelectedDepartment(departmentName);
									field.onChange("");
								}}
							/>
						</div>

						<Select
							onValueChange={field.onChange}
							value={field.value || ""}>
							<SelectTrigger
								id="supervisor"
								className="py-5">
								<SelectValue placeholder="Choose your supervisor" />
							</SelectTrigger>
							<SelectContent>
								{filteredSupervisors.map((supervisor) => (
									<SelectItem
										key={supervisor.id}
										value={supervisor.id.toString()}>
										<p className="flex flex-col itemstar">{supervisor.name}</p>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</>
				)}
			/>

			{error && <ErrorMessage error={error} />}
		</Field>
	);
}
