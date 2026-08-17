import {
	deleteAcademicYear,
	getAcademicYears,
	setActiveAcademicYear,
} from "../services/admin.service";
import type { AcademicYear } from "../types/admin.types";
import AcademicYearModal from "../components/academic-year-modal";
import Heading from "@/components/heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/date";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import {
	IconCalendar,
	IconCalendarStats,
	IconCheck,
	IconEdit,
	IconLayoutGrid,
	IconLayoutList,
	IconPlus,
	IconSearch,
	IconTrash,
	IconX,
} from "@tabler/icons-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type ViewMode = "grid" | "list";

function ListSkeleton() {
	return (
		<div className="flex items-center gap-4 rounded-xl border bg-card px-5 py-4 animate-pulse">
			<Skeleton className="h-10 w-10 rounded-xl shrink-0" />
			<div className="flex-1 space-y-2">
				<Skeleton className="h-4 w-44" />
				<Skeleton className="h-3 w-64" />
			</div>
			<Skeleton className="h-5 w-14 rounded-full shrink-0" />
		</div>
	);
}

function GridSkeleton() {
	return (
		<div className="rounded-xl border bg-card p-5 animate-pulse">
			<div className="flex items-start justify-between mb-4">
				<Skeleton className="h-11 w-11 rounded-xl" />
				<Skeleton className="h-5 w-14 rounded-full" />
			</div>
			<Skeleton className="h-5 w-40 mb-2" />
			<Skeleton className="h-3.5 w-full mb-1" />
			<Skeleton className="h-3.5 w-3/4 mb-4" />
			<div className="flex items-center justify-between pt-3 border-t">
				<Skeleton className="h-3 w-24" />
				<Skeleton className="h-3 w-20" />
			</div>
		</div>
	);
}

