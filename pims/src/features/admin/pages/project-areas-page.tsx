import { getProjectAreas } from "../services/admin.service";
import type { ProjectArea } from "../types/admin.types";
import ProjectAreaModal from "../components/project-area-modal";
import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import {
	IconBinaryTree,
	IconCode,
	IconCpu,
	IconDatabase,
	IconEdit,
	IconLayoutGrid,
	IconLayoutList,
	IconLayersLinked,
	IconPlus,
	IconSearch,
	IconStack2,
	IconWorld,
	IconX,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

type SortKey = "name-asc" | "name-desc" | "count-desc" | "count-asc";
type ViewMode = "grid" | "list";

function getAreaIcon(name: string) {
	const n = name.toLowerCase();
	if (n.includes("iot") || n.includes("embedded")) return IconCpu;
	if (n.includes("web") || n.includes("frontend") || n.includes("mobile")) return IconWorld;
	if (n.includes("ai") || n.includes("machine") || n.includes("deep")) return IconStack2;
	if (n.includes("data") || n.includes("database") || n.includes("analytics")) return IconDatabase;
	if (n.includes("network") || n.includes("security") || n.includes("cyber")) return IconBinaryTree;
	if (n.includes("system") || n.includes("distributed") || n.includes("cloud")) return IconLayersLinked;
	return IconCode;
}

const PALETTES = [
	{ bg: "bg-violet-100 dark:bg-violet-950", text: "text-violet-600 dark:text-violet-300", accent: "border-violet-200 dark:border-violet-800" },
	{ bg: "bg-blue-100 dark:bg-blue-950", text: "text-blue-600 dark:text-blue-300", accent: "border-blue-200 dark:border-blue-800" },
	{ bg: "bg-emerald-100 dark:bg-emerald-950", text: "text-emerald-600 dark:text-emerald-300", accent: "border-emerald-200 dark:border-emerald-800" },
	{ bg: "bg-orange-100 dark:bg-orange-950", text: "text-orange-600 dark:text-orange-300", accent: "border-orange-200 dark:border-orange-800" },
	{ bg: "bg-pink-100 dark:bg-pink-950", text: "text-pink-600 dark:text-pink-300", accent: "border-pink-200 dark:border-pink-800" },
	{ bg: "bg-amber-100 dark:bg-amber-950", text: "text-amber-600 dark:text-amber-300", accent: "border-amber-200 dark:border-amber-800" },
	{ bg: "bg-cyan-100 dark:bg-cyan-950", text: "text-cyan-600 dark:text-cyan-300", accent: "border-cyan-200 dark:border-cyan-800" },
	{ bg: "bg-rose-100 dark:bg-rose-950", text: "text-rose-600 dark:text-rose-300", accent: "border-rose-200 dark:border-rose-800" },
] as const;

function AreaCardSkeleton({ view }: { view: ViewMode }) {
	if (view === "list") {
		return (
			<div className="flex items-center gap-4 rounded-xl border bg-card px-5 py-4 animate-pulse">
				<Skeleton className="h-10 w-10 rounded-xl shrink-0" />
				<div className="flex-1 space-y-1.5">
					<Skeleton className="h-4 w-40" />
					<Skeleton className="h-3 w-64" />
				</div>
				<Skeleton className="h-6 w-10 rounded-md shrink-0" />
				<Skeleton className="h-7 w-14 rounded-md shrink-0" />
			</div>
		);
	}
	return (
		<div className="rounded-xl border bg-card p-5 animate-pulse">
			<div className="flex items-start justify-between mb-4">
				<Skeleton className="h-11 w-11 rounded-xl" />
				<Skeleton className="h-7 w-12 rounded-md" />
			</div>
			<Skeleton className="h-5 w-36 mb-2" />
			<Skeleton className="h-3.5 w-full mb-1.5" />
			<Skeleton className="h-3.5 w-4/5 mb-4" />
			<div className="flex items-center justify-between pt-3 border-t">
				<Skeleton className="h-3.5 w-24" />
				<Skeleton className="h-6 w-8" />
			</div>
		</div>
	);
}

export default function ProjectAreasPage() {
	useHeaderInitializer("MIIT | Project Areas", "Project Areas");

	const [search, setSearch] = useState("");
	const [sort, setSort] = useState<SortKey>("name-asc");
	const [view, setView] = useState<ViewMode>("grid");
	const [modalOpen, setModalOpen] = useState(false);
	const [editingArea, setEditingArea] = useState<ProjectArea | null>(null);

	const { data: areas, isLoading } = useQuery<ProjectArea[]>({
		queryKey: ["admin-project-areas"],
		queryFn: getProjectAreas,
		retry: 1,
	});

	const filtered = useMemo(() => {
		if (!areas?.length) return [];
		const q = search.toLowerCase();
		let result = q
			? areas.filter(
					(a) =>
						a.name.toLowerCase().includes(q) ||
						(a.description ?? "").toLowerCase().includes(q),
				)
			: [...areas];

		switch (sort) {
			case "name-asc":  result.sort((a, b) => a.name.localeCompare(b.name)); break;
			case "name-desc": result.sort((a, b) => b.name.localeCompare(a.name)); break;
			case "count-desc": result.sort((a, b) => (b.projects_count ?? 0) - (a.projects_count ?? 0)); break;
			case "count-asc":  result.sort((a, b) => (a.projects_count ?? 0) - (b.projects_count ?? 0)); break;
		}

		return result;
	}, [areas, search, sort]);

	const totalProjects = useMemo(
		() => (areas ?? []).reduce((sum, a) => sum + (a.projects_count ?? 0), 0),
		[areas],
	);

	function openCreate() {
		setEditingArea(null);
		setModalOpen(true);
	}

	function openEdit(area: ProjectArea) {
		setEditingArea(area);
		setModalOpen(true);
	}

	return (
		<>
			<div className="flex items-start justify-between mb-6">
				<Heading
					title="Project Areas"
					description="Categorize student proposals by technical domain."
				/>
				<Button
					onClick={openCreate}
					className="gap-2 bg-primary-600 hover:bg-primary-600/90 text-white shrink-0 mt-1">
					<IconPlus size={16} /> New Area
				</Button>
			</div>

			<div className="grid grid-cols-2 gap-4 mb-6">
				<div className="rounded-xl border bg-card px-5 py-4">
					<p className="text-sm text-muted-foreground">Total Areas</p>
					{isLoading ? (
						<Skeleton className="h-8 w-12 mt-1" />
					) : (
						<p className="text-3xl font-bold font-mono tabular-nums mt-0.5">
							{areas?.length ?? 0}
						</p>
					)}
				</div>
				<div className="rounded-xl border bg-card px-5 py-4">
					<p className="text-sm text-muted-foreground">Total Projects</p>
					{isLoading ? (
						<Skeleton className="h-8 w-12 mt-1" />
					) : (
						<p className="text-3xl font-bold font-mono tabular-nums mt-0.5">
							{totalProjects}
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
						placeholder="Search areas…"
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

				<Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
					<SelectTrigger className="w-44 shrink-0 bg-transparent">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="name-asc">Name A → Z</SelectItem>
						<SelectItem value="name-desc">Name Z → A</SelectItem>
						<SelectItem value="count-desc">Most Projects</SelectItem>
						<SelectItem value="count-asc">Fewest Projects</SelectItem>
					</SelectContent>
				</Select>

				{/* View toggle */}
				<div className="flex shrink-0 rounded-md border border-border overflow-hidden">
					<button
						type="button"
						onClick={() => setView("grid")}
						className={`flex items-center justify-center px-2.5 transition-colors ${
							view === "grid"
								? "bg-primary-600 text-white"
								: "bg-transparent text-muted-foreground hover:bg-muted"
						}`}>
						<IconLayoutGrid size={16} />
					</button>
					<button
						type="button"
						onClick={() => setView("list")}
						className={`flex items-center justify-center px-2.5 border-l border-border transition-colors ${
							view === "list"
								? "bg-primary-600 text-white"
								: "bg-transparent text-muted-foreground hover:bg-muted"
						}`}>
						<IconLayoutList size={16} />
					</button>
				</div>
			</div>

			{isLoading ? (
				view === "grid" ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						{[...Array(6)].map((_, i) => <AreaCardSkeleton key={i} view="grid" />)}
					</div>
				) : (
					<div className="space-y-2">
						{[...Array(6)].map((_, i) => <AreaCardSkeleton key={i} view="list" />)}
					</div>
				)
			) : !filtered.length ? (
				<div className="flex flex-col items-center justify-center rounded-xl border bg-card py-20 text-center">
					<IconCode size={36} className="text-muted-foreground/40 mb-3" />
					<p className="text-sm font-medium text-muted-foreground">
						{search ? "No areas match your search." : "No project areas configured yet."}
					</p>
					{search && (
						<button
							type="button"
							onClick={() => setSearch("")}
							className="mt-2 text-xs text-primary-600 hover:underline">
							Clear search
						</button>
					)}
				</div>
			) : view === "grid" ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{filtered.map((area, i) => {
						const palette = PALETTES[i % PALETTES.length];
						const Icon = getAreaIcon(area.name);
						return (
							<div
								key={area.id}
								className="group relative rounded-xl border bg-card p-5 hover:shadow-md transition-all duration-200">
								<div className="flex items-start justify-between mb-4">
									<div className={`flex h-11 w-11 items-center justify-center rounded-xl ${palette.bg}`}>
										<Icon size={22} className={palette.text} />
									</div>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => openEdit(area)}
										className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 h-7 gap-1 text-xs text-muted-foreground">
										<IconEdit size={13} /> Edit
									</Button>
								</div>
								<h3 className="font-semibold text-base leading-snug mb-1.5">{area.name}</h3>
								<p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem] mb-4">
									{area.description || "No description provided."}
								</p>
								<div className={`flex items-center justify-between pt-3 border-t ${palette.accent}`}>
									<span className="text-xs text-muted-foreground">Active Projects</span>
									<span className={`text-xl font-bold font-mono tabular-nums ${palette.text}`}>
										{area.projects_count ?? 0}
									</span>
								</div>
							</div>
						);
					})}
				</div>
			) : (
				<div className="space-y-2">
					{filtered.map((area, i) => {
						const palette = PALETTES[i % PALETTES.length];
						const Icon = getAreaIcon(area.name);
						return (
							<div
								key={area.id}
								className="group flex items-center gap-4 rounded-xl border bg-card px-5 py-4 hover:shadow-sm transition-all duration-200">
								<div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${palette.bg}`}>
									<Icon size={18} className={palette.text} />
								</div>
								<div className="flex-1 min-w-0">
									<p className="font-semibold text-sm leading-snug">{area.name}</p>
									<p className="text-xs text-muted-foreground truncate mt-0.5">
										{area.description || "No description provided."}
									</p>
								</div>
								<span className={`shrink-0 text-lg font-bold font-mono tabular-nums ${palette.text}`}>
									{area.projects_count ?? 0}
								</span>
								<span className="shrink-0 text-xs text-muted-foreground hidden sm:block">projects</span>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => openEdit(area)}
									className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 h-7 gap-1 text-xs text-muted-foreground shrink-0">
									<IconEdit size={13} /> Edit
								</Button>
							</div>
						);
					})}
				</div>
			)}

			<ProjectAreaModal
				open={modalOpen}
				onClose={() => setModalOpen(false)}
				area={editingArea}
			/>
		</>
	);
}
