import api from "@/api/api";
import PageWrapper from "@/components/page-wrapper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { BookOpen, Loader2, Mail, MoreHorizontal, User } from "lucide-react";

interface Student {
	id: number;
	name: string;
	email: string;
	avatar_url?: string;
	major: string; // e.g., "ECE", "CSE"
}

export default function StudentsListPage() {
	const { data: students, isLoading } = useQuery<Student[]>({
		queryKey: ["admin-students-list"],
		queryFn: async () => {
			const response = await api.get("/admin/students");
			return response.data;
		},
	});

	if (isLoading)
		return (
			<div className="flex justify-center p-20">
				<Loader2 className="animate-spin" />
			</div>
		);

	return (
		<PageWrapper>
			<div className="">
				<div className="mb-6">
					<h1 className="text-2xl font-bold text-slate-800">Student Records</h1>
					<p className="text-sm text-slate-500">
						Overview of all students enrolled in the project portal.
					</p>
				</div>
				<div className="rounded-lg border bg-white shadow-sm">
					<Table>
						<TableHeader>
							<TableRow className="bg-slate-50">
								<TableHead className="w-[350px]">Student Name</TableHead>
								<TableHead>Email Address</TableHead>
								<TableHead>Major / Department</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{students?.map((student) => (
								<TableRow key={student.id}>
									<TableCell className="py-4">
										<div className="flex items-center gap-3">
											<Avatar className="h-8 w-8">
												<AvatarImage src={student.avatar_url} />
												<AvatarFallback>
													<User className="h-4 w-4" />
												</AvatarFallback>
											</Avatar>
											<span className="font-medium text-slate-700">
												{student.name}
											</span>
										</div>
									</TableCell>
									<TableCell>
										<div className="flex items-center gap-2 text-slate-500 text-sm">
											<Mail className="h-4 w-4 opacity-70" />
											{student.email}
										</div>
									</TableCell>
									<TableCell>
										<Badge
											variant="secondary"
											className="gap-1.5 font-medium px-3">
											<BookOpen className="h-3.5 w-3.5" />
											{student.major}
										</Badge>
									</TableCell>
									<TableCell className="text-right">
										<Button
											variant="ghost"
											size="icon">
											<MoreHorizontal className="h-4 w-4" />
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
