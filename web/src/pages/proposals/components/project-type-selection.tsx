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
import type { EventType } from "@/pages/events/events.type";
import { useEventStore } from "@/stores/use-event-store";
import { useEffect } from "react";
import { Controller } from "react-hook-form";

interface Props {
	control: any;
	error?: string;
}

export function ProjectTypeSelection({ control, error }: Props) {
	const enrollmentByEvent = useEventStore((state) => state.enrollmentByEvent);
	const fetchEventStatuses = useEventStore((state) => state.fetchEventStatuses);

	useEffect(() => {
		void fetchEventStatuses();
	}, [fetchEventStatuses]);

	const eventByProjectType: Record<string, EventType> = {
		special: "special",
		capstone: "capstone",
		master: "master-thesis",
	};

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
							<SelectValue placeholder="Select project type (open events only)" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectItem
									value="special"
									disabled={!enrollmentByEvent[eventByProjectType.special]}>
									Special
								</SelectItem>
								<SelectItem
									value="capstone"
									disabled={!enrollmentByEvent[eventByProjectType.capstone]}>
									Capstone
								</SelectItem>
								<SelectItem
									value="master"
									disabled={!enrollmentByEvent[eventByProjectType.master]}>
									Master
								</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				)}
			/>
			{error && <ErrorMessage error={error} />}
		</Field>
	);
}
