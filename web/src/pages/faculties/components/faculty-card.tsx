import { type Icon } from "@tabler/icons-react";

import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

type FacultyCard = {
	id: number;
	total: string;
	cardIcon?: Icon;
	title: string;
	description: string;
};

interface FacultyCardProps {
	facultyData: FacultyCard[];
}

export function FacultyCards({ facultyData }: FacultyCardProps) {
	return (
		<>
			{facultyData?.length > 0 &&
				facultyData.map((faculty) => (
					<Card
						key={faculty.title}
						className="@container/card">
						<CardHeader>
							<CardDescription className="font-normal text-black flex items-center justify-between text-base">
								{faculty.title}
								{faculty.cardIcon && <faculty.cardIcon size={20} />}
							</CardDescription>
							<CardTitle className="text-2xl font-mono font-semibold tabular-nums @[250px]/card:text-3xl">
								{faculty.total}
							</CardTitle>
						</CardHeader>
						<CardFooter className="flex-col items-start gap-1.5 text-sm ">
							<div className="text-muted-foreground line-clamp-1 md:line-clamp-2">
								{faculty.description}
							</div>
						</CardFooter>
					</Card>
				))}
		</>
	);
}