export default function AcademicYearsPage() {
	useHeaderInitializer("MIIT | Academic Years", "Academic Years");
	const queryClient = useQueryClient();

	const [modalOpen, setModalOpen] = useState(false);
	const [editing, setEditing] = useState<AcademicYear | null>(null);
	const [search, setSearch] = useState("");
	const [view, setView] = useState<ViewMode>("list");

	const { data: years, isLoading } = useQuery<AcademicYear[]>({
		queryKey: ["admin-academic-years"],
		queryFn: getAcademicYears,
	});

	const filtered = useMemo(() => {
		if (!years?.length) return [];
		if (!search.trim()) return years;
		const q = search.toLowerCase();
		return years.filter(
			(y) =>
				y.label.toLowerCase().includes(q) ||
				y.year.toLowerCase().includes(q),
		);
	}, [years, search]);

	function handleCreate() {
		setEditing(null);
		setModalOpen(true);
	}

	function handleEdit(year: AcademicYear, e: React.MouseEvent) {
		e.stopPropagation();
		setEditing(year);
		setModalOpen(true);
	}

	async function handleSetActive(year: AcademicYear, e: React.MouseEvent) {
		e.stopPropagation();
		if (year.isActive) return;
		try {
			await setActiveAcademicYear(year.id);
			toast.success(`${year.label} is now the active academic year.`);
			await queryClient.invalidateQueries({ queryKey: ["admin-academic-years"] });
		} catch (err: any) {
			toast.error(err?.response?.data?.message ?? "Failed to set active year.");
		}
	}

	async function handleDelete(year: AcademicYear, e: React.MouseEvent) {
		e.stopPropagation();
		if (
			!window.confirm(
				`Delete "${year.label}"? This cannot be undone and will unlink all associated proposals and projects.`,
			)
		)
			return;
		try {
			await deleteAcademicYear(year.id);
			toast.success("Academic year deleted.");
			await queryClient.invalidateQueries({ queryKey: ["admin-academic-years"] });
		} catch (err: any) {
			toast.error(err?.response?.data?.message ?? "Failed to delete.");
		}
	}

	const activeYear = years?.find((y) => y.isActive);

	return (
		<>
			<div className="flex items-start justify-between mb-6">
				<Heading
					title="Academic Years"
					description="Manage academic year semesters. The active year is stamped on all new proposals."
				/>
				<Button
					onClick={handleCreate}
					className="gap-2 bg-primary-600 hover:bg-primary-600/90 text-white shrink-0 mt-1">
					<IconPlus size={16} /> New Year
				</Button>
			</div>

			{/* Active year banner */}
			{activeYear && (
				<div className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40 px-5 py-3.5">
					<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900">
						<IconCalendarStats size={16} className="text-emerald-600 dark:text-emerald-400" />
					</div>
					<div>
						<p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
							{activeYear.label}
						</p>
						<p className="text-xs text-emerald-600 dark:text-emerald-500 mt-0.5">
							{formatDate(activeYear.startDate)} — {formatDate(activeYear.endDate)}
						</p>
					</div>
					<Badge className="ml-auto bg-emerald-600 text-white text-xs">Active</Badge>
				</div>
			)}

			{/* Summary chips */}
			<div className="grid grid-cols-2 gap-4 mb-6">
				<div className="rounded-xl border bg-card px-5 py-4">
					<p className="text-sm text-muted-foreground">Total Years</p>
					{isLoading ? (
						<Skeleton className="h-8 w-10 mt-1" />
					) : (
						<p className="text-3xl font-bold font-mono tabular-nums mt-0.5">
							{years?.length ?? 0}
						</p>
					)}
				</div>
				<div className="rounded-xl border bg-card px-5 py-4">
					<p className="text-sm text-muted-foreground">Active Semester</p>
					{isLoading ? (
						<Skeleton className="h-8 w-32 mt-1" />
					) : (
						<p className="text-3xl font-bold font-mono tabular-nums mt-0.5 truncate">
							{activeYear?.label ?? "—"}
						</p>
					)}
				</div>
			</div>

			{/* Filter row */}
			<div className="mb-5 flex gap-3">
				<div className="relative flex-1">
					<IconSearch
						size={15}
						className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
					/>
					<Input
						placeholder="Search by year or label…"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="pl-9 pr-8"
					/>
					{search && (
						<button
							type="button"
							onClick={() => setSearch("")}
							className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
							<IconX size={14} />
						</button>
					)}
				</div>

				{/* View toggle */}
				<div className="flex shrink-0 rounded-md border border-border overflow-hidden">
					<button
						type="button"
						onClick={() => setView("list")}
						className={cn(
							"flex items-center justify-center px-2.5 transition-colors",
							view === "list"
								? "bg-primary-600 text-white"
								: "bg-transparent text-muted-foreground hover:bg-muted",
						)}>
						<IconLayoutList size={16} />
					</button>
					<button
						type="button"
						onClick={() => setView("grid")}
						className={cn(
							"flex items-center justify-center px-2.5 border-l border-border transition-colors",
							view === "grid"
								? "bg-primary-600 text-white"
								: "bg-transparent text-muted-foreground hover:bg-muted",
						)}>
						<IconLayoutGrid size={16} />
					</button>
				</div>
			</div>

			{/* Content */}
			{isLoading ? (
				view === "list" ? (
					<div className="space-y-3">
						{[...Array(4)].map((_, i) => <ListSkeleton key={i} />)}
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						{[...Array(6)].map((_, i) => <GridSkeleton key={i} />)}
					</div>
				)
			) : !filtered.length ? (
				<div className="flex flex-col items-center justify-center rounded-xl border bg-card py-20 text-center">
					<IconCalendar size={36} className="text-muted-foreground/40 mb-3" />
					<p className="text-sm font-medium text-muted-foreground">
						{search
							? "No academic years match your search."
							: "No academic years configured yet."}
					</p>
					{search ? (
						<button
							type="button"
							onClick={() => setSearch("")}
							className="mt-2 text-xs text-primary-600 hover:underline">
							Clear search
						</button>
					) : (
						<Button variant="link" onClick={handleCreate} className="mt-2 text-primary-600">
							Create the first one
						</Button>
					)}
				</div>
			) : view === "list" ? (
				<div className="space-y-3">
					{filtered.map((year) => (
						<div
							key={year.id}
							className="group flex items-center gap-4 rounded-xl border bg-card px-5 py-4 transition-shadow duration-200 hover:shadow-sm">
							<div
								className={cn(
									"flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
									year.isActive ? "bg-emerald-100 dark:bg-emerald-900" : "bg-muted",
								)}>
								<IconCalendarStats
									size={18}
									className={
										year.isActive
											? "text-emerald-600 dark:text-emerald-400"
											: "text-muted-foreground"
									}
								/>
							</div>

							<div className="flex-1 min-w-0">
								<div className="flex items-center gap-2 flex-wrap">
									<p className="font-semibold text-sm">{year.label}</p>
									{year.isActive && (
										<Badge className="bg-emerald-600 text-white text-xs h-5">Active</Badge>
									)}
								</div>
								<div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
									<span className="flex items-center gap-1">
										<IconCalendar size={11} />
										{formatDate(year.startDate)} — {formatDate(year.endDate)}
									</span>
									{year.proposalsCount !== undefined && (
										<span>{year.proposalsCount} proposal{year.proposalsCount !== 1 ? "s" : ""}</span>
									)}
									{year.projectsCount !== undefined && (
										<span>{year.projectsCount} project{year.projectsCount !== 1 ? "s" : ""}</span>
									)}
								</div>
							</div>

							<div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 shrink-0">
								{!year.isActive && (
									<Button
										variant="ghost"
										size="sm"
										onClick={(e) => handleSetActive(year, e)}
										className="h-7 gap-1 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950">
										<IconCheck size={13} /> Set Active
									</Button>
								)}
								<Button
									variant="ghost"
									size="sm"
									onClick={(e) => handleEdit(year, e)}
									className="h-7 gap-1 text-xs text-muted-foreground">
									<IconEdit size={13} /> Edit
								</Button>
								<Button
									variant="ghost"
									size="sm"
									onClick={(e) => handleDelete(year, e)}
									className="h-7 gap-1 text-xs text-destructive hover:text-destructive">
									<IconTrash size={13} />
								</Button>
							</div>
						</div>
					))}
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{filtered.map((year) => (
						<div
							key={year.id}
							className={cn(
								"group relative rounded-xl border bg-card p-5 transition-all duration-200 hover:shadow-md",
								year.isActive && "border-emerald-300 dark:border-emerald-700",
							)}>
							{/* Top row */}
							<div className="flex items-start justify-between mb-4">
								<div
									className={cn(
										"flex h-11 w-11 items-center justify-center rounded-xl",
										year.isActive ? "bg-emerald-100 dark:bg-emerald-900" : "bg-muted",
									)}>
									<IconCalendarStats
										size={22}
										className={
											year.isActive
												? "text-emerald-600 dark:text-emerald-400"
												: "text-muted-foreground"
										}
									/>
								</div>
								{year.isActive ? (
									<Badge className="bg-emerald-600 text-white text-xs">Active</Badge>
								) : (
									<div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
										<Button
											variant="ghost"
											size="sm"
											onClick={(e) => handleSetActive(year, e)}
											className="h-7 gap-1 text-xs text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950">
											<IconCheck size={13} /> Set Active
										</Button>
									</div>
								)}
							</div>

							{/* Label */}
							<h3 className="font-semibold text-base leading-snug mb-1">{year.label}</h3>

							{/* Dates */}
							<p className="text-xs text-muted-foreground flex items-center gap-1 mb-4">
								<IconCalendar size={11} />
								{formatDate(year.startDate)} — {formatDate(year.endDate)}
							</p>

							{/* Footer */}
							<div className="flex items-center justify-between pt-3 border-t border-border">
								<div className="text-xs text-muted-foreground space-x-2">
									{year.proposalsCount !== undefined && (
										<span>{year.proposalsCount} proposal{year.proposalsCount !== 1 ? "s" : ""}</span>
									)}
									{year.projectsCount !== undefined && (
										<span>{year.projectsCount} project{year.projectsCount !== 1 ? "s" : ""}</span>
									)}
								</div>
								<div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
									<Button
										variant="ghost"
										size="sm"
										onClick={(e) => handleEdit(year, e)}
										className="h-7 gap-1 text-xs text-muted-foreground">
										<IconEdit size={13} /> Edit
									</Button>
									<Button
										variant="ghost"
										size="sm"
										onClick={(e) => handleDelete(year, e)}
										className="h-7 gap-1 text-xs text-destructive hover:text-destructive">
										<IconTrash size={13} />
									</Button>
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			<AcademicYearModal
				open={modalOpen}
				onClose={() => setModalOpen(false)}
				academicYear={editing}
			/>
		</>
	);
}
