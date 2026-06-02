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
import { CheckCircle2, Clock, Eye, XCircle } from "lucide-react";
import { Link } from "react-router";

function StatusBadge({ status }: { status: string }) {
	switch (status.toLowerCase()) {
		case "not completed":
			return (
				<Badge className="bg-red-100 text-red-700 hover:bg-red-100">
					<XCircle className="w-3 h-3 mr-1" />
					Not Completed
				</Badge>
			);
		case "not submitted":
			return (
				<Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
					<Clock className="w-3 h-3 mr-1" />
					Not Submitted
				</Badge>
			);
		case "completed":
			return (
				<Badge className="bg-green-100 text-green-700 hover:bg-green-100">
					<CheckCircle2 className="w-3 h-3 mr-1" />
					Completed
				</Badge>
			);
		case "submitted":
			return (
				<Badge className="bg-violet-100 text-violet-700 hover:bg-violet-100">
					<CheckCircle2 className="w-3 h-3 mr-1" />
					Submitted
				</Badge>
			);
		case "pending":
			return (
				<Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
					<Clock className="w-3 h-3 mr-1" />
					Pending
				</Badge>
			);
		default:
			return <Badge variant="outline">{status}</Badge>;
	}
}

export default function ProjectProgressTable({
	projects,
}: {
	projects?: any[];
}) {
	const getProjectDetailUrl = (project: any) => {
		if (!project?.slug) return "/projects";
		return `/projects/${project.slug}/detail`;
	};

	return (
		<div className="rounded-lg border mt-5 bg-card">
			<Table>
				<TableHeader>
					<TableRow className="bg-muted/50">
						<TableHead>Project ID</TableHead>
						<TableHead>Name</TableHead>
						<TableHead>Supervisor</TableHead>
						<TableHead>Mid-Report</TableHead>
						<TableHead>Mid Seminar</TableHead>
						<TableHead>Final Report</TableHead>
						<TableHead>Final Seminar</TableHead>
						<TableHead className="border-l">View</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{projects &&
						projects.map((project) => (
							<TableRow key={project.id}>
								<TableCell className="font-medium">{project.id}</TableCell>
								<TableCell className="max-w-[200px]">
									<span className="truncate block">{project.name}</span>
								</TableCell>
								<TableCell>{project.supervisorName}</TableCell>
								<TableCell>
									<StatusBadge status={project.midReport} />
								</TableCell>
								<TableCell>
									<StatusBadge status={project.midSeminar} />
								</TableCell>
								<TableCell>
									<StatusBadge status={project.finalReport} />
								</TableCell>
								<TableCell>
									<StatusBadge status={project.finalSeminar} />
								</TableCell>
								<TableCell className="border-l">
									<Button
										size="sm"
										className="bg-violet-600 hover:bg-violet-700"
										asChild>
										<Link to={getProjectDetailUrl(project)}>
											<Eye className="w-4 h-4 mr-1" />
											View
										</Link>
									</Button>
								</TableCell>
							</TableRow>
						))}
				</TableBody>
			</Table>
		</div>
	);
}
