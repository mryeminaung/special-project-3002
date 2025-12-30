import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { IconDownload } from "@tabler/icons-react";
import { Eye, Plus, Search, Settings2, Shield, X } from "lucide-react";
import { useMemo, useState } from "react";

interface Project {
	id: string;
	title: string;
	description: string;
	department: string;
	submittedBy: string;
	supervisor: string;
	students: string[];
	status: "pending" | "approved" | "rejected";
	submittedDate: string;
}

const PROJECTS_DATA: Project[] = [
	{
		id: "1",
		title: "Machine Learning Model for Fraud Detection",
		description:
			"An advanced ML model to detect fraudulent transactions using neural networks and ensemble methods.",
		department: "Engineering",
		submittedBy: "Aung Kyaw",
		supervisor: "Dr. Khin Mar Soe",
		students: ["Aung Kyaw", "May Thu", "Zaw Lin"],
		status: "pending",
		submittedDate: "12/22/2025",
	},
	{
		id: "2",
		title: "Mobile Learning Platform",
		description:
			"Build a cross-platform mobile application for online learning with interactive courses and progress tracking.",
		department: "Science",
		submittedBy: "Kyaw Soe",
		supervisor: "Prof. Thein Zaw",
		students: ["Kyaw Soe", "Nay Myo", "San Win", "Thandi Aye"],
		status: "approved",
		submittedDate: "12/19/2025",
	},
	{
		id: "3",
		title: "Cloud Data Analytics",
		description:
			"Create a cloud-based analytics platform for processing and visualizing large-scale datasets in real-time.",
		department: "Engineering",
		submittedBy: "Myo Kyaw",
		supervisor: "Asst. Prof. May Myint",
		students: ["Myo Kyaw", "Aye Aye", "Tin Soe"],
		status: "rejected",
		submittedDate: "12/17/2025",
	},
	{
		id: "4",
		title: "IoT Smart Home System",
		description:
			"Design and implement an Internet of Things system for home automation with mobile app control and AI scheduling.",
		department: "Engineering",
		submittedBy: "Soe Moe",
		supervisor: "Dr. Nyein Chan",
		students: ["Soe Moe", "Lin Lin", "Tun Myint", "Htin Kyaw"],
		status: "pending",
		submittedDate: "12/23/2025",
	},
	{
		id: "5",
		title: "Blockchain Finance App",
		description:
			"Develop a decentralized finance application using blockchain technology for secure transactions.",
		department: "Business",
		submittedBy: "Ye Htut",
		supervisor: "Prof. Thaung Htut",
		students: ["Ye Htut", "Thu Zar", "Ko Ko", "Pwint Phyu"],
		status: "approved",
		submittedDate: "12/20/2025",
	},
	{
		id: "6",
		title: "Augmented Reality Education",
		description:
			"Create an augmented reality application for interactive and immersive educational experiences in STEM subjects.",
		department: "Science",
		submittedBy: "Naing Myint",
		supervisor: "Asst. Prof. San Kyaw",
		students: ["Naing Myint", "Hla Moe", "Phyo Wai", "Sai Soe"],
		status: "pending",
		submittedDate: "12/21/2025",
	},
	{
		id: "7",
		title: "Cybersecurity Defense System",
		description:
			"Build an advanced threat detection and response system for network security and intrusion prevention.",
		department: "Engineering",
		submittedBy: "Thar Tun",
		supervisor: "Dr. Kyaw Win",
		students: ["Thar Tun", "Yar Zar", "Kaung Myat", "Sai Min"],
		status: "approved",
		submittedDate: "12/18/2025",
	},
	{
		id: "8",
		title: "Environmental Monitoring IoT",
		description:
			"Develop a sensor network system for real-time environmental data collection and analysis using IoT devices.",
		department: "Science",
		submittedBy: "Moe Kyaw",
		supervisor: "Prof. Mon Mon",
		students: ["Moe Kyaw", "Soe Thein", "Tin Oo"],
		status: "rejected",
		submittedDate: "12/16/2025",
	},
	{
		id: "9",
		title: "AI-Powered Recommendation Engine",
		description:
			"Build a machine learning recommendation system for e-commerce platforms with personalization algorithms.",
		department: "Business",
		submittedBy: "Win Win",
		supervisor: "Dr. Sarah Johnson",
		students: ["Win Win", "Mo Mo", "Kyi Kyaw"],
		status: "pending",
		submittedDate: "12/24/2025",
	},
	{
		id: "10",
		title: "Healthcare Management System",
		description:
			"Develop a comprehensive healthcare management system with patient records, appointment scheduling, and billing.",
		department: "Medicine",
		submittedBy: "Su Mya",
		supervisor: "Prof. Michael Chen",
		students: ["Su Mya", "Nay Moe", "Kyaw Min", "Lin Myat"],
		status: "approved",
		submittedDate: "12/15/2025",
	},
	{
		id: "11",
		title: "Virtual Reality Training Simulator",
		description:
			"Create a VR-based training simulator for industrial and medical professionals with realistic scenarios.",
		department: "Engineering",
		submittedBy: "Aung Soe",
		supervisor: "Dr. Emily Rodriguez",
		students: ["Aung Soe", "May Kyi", "Zaw Moe", "Htin Naing"],
		status: "pending",
		submittedDate: "12/25/2025",
	},
	{
		id: "12",
		title: "Natural Language Processing Chatbot",
		description:
			"Develop an advanced NLP-based chatbot for customer support with multi-language support and sentiment analysis.",
		department: "Science",
		submittedBy: "Thu Thu",
		supervisor: "Prof. David Lee",
		students: ["Thu Thu", "Minn Thu", "Nay Lin"],
		status: "approved",
		submittedDate: "12/14/2025",
	},
];

