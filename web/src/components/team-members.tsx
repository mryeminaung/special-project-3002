import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { IconUsersGroup } from "@tabler/icons-react";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default function TeamMembers({
	label,
	members,
}: {
	label: string;
	members: { id: number; name: string; email: string }[];
}) {
	return (
		<Card className="border-gray-200 shadow-sm">
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
					<IconUsersGroup className="size-5 stroke-2 text-primary-600" />
					{label}
					<Badge className="bg-primary-500 h-5 min-w-5 rounded-full px-1 font-mono tabular-nums text-xs text-center">
						{members.length}
					</Badge>
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-3">
				{members.map((student) => (
					<div key={student.id}>
						<p className="font-medium">{student.name}</p>
						<p className="flex items-center gap-1.5 truncate text-sm  ">
							<EnvelopeIcon className="h-3.5 w-3.5" />
							{student.email}
						</p>
					</div>
				))}
			</CardContent>
		</Card>
	);
}
