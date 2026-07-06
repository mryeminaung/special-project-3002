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
import { useRoleChecker } from "@/hooks/use-role-checker";
import { BookOpen, Mail } from "lucide-react";

// --- Mock Data Generator ---
const generateMockStudents = (count: number): Student[] => {
	const majors = ["ECE", "CSE"];
	const names = [
		"Aung Kyaw",
		"Su Sandi",
		"Min Thant",
		"Hla Hla",
		"Kyaw Zin",
		"Thida Win",
		"Moe Satt",
		"Zayar Phyo",
		"Ei Thinzar",
		"Nanda Soe",
	];

	return Array.from({ length: count }, (_, i) => {
		const major = majors[i % 2];
		const rollNo = (i + 1).toString().padStart(3, "0");
		return {
			name: `${names[i % names.length]} (${i + 1})`,
			email: `2019-miit-${major.toLowerCase()}-${rollNo}@miit.edu.mm`,
			major_name: major,
		};
	});
};

const mockStudents = generateMockStudents(30);

interface Student {
	name: string;
	email: string;
	major_name: string | null;
}

export default function StuListPage() {
	// We skip isLoading for the mock test
	const students = mockStudents;
	const { isAdmin } = useRoleChecker();
	return (
		<PageWrapper>
			<div className="animate-in fade-in duration-500">
				<div className="mb-6 flex justify-between items-end">
					<div>
						<h1 className="text-2xl font-bold text-slate-800">Students List</h1>
						<p className="text-sm text-slate-500">
							Showing {students.length} registered students (Mock Data).
						</p>
					</div>
					{isAdmin && <Button>Add Students from Excel</Button>}
				</div>

				<div className="rounded-lg border bg-white shadow-sm overflow-hidden">
					{/* Added max-h for testing scrolling behavior */}
					<div className="max-h-[600px] overflow-auto">
						<Table>
							<TableHeader className="bg-slate-50/50 sticky top-0 z-10 shadow-sm">
								<TableRow>
									<TableHead className="font-semibold text-slate-900 bg-slate-50">
										Name
									</TableHead>
									<TableHead className="font-semibold text-slate-900 bg-slate-50">
										Email Address
									</TableHead>
									<TableHead className="font-semibold text-slate-900 bg-slate-50">
										Major
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{students.map((student, index) => (
									<TableRow
										key={index}
										className="hover:bg-slate-50/30 transition-colors">
										<TableCell className="py-3 font-medium text-slate-700">
											{student.name}
										</TableCell>
										<TableCell className="py-3">
											<div className="flex items-center gap-2 text-slate-600 font-mono text-xs">
												<Mail className="h-3.5 w-3.5 opacity-60 text-primary" />
												{student.email}
											</div>
										</TableCell>
										<TableCell className="py-3">
											<Badge
												variant="secondary"
												className={`gap-1.5 border font-medium ${
													student.major_name === "CSE"
														? "bg-indigo-50 text-indigo-700 border-indigo-100"
														: "bg-amber-50 text-amber-700 border-amber-100"
												}`}>
												<BookOpen className="h-3 w-3" />
												{student.major_name}
											</Badge>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</div>
			</div>
		</PageWrapper>
	);
}