const STATUS_COLORS: Record<string, string> = {
	pending: "bg-yellow-100 text-yellow-800",
	approved: "bg-green-100 text-green-800",
	rejected: "bg-red-100 text-red-800",
};

export function ProposalsList() {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(
		new Set(),
	);
	const [currentPage, setCurrentPage] = useState(1);
	const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
		new Set([
			"title",
			"supervisor",
			"submittedBy",
			"students",
			"status",
			"submittedDate",
		]),
	);
	const [sortColumn, setSortColumn] = useState<string | null>(null);
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
	const itemsPerPage = 6;

	const allStatuses = ["pending", "approved", "rejected"];

	const statusCounts = useMemo(() => {
		const counts: Record<string, number> = {};
		allStatuses.forEach((status) => {
			counts[status] = PROJECTS_DATA.filter((p) => p.status === status).length;
		});
		return counts;
	}, []);

	const filteredProjects = useMemo(() => {
		const filtered = PROJECTS_DATA.filter((project) => {
			const matchesSearch =
				project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
				project.supervisor.toLowerCase().includes(searchTerm.toLowerCase()) ||
				project.students.some((s) =>
					s.toLowerCase().includes(searchTerm.toLowerCase()),
				);

			const matchesStatus =
				selectedStatuses.size === 0
					? true
					: selectedStatuses.has(project.status);

			return matchesSearch && matchesStatus;
		});

		if (sortColumn) {
			filtered.sort((a, b) => {
				let aVal: any = a[sortColumn as keyof Project];
				let bVal: any = b[sortColumn as keyof Project];

				if (typeof aVal === "string") {
					aVal = aVal.toLowerCase();
					bVal = (bVal as string).toLowerCase();
				}

				const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
				return sortDirection === "asc" ? comparison : -comparison;
			});
		}

		return filtered;
	}, [searchTerm, selectedStatuses, sortColumn, sortDirection]);

	const paginatedProjects = useMemo(() => {
		const start = (currentPage - 1) * itemsPerPage;
		return filteredProjects.slice(start, start + itemsPerPage);
	}, [filteredProjects, currentPage]);

	const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

	const handleStatusToggle = (status: string) => {
		const newStatuses = new Set(selectedStatuses);
		if (newStatuses.has(status)) {
			newStatuses.delete(status);
		} else {
			newStatuses.add(status);
		}
		setSelectedStatuses(newStatuses);
		setCurrentPage(1);
	};

	const handleResetStatus = () => {
		setSelectedStatuses(new Set());
		setCurrentPage(1);
	};

	const handleColumnToggle = (column: string) => {
		const newColumns = new Set(visibleColumns);
		if (newColumns.has(column)) {
			newColumns.delete(column);
		} else {
			newColumns.add(column);
		}
		setVisibleColumns(newColumns);
	};

	const handleSort = (column: string) => {
		if (sortColumn === column) {
			setSortDirection(sortDirection === "asc" ? "desc" : "asc");
		} else {
			setSortColumn(column);
			setSortDirection("asc");
		}
	};

	return (
		<div className="space-y-4">
			{/* Search and Filters */}
			<div className="flex flex-col gap-4">
				<div className="flex gap-3">
					<div className="relative flex-1 max-w-sm">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							placeholder="Filter projects..."
							className="pl-10"
							value={searchTerm}
							onChange={(e) => {
								setSearchTerm(e.target.value);
								setCurrentPage(1);
							}}
						/>
					</div>

					{/* Status Filter Button */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								className="gap-2 bg-transparent">
								<Plus className="h-4 w-4" />
								<span>Status</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align="start"
							className="w-56">
							<DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<div className="p-2">
								{allStatuses.map((status) => (
									<div
										key={status}
										onClick={() => handleStatusToggle(status)}
										className="flex items-center gap-2 py-2 cursor-pointer hover:bg-muted rounded px-2">
										<div
											className={`w-3 h-3 rounded-full ${
												status === "pending"
													? "bg-yellow-500"
													: status === "approved"
													? "bg-green-500"
													: "bg-red-500"
											}`}
										/>
										<span className="flex-1 text-sm">{status}</span>
										<span className="text-xs text-muted-foreground">
											{statusCounts[status]}
										</span>
									</div>
								))}
							</div>
						</DropdownMenuContent>
					</DropdownMenu>

					{/* View Toggle Button */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								className="gap-2 bg-transparent">
								<Settings2 className="h-4 w-4" />
								View
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align="end"
							className="w-48">
							<DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuCheckboxItem
								checked={visibleColumns.has("title")}
								onCheckedChange={() => handleColumnToggle("title")}>
								Title
							</DropdownMenuCheckboxItem>
							<DropdownMenuCheckboxItem
								checked={visibleColumns.has("students")}
								onCheckedChange={() => handleColumnToggle("students")}>
								Students
							</DropdownMenuCheckboxItem>
							<DropdownMenuCheckboxItem
								checked={visibleColumns.has("submittedBy")}
								onCheckedChange={() => handleColumnToggle("submittedBy")}>
								Submitted By
							</DropdownMenuCheckboxItem>
							<DropdownMenuCheckboxItem
								checked={visibleColumns.has("supervisor")}
								onCheckedChange={() => handleColumnToggle("supervisor")}>
								Supervisor
							</DropdownMenuCheckboxItem>
							<DropdownMenuCheckboxItem
								checked={visibleColumns.has("status")}
								onCheckedChange={() => handleColumnToggle("status")}>
								Status
							</DropdownMenuCheckboxItem>
							<DropdownMenuCheckboxItem
								checked={visibleColumns.has("submittedDate")}
								onCheckedChange={() => handleColumnToggle("submittedDate")}>
								Submitted Date
							</DropdownMenuCheckboxItem>
						</DropdownMenuContent>
					</DropdownMenu>

					<Button
						className="hover:cursor-pointer bg-cherry-pie-950 hover:bg-cherry-pie-950/80 ml-auto hover:text-white text-white"
						onClick={() => alert("Downloading...")}
						variant={"outline"}>
						<IconDownload />
						<span>Export</span>
					</Button>
				</div>

				{/* Selected Filters Display */}
				<div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border">
					<div className="flex flex-wrap items-center gap-2">
						{selectedStatuses.size > 0 && (
							<span className="text-sm text-muted-foreground">
								{selectedStatuses.size} selected
							</span>
						)}

						{Array.from(selectedStatuses).map((status) => (
							<button
								key={status}
								onClick={() => handleStatusToggle(status)}
								className="bg-cherry-pie-950 px-2 rounded-full text-white hover:underline text-[12px]">
								{status}
							</button>
						))}

						{selectedStatuses.size > 0 && (
							<>
								<Button
									variant="ghost"
									size="sm"
									onClick={handleResetStatus}
									className="h-auto py-0 px-0 text-sm text-muted-foreground hover:text-foreground">
									Reset
								</Button>
								<Button
									variant="ghost"
									size="sm"
									onClick={handleResetStatus}
									className="h-auto py-0 px-0 text-muted-foreground hover:text-foreground">
									<X className="h-4 w-4" />
								</Button>
							</>
						)}
					</div>
				</div>
			</div>

			{/* Table */}
			<div className="rounded-lg border border-border">
				<Table>
					<TableHeader className="bg-muted">
						<TableRow>
							{visibleColumns.has("title") && (
								<TableHead
									className="cursor-pointer select-none hover:bg-muted"
									onClick={() => handleSort("title")}>
									Title{" "}
									{sortColumn === "title" &&
										(sortDirection === "asc" ? "↑ asc" : "↓ desc")}
								</TableHead>
							)}
							{visibleColumns.has("supervisor") && (
								<TableHead>Supervisor</TableHead>
							)}
							{visibleColumns.has("submittedBy") && (
								<TableHead>Submitted By</TableHead>
							)}
							{visibleColumns.has("students") && (
								<TableHead>Students</TableHead>
							)}
							{visibleColumns.has("submittedDate") && (
								<TableHead>Submitted At</TableHead>
							)}
							{visibleColumns.has("status") && <TableHead>Status</TableHead>}
							<TableHead className="w-12">Action</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{paginatedProjects.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={visibleColumns.size + 1}
									className="text-center py-12">
									<div className="flex flex-col items-center gap-3">
										<Search className="h-12 w-12 text-muted-foreground opacity-50" />
										<div>
											<h3 className="font-semibold text-foreground">
												No projects found
											</h3>
											<p className="text-sm text-muted-foreground">
												Try adjusting your search or filters
											</p>
										</div>
									</div>
								</TableCell>
							</TableRow>
						) : (
							paginatedProjects.map((project) => (
								<TableRow key={project.id}>
									{visibleColumns.has("title") && (
										<TableCell>
											<div>
												<div className="font-semibold text-foreground">
													{project.title.length > 30
														? project.title.substring(0, 30) + "..."
														: project.title}
												</div>
												<div className="text-xs text-muted-foreground line-clamp-1">
													{project.description.length > 30
														? project.description.substring(0, 30) + "..."
														: project.description}
												</div>
											</div>
										</TableCell>
									)}
									{visibleColumns.has("supervisor") && (
										<TableCell className="text-sm">
											<div className="flex items-center gap-x-2">
												<Shield className="h-4 w-4 text-muted-foreground" />
												{project.supervisor}
											</div>
										</TableCell>
									)}
									{visibleColumns.has("submittedBy") && (
										<TableCell className="text-sm">
											{project.submittedBy}
										</TableCell>
									)}
									{visibleColumns.has("students") && (
										<TableCell>
											<div className="flex flex-wrap gap-1">
												{project.students.slice(0, 2).map((student) => (
													<Badge
														key={student}
														variant="secondary">
														{student}
													</Badge>
												))}
												{project.students.length > 2 && (
													<Badge variant="secondary">
														+{project.students.length - 2}
													</Badge>
												)}
											</div>
										</TableCell>
									)}

									{visibleColumns.has("submittedDate") && (
										<TableCell className="text-sm">
											{project.submittedDate}
										</TableCell>
									)}

									{visibleColumns.has("status") && (
										<TableCell>
											<Badge className={STATUS_COLORS[project.status]}>
												{project.status}
											</Badge>
										</TableCell>
									)}

									<TableCell className="border">
										<Button className="bg-cherry-pie-950">
											<Eye />
											<span className="text-[12px]">View</span>
										</Button>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			{/* Pagination */}
			{totalPages > 1 && (
				<div className="flex items-center justify-between pt-4">
					<div className="text-sm text-muted-foreground">
						Page {currentPage} of {totalPages}
					</div>
					<div className="flex gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
							disabled={currentPage === 1}>
							Previous
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() =>
								setCurrentPage(Math.min(totalPages, currentPage + 1))
							}
							disabled={currentPage === totalPages}>
							Next
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
