import api from "@/api/api";
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
	ArrowUpRight,
	Building2,
	Loader2,
	MoreHorizontal,
	Plus,
	Users,
} from "lucide-react";

interface Department {
	id: number;
	name: string;
	description: string;
	users_count: number; // Fetched via withCount('users') in Laravel
}

export default function DepartmentsListPage() {
	const { data: departments, isLoading } = useQuery<Department[]>({
		queryKey: ["admin-departments"],
		queryFn: async () => {
			const response = await api.get("/admin/departments");
			return response.data;
		},
	});

	if (isLoading)
		return (
			<div className="flex justify-center p-20">
				<Loader2 className="animate-spin text-primary" />
			</div>
		);

	return (
		<div className="animate-in fade-in duration-500">
			<div className="flex items-center justify-between mb-8">
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-slate-900">
						MIIT Departments
					</h1>
					<p className="text-sm text-slate-500">
						Overview of academic departments and total personnel.
					</p>
				</div>
				<Button className="gap-2 bg-primary hover:bg-primary/90 shadow-md">
					<Plus className="h-4 w-4" /> Add Department
				</Button>
			</div>

			<div className="rounded-xl border bg-white shadow-sm overflow-hidden">
				<Table>
					<TableHeader className="bg-slate-50/50">
						<TableRow>
							<TableHead className="w-[300px]">Department Name</TableHead>
							<TableHead>Description</TableHead>
							<TableHead className="text-center">Total Members</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{departments?.map((dept) => (
							<TableRow
								key={dept.id}
								className="group hover:bg-slate-50/30 transition-colors">
								<TableCell className="py-4">
									<div className="flex items-center gap-3">
										<div className="p-2 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
											<Building2 className="h-5 w-5 text-indigo-600" />
										</div>
										<span className="font-semibold text-slate-700">
											{dept.name}
										</span>
									</div>
								</TableCell>
								<TableCell className="text-slate-500 text-sm max-w-xs truncate">
									{dept.description || "Academic department at MIIT."}
								</TableCell>
								<TableCell className="text-center">
									<Badge
										variant="outline"
										className="gap-1.5 px-3 py-1 bg-slate-50 border-slate-200">
										<Users className="h-3.5 w-3.5 text-slate-500" />
										{dept.users_count}
									</Badge>
								</TableCell>
								<TableCell className="text-right">
									<div className="flex justify-end gap-2">
										<Button
											variant="ghost"
											size="icon"
											title="View Details">
											<ArrowUpRight className="h-4 w-4 text-slate-400" />
										</Button>
										<Button
											variant="ghost"
											size="icon">
											<MoreHorizontal className="h-4 w-4 text-slate-400" />
										</Button>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
