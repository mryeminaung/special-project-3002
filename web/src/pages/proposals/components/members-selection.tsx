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
		{ id: "mem001", name: "Mg Ye Min Aung" },
		{ id: "mem002", name: "Mg Khant Zaw Phyo" },
		{ id: "mem003", name: "Mg Aung Paing Min" },
		{ id: "mem004", name: "Mg Min Myat Thaw" },
		{ id: "mem005", name: "Ma Su Hlaing" },
		{ id: "mem006", name: "Mg Kyaw Zayar" },
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
