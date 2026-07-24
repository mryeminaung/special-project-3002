import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { ShieldCheck } from "lucide-react";

export default function SupervisorCard({
	label,
	name,
	email,
}: {
	label: string;
	name: string;
	email: string;
}) {
	return (
		<Card className="border-gray-200 shadow-sm">
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
					<ShieldCheck className="size-5 stroke-2 text-primary-600" />
					{label}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<p className="font-semibold">{name}</p>
				<p className="flex items-center gap-1.5 text-sm">
					<EnvelopeIcon className="h-3.5 w-3.5" />
					{email}
				</p>
			</CardContent>
		</Card>
	);
}
