import { CodeBracketIcon } from "@heroicons/react/24/solid";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default function DescriptionCard({
	label,
	description,
}: {
	label: string;
	description: string;
}) {
	return (
		<Card className="border-gray-200 shadow-sm">
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-lg">
					<CodeBracketIcon className="size-5 stroke-2 text-primary-600" />
					{label} Description
				</CardTitle>
			</CardHeader>
			<CardContent>{description}</CardContent>
		</Card>
	);
}
