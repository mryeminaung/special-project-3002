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
}

export default function SupervisorSelection({ control, error }: Props) {
	const supervisors = [
		{ id: "5", name: "Daw Khaine Aye San" },
		{ id: "6", name: "Dr. Aye Aye Kyaw" },
		{ id: "7", name: "Daw Saw Win" },
		{ id: "8", name: "Dr. Sin Thira Myint" },
		{ id: "9", name: "Daw Zarchi" },
	];

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
									value={supervisor.id}>
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
