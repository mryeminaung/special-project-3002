import api from "@/api/api";
import ErrorMessage from "@/components/error-message";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { Controller } from "react-hook-form";

interface Props {
	control: any;
	error?: string;
}

type ProjectArea = {
	id: number;
	name: string;
};

export function ProjectAreaSelection({ control, error }: Props) {
	const fetchProjectAreas = async () => {
		const res = await api.get("/project-areas");
		return res.data;
	};

	const { data: projectAreas } = useQuery({
		queryKey: ["project-areas"],
		queryFn: fetchProjectAreas,
	});

	const areas = Array.isArray(projectAreas)
		? projectAreas
		: (projectAreas?.data as ProjectArea[]) ?? [];

	return (
		<>
			<Controller
				name="area_id"
				control={control}
				rules={{ required: "Project area is required" }}
				render={({ field }) => (
					<Select
						onValueChange={(value) => field.onChange(Number(value))}
						value={field.value ? field.value.toString() : ""}>
						<SelectTrigger className="w-full py-5">
							<SelectValue placeholder="Select project area" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								{areas.map((area: ProjectArea) => (
									<SelectItem
										key={area.id}
										value={area.id.toString()}>
										{area.name}
									</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
					</Select>
				)}
			/>
			{error && <ErrorMessage error={error} />}
		</>
	);
}
