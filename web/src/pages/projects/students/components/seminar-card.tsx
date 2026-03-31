import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Presentation } from "lucide-react";

export default function SeminarCard() {
	return (
		<Card className="border-gray-200 shadow-sm">
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
					<Presentation className="size-5 stroke-2 text-primary-600" />
					Project Seminars
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-1">
				<p className="font-semibold">Mid Seminar</p>
				<div className="flex items-center gap-x-2">
					<Calendar className="size-3 stroke-2 text-primary-600" />
					<p className="flex items-center gap-1.5 text-sm">
						Feb 9, 2026, 2:00 PM
					</p>
				</div>

				<p className="font-semibold">Final Seminar</p>
				<div className="flex items-center gap-x-2">
					<Calendar className="size-3 stroke-2 text-primary-600" />
					<p className="flex items-center gap-1.5 text-sm">
						April 3, 2026, 2:00 PM
					</p>
				</div>
			</CardContent>
		</Card>
	);
}
