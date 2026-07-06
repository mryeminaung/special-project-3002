import api from "@/api/api";
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
import { useQuery } from "@tanstack/react-query";
import {
	Code2,
	Cpu,
	Globe,
	Layers,
	Loader2,
	MoreHorizontal,
	Plus,
} from "lucide-react";

// Interface based on your Laravel ProjectArea model
interface ProjectArea {
	id: number;
	name: string;
	description: string;
	projects_count: number; // Added via withCount('projects') in Laravel
}

export default function ProjectAreasPage() {
	const { data: areas, isLoading } = useQuery<ProjectArea[]>({
		queryKey: ["admin-project-areas"],
		queryFn: async () => {
			const response = await api.get("/admin/project-areas");
			return response.data;
		},
	});

	if (isLoading) {
		return (
			<div className="flex h-96 items-center justify-center">
				<Loader2 className="h-10 w-10 animate-spin text-primary/60" />
			</div>
		);
	}

	return (
		<PageWrapper>
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold tracking-tight">Project Areas</h1>
						<p className="text-muted-foreground mt-1">
							Categorize student proposals by technical domain.
						</p>
					</div>
					<Button className="gap-2 shadow-sm">
						<Plus className="h-4 w-4" /> New Area
					</Button>
				</div>
				<div className="rounded-xl border bg-white shadow-sm overflow-hidden">
					<Table>
						<TableHeader className="bg-slate-50/50">
							<TableRow>
								<TableHead className="w-[250px]">Domain Name</TableHead>
								<TableHead>Description</TableHead>
								<TableHead className="text-center">Active Projects</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{areas?.map((area) => (
								<TableRow
									key={area.id}
									className="hover:bg-slate-50/20 transition-colors">
									<TableCell className="font-semibold text-slate-900">
										<div className="flex items-center gap-3">
											<AreaIcon name={area.name} />
											{area.name}
										</div>
									</TableCell>
									<TableCell className="text-slate-500 text-sm max-w-md truncate">
										{area.description || "No description provided."}
									</TableCell>
									<TableCell className="text-center">
										<Badge
											variant="outline"
											className="font-mono bg-blue-50 text-blue-700 border-blue-200">
											{area.projects_count || 0}
										</Badge>
									</TableCell>
									<TableCell className="text-right">
										<Button
											variant="ghost"
											size="icon">
											<MoreHorizontal className="h-4 w-4 text-slate-400" />
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

// Helper component to show dynamic icons based on area name
function AreaIcon({ name }: { name: string }) {
	const lowerName = name.toLowerCase();
	if (lowerName.includes("iot") || lowerName.includes("embedded"))
		return <Cpu className="h-4 w-4 text-orange-500" />;
	if (lowerName.includes("web") || lowerName.includes("frontend"))
		return <Globe className="h-4 w-4 text-blue-500" />;
	if (lowerName.includes("ai") || lowerName.includes("data"))
		return <Layers className="h-4 w-4 text-purple-500" />;
	return <Code2 className="h-4 w-4 text-slate-400" />;
}
