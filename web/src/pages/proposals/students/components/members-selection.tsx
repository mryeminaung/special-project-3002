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
	members: { id: number; name: string; email: string }[];
}

export default function MembersSelection({ control, error, members }: Props) {
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
							<MultiSelectValue placeholder="Select 2-4 team members..." />
						</MultiSelectTrigger>
						<MultiSelectContent className="overflow-auto">
							<MultiSelectGroup>
								{members.map((member) => (
									<MultiSelectItem
										key={member.id}
										value={member.id.toString()}>
										<p className="flex flex-col justify-start items-start">
											{member.name}
											<span>{member.email}</span>
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
