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
	workload_count?: number;
	max_capacity?: number;
};

function WorkloadDot({
	count,
	capacity,
}: {
	count?: number;
	capacity?: number;
}) {
	if (count === undefined || capacity === undefined || capacity === 0)
		return null;

	const ratio = count / capacity;
	let color: string;
	if (ratio <= 0.5) color = "bg-green-500";
	else if (ratio <= 0.8) color = "bg-yellow-500";
	else color = "bg-red-500";

	return (
		<span className="flex items-center gap-1.5 text-xs text-muted-foreground">
			<span className={`inline-block h-2 w-2 rounded-full ${color}`} />
			{count}/{capacity}
		</span>
	);
}

export default function SupervisorSelection({ control, error }: Props) {
	const [selectedDepartment, setSelectedDepartment] = useState("");

	const { data: supervisorsRes } = useQuery({
		queryKey: ["faculties-for-proposal"],
		queryFn: async () => {
			const res = await api.get("faculties-for-proposal");
			return res.data;
		},
	});

	const supervisors: Faculty[] = Array.isArray(supervisorsRes)
		? supervisorsRes
		: ((supervisorsRes?.data as Faculty[]) ?? []);

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
								Project Supervisor{" "}
								<span className="text-red-500">*</span>
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
							value={field.value || ""}
						>
							<SelectTrigger id="supervisor" className="py-5">
								<SelectValue placeholder="Choose your supervisor" />
							</SelectTrigger>
							<SelectContent>
								{filteredSupervisors.map((supervisor) => (
									<SelectItem
										key={supervisor.id}
										value={supervisor.id.toString()}
									>
										<div className="flex items-center justify-between w-full gap-4">
											<span>{supervisor.name}</span>
											<WorkloadDot
												count={
													supervisor.workload_count
												}
												capacity={
													supervisor.max_capacity
												}
											/>
										</div>
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
