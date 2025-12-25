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
import { Controller } from "react-hook-form";
interface Props {
	control: any;
	error?: string;
}

export default function MembersSelection({ control, error }: Props) {
	const members = [
		{ id: "20", name: "Mg Ye Min Aung" },
		{ id: "21", name: "Mg Khant Zaw Phyo" },
		{ id: "22", name: "Mg Aung Paing Min" },
		{ id: "23", name: "Mg Min Myat Thaw" },
		{ id: "24", name: "Ma Su Hlaing" },
		{ id: "25", name: "Mg Kyaw Zayar" },
	];

	return (
		<Field>
			<FieldLabel htmlFor="members">
				Team Members <span className="text-red-500">*</span>
			</FieldLabel>

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
							<MultiSelectValue placeholder="Select 4-5 team members..." />
						</MultiSelectTrigger>
						<MultiSelectContent className="overflow-auto">
							<MultiSelectGroup>
								{members.map((member) => (
									<MultiSelectItem
										key={member.id}
										value={member.id}>
										{member.name}
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
