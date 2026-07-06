import PageWrapper from "@/components/common/page-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Calendar, MoreVertical, Plus } from "lucide-react";

// 1. Hardcoded data for MIIT PIMS
const staticEvents = [
	{
		id: 1,
		title: "Special Project Proposal Submission 2026",
		type: "Special",
		start_date: "2026-04-10",
		end_date: "2026-04-24",
		status: "Active",
	},
	{
		id: 2,
		title: "Final Year Capstone Project Selection",
		type: "Capstone",
		start_date: "2026-05-01",
		end_date: "2026-05-15",
		status: "Closed",
	},
	{
		id: 3,
		title: "Graduate Thesis Defense and Documentation",
		type: "Master/Thesis",
		start_date: "2026-06-01",
		end_date: "2026-07-30",
		status: "Active",
	},
];

export default function EventsListPage() {
	return (
		<PageWrapper>
			<div className="space-y-6">
				{/* Header Section */}
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-bold tracking-tight text-slate-900">
							Academic Events
						</h1>
						<p className="text-sm text-muted-foreground">
							Manage project timelines for the current semester.
						</p>
					</div>
					<Button className="gap-2 bg-primary-600">
						<Plus className="h-4 w-4" /> Create Event
					</Button>
				</div>

				{/* Table Section */}
				<div className="rounded-xl border bg-card shadow-sm overflow-hidden">
					<Table>
						<TableHeader className="bg-slate-50/50">
							<TableRow>
								<TableHead className="font-semibold">Event Title</TableHead>
								<TableHead className="font-semibold">Type</TableHead>
								<TableHead className="font-semibold">Duration</TableHead>
								<TableHead className="font-semibold text-center">
									Status
								</TableHead>
								<TableHead className="text-right"></TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{staticEvents.map((event) => (
								<TableRow
									key={event.id}
									className="hover:bg-slate-50/30 transition-colors">
									<TableCell className="font-medium text-slate-700">
										<div className="flex items-center gap-3">
											<div className="p-2 bg-primary/10 rounded-lg">
												<Calendar className="h-4 w-4 text-primary" />
											</div>
											{event.title}
										</div>
									</TableCell>
									<TableCell>
										<span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
											{event.type}
										</span>
									</TableCell>
									<TableCell className="text-slate-600 text-sm">
										{new Date(event.start_date).toLocaleDateString()} —{" "}
										{new Date(event.end_date).toLocaleDateString()}
									</TableCell>
									<TableCell className="text-center">
										<Badge
											variant={
												event.status === "Active" ? "default" : "secondary"
											}
											className={
												event.status === "Active"
													? "bg-emerald-500 hover:bg-emerald-600"
													: ""
											}>
											{event.status}
										</Badge>
									</TableCell>
									<TableCell className="text-right">
										<Button
											variant="ghost"
											size="icon"
											className="h-8 w-8">
											<MoreVertical className="h-4 w-4 text-slate-400" />
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</div>
		</PageWrapper>
	);
}
