import { Badge } from "@/components/ui/badge";
import { ROLE_COLORS, ROLE_LABELS } from "@/constants/badge-colors";
import { PAGE_META } from "@/constants/navigation";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { useQuery } from "@tanstack/react-query";
import {
	ArrowLeftIcon,
	BriefcaseIcon,
	BuildingIcon,
	CheckCircle2Icon,
	ClockIcon,
	MailIcon,
	PhoneIcon,
	UserIcon,
	UsersIcon,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { getFacultyDetail } from "../services/faculty.service";
import { getInitials } from "@/lib/utils";

function StatCard({
	label,
	value,
	icon: Icon,
}: {
	label: string;
	value: string | number;
	icon: React.ElementType;
}) {
	return (
		<div className="rounded-xl border bg-card p-4 flex items-center gap-4">
			<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/20">
				<Icon className="h-5 w-5 text-primary-600" />
			</div>
			<div>
				<p className="text-2xl font-bold leading-none">{value}</p>
				<p className="mt-1 text-xs text-muted-foreground">{label}</p>
			</div>
		</div>
	);
}

export default function FacultyDetailPage() {
	useHeaderInitializer(PAGE_META.facultyDetail.title, PAGE_META.facultyDetail.subtitle);
	const navigate = useNavigate();
	const { id } = useParams();

	const { data: faculty, isLoading } = useQuery({
		queryKey: ["faculty-detail", id],
		queryFn: () => getFacultyDetail(id!),
		enabled: Boolean(id),
	});

	if (isLoading) {
		return (
			<div className="space-y-6 animate-pulse">
				<div className="h-8 w-32 rounded-md bg-muted" />
				<div className="h-36 rounded-xl bg-muted" />
				<div className="grid grid-cols-3 gap-4">
					{[...Array(3)].map((_, i) => <div key={i} className="h-20 rounded-xl bg-muted" />)}
				</div>
			</div>
		);
	}

	if (!faculty) return null;

	return (
		<div className="space-y-6">
			{/* Back */}
			<button
				onClick={() => navigate("/faculties")}
				className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
			>
				<ArrowLeftIcon className="h-4 w-4" />
				Back to Faculties
			</button>

			{/* Profile header */}
			<div className="rounded-xl border bg-card p-6">
				<div className="flex flex-col sm:flex-row gap-5 items-start">
					{/* Avatar */}
					<div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-2xl font-bold">
						{faculty.imageUrl ? (
							<img
								src={faculty.imageUrl}
								alt={faculty.name}
								className="h-full w-full rounded-2xl object-cover"
							/>
						) : (
							getInitials(faculty.name)
						)}
					</div>

					{/* Info */}
					<div className="flex-1 min-w-0">
						<div className="flex flex-wrap items-center gap-2 mb-1">
							<h1 className="text-xl font-bold">{faculty.name}</h1>
							{faculty.roles?.map((role) => (
								<Badge
									key={role}
									variant="outline"
									className={`text-[11px] ${ROLE_COLORS[role] ?? "bg-muted text-muted-foreground"}`}
								>
									{ROLE_LABELS[role] ?? role}
								</Badge>
							))}
						</div>

						<div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
							{faculty.rank && (
								<span className="flex items-center gap-1.5">
									<BriefcaseIcon className="h-3.5 w-3.5 shrink-0" />
									{faculty.rank}
								</span>
							)}
							{faculty.department && (
								<span className="flex items-center gap-1.5">
									<BuildingIcon className="h-3.5 w-3.5 shrink-0" />
									{faculty.department}
								</span>
							)}
							<span className="flex items-center gap-1.5">
								<MailIcon className="h-3.5 w-3.5 shrink-0" />
								{faculty.email}
							</span>
							{faculty.phone && (
								<span className="flex items-center gap-1.5">
									<PhoneIcon className="h-3.5 w-3.5 shrink-0" />
									{faculty.phone}
								</span>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
				<StatCard
					label="Active Supervisions"
					value={faculty.activeProjects.length}
					icon={ClockIcon}
				/>
				<StatCard
					label="Completed Supervisions"
					value={faculty.pastProjects.length}
					icon={CheckCircle2Icon}
				/>
				<StatCard
					label="Total Supervised"
					value={faculty.activeProjects.length + faculty.pastProjects.length}
					icon={UserIcon}
				/>
			</div>

			{/* Main content */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Active projects */}
				<div className="lg:col-span-1 space-y-3">
					<h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
						<ClockIcon className="h-4 w-4" />
						Active Projects
					</h2>
					{faculty.activeProjects.length === 0 ? (
						<div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-10 text-center">
							<BriefcaseIcon className="mb-2 h-7 w-7 text-muted-foreground/30" />
							<p className="text-sm text-muted-foreground">No active projects.</p>
						</div>
					) : (
						faculty.activeProjects.map((p) => (
							<div
								key={p.id}
								className="rounded-xl border bg-card p-4 hover:shadow-sm transition-shadow"
							>
								<p className="font-medium text-sm leading-snug">{p.title}</p>
								<p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
									<UsersIcon className="h-3.5 w-3.5 shrink-0" />
									{p.students}
								</p>
							</div>
						))
					)}
				</div>

				{/* Supervision history */}
				<div className="lg:col-span-2">
					<h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2 mb-3">
						<CheckCircle2Icon className="h-4 w-4" />
						Supervision History
					</h2>
					<div className="rounded-xl border overflow-hidden">
						<table className="w-full text-sm">
							<thead>
								<tr className="bg-muted text-left">
									<th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide w-20">Year</th>
									<th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Project</th>
									<th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Outcome</th>
								</tr>
							</thead>
							<tbody className="divide-y">
								{faculty.pastProjects.length === 0 ? (
									<tr>
										<td colSpan={3} className="px-4 py-10 text-center text-sm text-muted-foreground">
											No supervision history yet.
										</td>
									</tr>
								) : (
									faculty.pastProjects.map((proj) => (
										<tr key={proj.id} className="hover:bg-muted/40 transition-colors">
											<td className="px-4 py-3 font-mono text-xs font-semibold text-primary-600">
												{proj.year ?? "—"}
											</td>
											<td className="px-4 py-3 font-medium">{proj.title}</td>
											<td className="px-4 py-3">
												<span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
													<CheckCircle2Icon className="h-3.5 w-3.5" />
													{proj.outcome}
												</span>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}
