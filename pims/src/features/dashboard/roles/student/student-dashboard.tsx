import { PAGE_META, HEADINGS } from "@/constants/navigation";
import Heading from "@/components/heading";
import { Skeleton } from "@/components/ui/skeleton";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { useAuthStore } from "@/stores/use-auth-store";
import { useQuery } from "@tanstack/react-query";
import { getStudentDashboardData } from "./services/student-dashboard.service";
import { StudentCards } from "./components/student-card";
import ProjectProgress from "./components/project-progress";
import SupervisorInfo from "./components/supervisor-info";

// ── Skeletons ──────────────────────────────────────────────────────────────

function CardsSkeleton() {
	return (
		<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
			{[...Array(4)].map((_, i) => (
				<div key={i} className="rounded-xl border bg-card p-5 animate-pulse">
					<div className="flex items-start justify-between mb-4">
						<Skeleton className="h-10 w-10 rounded-lg" />
						<Skeleton className="h-4 w-10" />
					</div>
					<Skeleton className="h-7 w-12 mb-1.5" />
					<Skeleton className="h-3.5 w-24" />
				</div>
			))}
		</div>
	);
}

function ProjectProgressSkeleton() {
	return (
		<div className="rounded-xl border bg-card animate-pulse">
			<div className="px-5 py-4 border-b">
				<Skeleton className="h-4 w-36" />
			</div>
			<div className="divide-y">
				{[...Array(3)].map((_, i) => (
					<div key={i} className="flex items-center gap-4 px-5 py-4">
						<div className="flex-1 space-y-1.5">
							<Skeleton className="h-3.5 w-48" />
							<Skeleton className="h-3 w-32" />
						</div>
						{[...Array(4)].map((__, j) => (
							<Skeleton key={j} className="h-6 w-6 rounded-full" />
						))}
					</div>
				))}
			</div>
		</div>
	);
}

function SupervisorSkeleton() {
	return (
		<div className="rounded-xl border bg-card p-5 animate-pulse">
			<Skeleton className="h-4 w-28 mb-4" />
			<div className="flex items-center gap-4 mb-4">
				<Skeleton className="h-12 w-12 rounded-full shrink-0" />
				<div className="space-y-1.5">
					<Skeleton className="h-4 w-32" />
					<Skeleton className="h-3 w-24" />
				</div>
			</div>
			<div className="space-y-2.5">
				<Skeleton className="h-3.5 w-full" />
				<Skeleton className="h-3.5 w-3/4" />
				<Skeleton className="h-3.5 w-2/3" />
			</div>
		</div>
	);
}

// ── Dashboard ──────────────────────────────────────────────────────────────

export default function StudentDashboard() {
	useHeaderInitializer(PAGE_META.studentDashboard.title, PAGE_META.studentDashboard.subtitle);
	const authUser = useAuthStore((state) => state.authUser);

	const { data, isLoading } = useQuery({
		queryKey: ["studentDashboardData"],
		queryFn: getStudentDashboardData,
		retry: 1,
	});

	const firstName = authUser?.name?.split(" ").slice(0, 2).join(" ") ?? "Student";

	return (
		<div className="space-y-6">
			{/* Welcome */}
			<Heading
				title={`Welcome back, ${firstName}!`}
				description="Track your projects, proposals, and keep up with deadlines."
			/>

			{/* Stat cards */}
			{isLoading ? (
				<CardsSkeleton />
			) : (
				data?.stats && <StudentCards stats={data.stats} />
			)}

			{/* Project progress (left 2/3) + Supervisor (right 1/3) */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				<div className="lg:col-span-2">
					{isLoading ? (
						<ProjectProgressSkeleton />
					) : (
						<ProjectProgress projects={data?.projectProgress} />
					)}
				</div>
				<div>
					{isLoading ? (
						<SupervisorSkeleton />
					) : (
						<SupervisorInfo supervisor={data?.supervisor} />
					)}
				</div>
			</div>
		</div>
	);
}
