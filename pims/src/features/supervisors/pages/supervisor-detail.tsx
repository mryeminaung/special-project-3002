import api from "@/api/api";
import { PAGE_META } from "@/constants/navigation";
import PageWrapper from "@/components/common/page-wrapper";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { CheckCircleIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeftIcon, User } from "lucide-react";
import { useNavigate, useParams } from "react-router";

type SupervisorDetailResponse = {
	id: number;
	name: string;
	email: string;
	rank?: string | null;
	faculty?: string | null;
	phone?: string | null;
	imageUrl?: string | null;
	activeProjects: { id: number; title: string; students: string }[];
	pastProjects: {
		id: number;
		title: string;
		year?: string | null;
		outcome: string;
	}[];
};

export default function SupervisorDetail() {
	useHeaderInitializer(PAGE_META.supervisorDetail.title, PAGE_META.supervisorDetail.subtitle);
	const navigate = useNavigate();
	const { id } = useParams();

	const fetchSupervisorDetail = async () => {
		const res = await api.get<SupervisorDetailResponse>(
			`/supervisors/${id}/detail`,
		);
		return res.data;
	};

	const { data: supervisor, isLoading } = useQuery({
		queryKey: ["supervisor-detail", id],
		queryFn: fetchSupervisorDetail,
		enabled: Boolean(id),
	});

	if (isLoading || !supervisor) {
		return (
			<PageWrapper>
				<div className="text-sm text-muted-foreground">
					Loading supervisor detail...
				</div>
			</PageWrapper>
		);
	}

	return (
		<PageWrapper>
			<Button
				onClick={() => navigate("/supervisors")}
				variant="ghost"
				className="mb-4 flex bg-primary-600 hover:bg-primary-500 text-white hover:cursor-pointer hover:text-white items-center gap-2">
				<ArrowLeftIcon className="h-4 w-4" />
				Back to Supervisors
			</Button>
			<div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm p-6 mb-8">
				<div className="flex flex-col lg:flex-row items-center gap-6">
					<div className="flex items-center gap-6">
						<div className="h-28 w-28 rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
							{supervisor.imageUrl ? (
								<img
									src={supervisor.imageUrl}
									alt={supervisor.name}
									className="h-full w-full object-cover"
								/>
							) : (
								<User className="h-12 w-12 text-neutral-400" />
							)}
						</div>
						<div>
							<h1 className="text-2xl font-bold">{supervisor.name}</h1>
							<p className="text-sm text-neutral-500">{supervisor.email}</p>
							<p className="text-sm text-muted-foreground">
								{supervisor.rank || "N/A"} • {supervisor.faculty || "N/A"}
							</p>
						</div>
					</div>

					<div className="ml-auto flex items-center gap-3">
						<Button className="bg-primary-600 hover:bg-primary-700 dark:text-white px-4 py-2">
							Assign Project
						</Button>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
				<div className="bg-white dark:bg-neutral-900 rounded-lg p-4 shadow-sm border border-neutral-100 dark:border-neutral-800">
					<div className="text-sm text-neutral-500">Active Supervisions</div>
					<div className="text-2xl font-bold">
						{supervisor.activeProjects.length}
					</div>
				</div>
				<div className="bg-white dark:bg-neutral-900 rounded-lg p-4 shadow-sm border border-neutral-100 dark:border-neutral-800">
					<div className="text-sm text-neutral-500">Past Supervisions</div>
					<div className="text-2xl font-bold">
						{supervisor.pastProjects.length}
					</div>
				</div>
				<div className="bg-white dark:bg-neutral-900 rounded-lg p-4 shadow-sm border border-neutral-100 dark:border-neutral-800">
					<div className="text-sm text-neutral-500">Contact</div>
					<div className="text-sm font-medium">{supervisor.email}</div>
					<div className="text-sm text-muted-foreground">
						{supervisor.phone || "N/A"}
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<div className="lg:col-span-1 space-y-6">
					<Card className="rounded-lg">
						<CardHeader>
							<CardTitle>Active Projects</CardTitle>
							<CardDescription>
								{supervisor.activeProjects.length} ongoing
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-3">
							{supervisor.activeProjects.length === 0 ? (
								<p className="text-sm text-muted-foreground">
									No active projects.
								</p>
							) : (
								supervisor.activeProjects.map((p) => (
									<div
										key={p.id}
										className="p-3 rounded-lg border hover:shadow-sm transition">
										<div className="font-semibold">{p.title}</div>
										<div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
											<UserGroupIcon className="h-4 w-4" />
											<span>{p.students}</span>
										</div>
									</div>
								))
							)}
						</CardContent>
					</Card>
				</div>

				<div className="lg:col-span-2 space-y-6">
					<Card className="rounded-lg">
						<CardHeader>
							<CardTitle>Supervision History</CardTitle>
							<CardDescription>Completed projects and outcomes</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="overflow-x-auto">
								<table className="w-full text-left text-sm">
									<thead className="bg-neutral-50 dark:bg-neutral-800/50 border-b">
										<tr>
											<th className="p-3 font-semibold text-neutral-600">
												Year
											</th>
											<th className="p-3 font-semibold text-neutral-600">
												Project
											</th>
											<th className="p-3 font-semibold text-neutral-600">
												Outcome
											</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
										{supervisor.pastProjects.length === 0 ? (
											<tr>
												<td
													colSpan={3}
													className="p-3 text-sm text-muted-foreground">
													No past supervisions yet.
												</td>
											</tr>
										) : (
											supervisor.pastProjects.map((proj) => (
												<tr
													key={proj.id}
													className="hover:bg-neutral-50/50 transition">
													<td className="p-3 font-bold text-primary-600">
														{proj.year || "-"}
													</td>
													<td className="p-3">{proj.title}</td>
													<td className="p-3 text-sm text-emerald-600 font-semibold flex items-center gap-2">
														<CheckCircleIcon className="h-4 w-4" />
														{proj.outcome}
													</td>
												</tr>
											))
										)}
									</tbody>
								</table>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</PageWrapper>
	);
}
