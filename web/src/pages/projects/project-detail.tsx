import api from "@/api/api";
import PageWrapper from "@/components/page-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn, HasRole, PROJECT_STATUS_COLOR } from "@/lib/utils";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { CalendarIcon } from "@heroicons/react/24/solid";
import {
	IconArrowUpRight,
	IconCalendar,
	IconClock,
	IconUsers,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import ProjectActivity from "./components/project-activity";
import ProjectMembers from "./components/project-members";

export default function ProjectDetailPage() {
	const navigate = useNavigate();
	let isIC = HasRole("IC");
	const { slug } = useParams();

	const fetchProjectDetail = async () => {
		const res = await api.get(`/projects/${slug}/detail`);
		return res.data;
	};

	const { data: projectDetail } = useQuery({
		queryKey: ["project-detail"],
		queryFn: fetchProjectDetail,
	});

	console.log(projectDetail);

	return (
		<PageWrapper className="dark:bg-neutral-950">
			<Button
				onClick={() => navigate(-1)}
				variant="ghost"
				className="mb-4 flex bg-primary-600 hover:bg-primary-500 text-white hover:cursor-pointer hover:text-white items-center gap-2">
				<ArrowLeftIcon className="h-4 w-4" />
				Back to Projects
			</Button>

			{/* project info */}
			<Card className="mb-5 shadow-sm">
				<CardContent className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
					<div className="">
						<div className="mt-2 flex justify-between flex-wrap items-center gap-3 text-sm">
							<h1 className="text-2xl font-bold ">{projectDetail?.name}</h1>
						</div>
						<div className="flex items-center mt-1 gap-x-3">
							<Badge
								className={cn(
									PROJECT_STATUS_COLOR("active"),
									"font-mono capitalize px-3 rounded-md",
								)}>
								{projectDetail?.status}
							</Badge>
							<span className="flex items-center gap-1.5">
								<CalendarIcon className="h-4 w-4" />
								Started on {projectDetail?.startedAt}
							</span>
						</div>
						<div className="mt-5 space-y-1">
							<p className="text-lg font-semibold">Project Description</p>
							<p className="text-muted-foreground">
								{projectDetail?.description}
							</p>
						</div>
					</div>
					<div className="dark:bg-primary-700 min-w-62.5 bg-primary-100 rounded-lg p-8 relative overflow-hidden">
						<div className="relative">
							<div className="flex items-center gap-2 mb-6 opacity-80">
								<IconClock size={20} />
								<span className="text-sm font-bold tracking-widest uppercase">
									Project Progress
								</span>
							</div>
							<div className="text-5xl font-black mb-2 tabular-nums">65%</div>
							<div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
								<div
									className="h-full bg-primary-700 dark:bg-white"
									style={{ width: "65%" }}></div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* project summary */}
			{isIC && (
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-5">
					{[
						{
							label: "Supervisor",
							value: "Dr. Aung Aung",
							icon: <IconUsers className="text-primary-500" />,
						},
						{
							label: "Project Members",
							value: "4",
							icon: <IconUsers className="text-purple-500" />,
						},
						{
							label: "Start Date",
							value: "Dec 01, 2025",
							icon: <IconCalendar className="text-orange-500" />,
						},
					].map((stat, i) => (
						<div
							key={i}
							className="group bg-white dark:bg-neutral-900 rounded-lg p-6 border border-neutral-200/60 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow">
							<div className="flex items-start gap-x-3">
								<div className="p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800">
									{stat.icon}
								</div>
								<div className="flex flex-col w-full gap-x-3">
									<div className="flex items-center justify-between">
										<div className="text-[14px] font-bold text-neutral-400 uppercase tracking-widest">
											{stat.label}
										</div>
										<IconArrowUpRight
											className="text-neutral-300 group-hover:text-primary-500 transition-colors"
											size={20}
										/>
									</div>
									<p className="text-xl font-semibold mt-1 text-neutral-900 dark:text-white">
										{stat.value}
									</p>
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			{/* project members */}
			<ProjectMembers members={projectDetail?.members} />

			{/* project activities */}
			<ProjectActivity />
		</PageWrapper>
	);
}
