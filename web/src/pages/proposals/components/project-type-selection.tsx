import ErrorMessage from "@/components/error-message";
import { Field, FieldLabel } from "@/components/ui/field";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Controller } from "react-hook-form";

interface Props {
	control: any;
	error?: string;
}

export function ProjectTypeSelection({ control, error }: Props) {
	return (
		<Field>
			<FieldLabel htmlFor="project_type">
				Project Type <span className="text-red-500">*</span>
			</FieldLabel>
			<Controller
				name="project_type"
				control={control}
				rules={{ required: "Project type is required" }}
				render={({ field }) => (
					<Select
						onValueChange={(value) => field.onChange(value)}
						value={field.value ? field.value.toString() : ""}>
						<SelectTrigger className="w-full py-5">
							<SelectValue placeholder="Select project type" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectItem value="special">Special</SelectItem>
								<SelectItem value="capstone">Capstone</SelectItem>
								<SelectItem value="master">Master</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				)}
			/>
			{error && <ErrorMessage error={error} />}
		</Field>
	);
}
