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

export function MajorsSelection({ control, error }: Props) {
	return (
		<Field>
			<FieldLabel htmlFor="eligible_majors">
				Eligible Majors <span className="text-red-500">*</span>
			</FieldLabel>
			<Controller
				name="eligible_majors"
				control={control}
				rules={{ required: "Major type is required" }}
				render={({ field }) => (
					<Select
						onValueChange={(value) => field.onChange(value)}
						value={field.value ? field.value.toString() : ""}>
						<SelectTrigger className="w-full py-5">
							<SelectValue placeholder="Select major type" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectItem value="cse">CSE</SelectItem>
								<SelectItem value="ece">ECE</SelectItem>
								<SelectItem value="both">BOTH</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				)}
			/>
			{error && <ErrorMessage error={error} />}
		</Field>
	);
}
