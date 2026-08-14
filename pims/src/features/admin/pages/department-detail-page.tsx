import { getDepartmentDetail } from "../services/admin.service";
import type { DepartmentDetail } from "../types/admin.types";
import Heading from "@/components/heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import {
	IconArrowLeft,
	IconBuilding,
	IconMail,
	IconPhone,
	IconUsers,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";

function FacultyCardSkeleton() {
	return (
		<div className="rounded-xl border bg-card p-5 animate-pulse">
			<div className="flex items-center gap-4 mb-4">
				<Skeleton className="h-14 w-14 rounded-full shrink-0" />
				<div className="flex-1 space-y-2">
					<Skeleton className="h-4 w-32" />
					<Skeleton className="h-3 w-24" />
				</div>
			</div>
			<Skeleton className="h-3 w-40 mb-2" />
			<Skeleton className="h-3 w-32" />
		</div>
	);
}

export default function DepartmentDetailPage() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	useHeaderInitializer("MIIT | Department Detail", "Department Detail");

	const { data: department, isLoading, error } = useQuery<DepartmentDetail>({
		queryKey: ["admin-department-detail", id],
		queryFn: () => getDepartmentDetail(Number(id)),
		enabled: !!id,
		retry: 1,
	});

	return (
		<>
			<div className="mb-6">
				<Button
					variant="outline"
					size="sm"
					onClick={() => navigate("/admin/departments")}
					className="gap-1.5 bg-primary-600 hover:bg-primary-600/90 text-white border-primary-600 hover:border-primary-600">
					<IconArrowLeft size={15} /> Back to Departments
				</Button>
			</div>

			{isLoading ? (
				<>
					<div className="rounded-xl border bg-card p-6 mb-6 animate-pulse">
						<div className="flex items-center gap-4 mb-4">
							<Skeleton className="h-14 w-14 rounded-xl" />
							<div className="space-y-2">
								<Skeleton className="h-6 w-48" />
								<Skeleton className="h-4 w-24" />
							</div>
						</div>
						<Skeleton className="h-4 w-full mb-2" />
						<Skeleton className="h-4 w-3/4" />
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						{[...Array(6)].map((_, i) => <FacultyCardSkeleton key={i} />)}
					</div>
				</>
			) : error ? (
				<div className="flex flex-col items-center justify-center rounded-xl border bg-card py-20 text-center">
					<IconBuilding size={36} className="text-muted-foreground/40 mb-3" />
					<p className="text-sm font-medium text-muted-foreground">
						Department not found.
					</p>
					<Button
						variant="link"
						onClick={() => navigate("/admin/departments")}
						className="mt-2 text-sm">
						Go back to departments
					</Button>
				</div>
			) : department ? (
				<>
					{/* Department header card */}
					<div className="rounded-xl border bg-card overflow-hidden mb-6">
						<div className="bg-indigo-50 dark:bg-indigo-950/50 px-6 py-5">
							<div className="flex items-center gap-4">
								<div className="flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900 shrink-0">
									<IconBuilding size={26} className="text-indigo-600 dark:text-indigo-300" />
								</div>
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-3">
										<h2 className="text-xl font-bold">{department.name}</h2>
										<Badge variant="outline" className="font-mono text-xs bg-white/60 dark:bg-black/20 border-indigo-200 dark:border-indigo-800">
											{department.code}
										</Badge>
									</div>
								</div>
								{/* Faculty count - prominent */}
								<div className="text-center shrink-0">
									<p className="text-3xl font-bold font-mono tabular-nums text-indigo-600 dark:text-indigo-300">
										{department.faculties_count}
									</p>
									<p className="text-xs text-muted-foreground mt-0.5">
										Faculty
									</p>
								</div>
							</div>
						</div>
						{/* Description - full width below */}
						<div className="px-6 py-4">
							<p className="text-sm text-muted-foreground leading-relaxed">
								{department.description || "No description provided."}
							</p>
						</div>
					</div>

					{/* Faculty members section */}
					<Heading
						title="Faculty Members"
						description={`Members assigned to ${department.name}.`}
					/>

					{department.faculties?.length ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
							{department.faculties.map((faculty) => (
								<div
									key={faculty.id}
									className="rounded-xl border bg-card p-5 hover:shadow-md transition-all duration-200">
									<div className="flex items-center gap-4 mb-4">
										{faculty.user.avatar_url ? (
											<img
												src={faculty.user.avatar_url}
												alt={faculty.user.name}
												className="h-14 w-14 rounded-full object-cover ring-2 ring-background"
											/>
										) : (
											<div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-950 shrink-0">
												<span className="text-lg font-bold text-indigo-600 dark:text-indigo-300">
													{faculty.user.name.charAt(0).toUpperCase()}
												</span>
											</div>
										)}
										<div className="min-w-0">
											<p className="font-semibold text-sm leading-snug truncate">
												{faculty.user.name}
											</p>
											{faculty.rank && (
												<p className="text-xs text-muted-foreground mt-0.5">
													{faculty.rank.name}
												</p>
											)}
										</div>
									</div>

									<div className="space-y-2 text-sm">
										<div className="flex items-center gap-2 text-muted-foreground">
											<IconMail size={13} className="shrink-0" />
											<span className="truncate">{faculty.user.email}</span>
										</div>
										{faculty.phone_number && (
											<div className="flex items-center gap-2 text-muted-foreground">
												<IconPhone size={13} className="shrink-0" />
												<span>{faculty.phone_number}</span>
											</div>
										)}
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="flex flex-col items-center justify-center rounded-xl border bg-card py-16 text-center mt-4">
							<IconUsers size={36} className="text-muted-foreground/40 mb-3" />
							<p className="text-sm font-medium text-muted-foreground">
								No faculty members in this department yet.
							</p>
						</div>
					)}
				</>
			) : null}
		</>
	);
}
