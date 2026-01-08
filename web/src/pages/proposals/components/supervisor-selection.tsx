import ErrorMessage from "@/components/error-message";
import { Field, FieldLabel } from "@/components/ui/field";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Controller } from "react-hook-form";

interface Props {
	control: any;
	error?: string;
	supervisors: { id: number; name: string }[];
}

export default function SupervisorSelection({
	control,
	error,
	supervisors,
}: Props) {
	return (
		<Field>
			<FieldLabel htmlFor="supervisor">
				Project Supervisor <span className="text-red-500">*</span>
			</FieldLabel>

			<Controller
				name="supervisor_id"
				control={control}
				rules={{ required: "Supervisor should not be empty" }}
				render={({ field }) => (
					<Select
						onValueChange={field.onChange}
						value={field.value || ""}>
						<SelectTrigger
							id="supervisor"
							className="py-5">
							<SelectValue placeholder="Choose your supervisor" />
						</SelectTrigger>
						<SelectContent>
							{supervisors.map((supervisor) => (
								<SelectItem
									key={supervisor.id}
									value={supervisor.id.toString()}>
									{supervisor.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				)}
			/>

			{error && <ErrorMessage error={error} />}
		</Field>
	);
}
