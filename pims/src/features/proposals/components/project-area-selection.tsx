import { getProposalProjectAreas } from "../services/proposal.service";
import ErrorMessage from "@/components/error-message";
import { Input } from "@/components/ui/input";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Controller } from "react-hook-form";
import {
	IconBinaryTree,
	IconCheck,
	IconChevronDown,
	IconCode,
	IconCpu,
	IconDatabase,
	IconLayersLinked,
	IconSearch,
	IconSparkles,
	IconStack2,
	IconWorld,
} from "@tabler/icons-react";

interface Props {
	control: any;
	error?: string;
}

type ProjectArea = {
	id: number;
	name: string;
	description?: string | null;
};

// Keyword-based icon + color — same palette as admin project-areas page
const PALETTES = [
	{ bg: "bg-violet-100 dark:bg-violet-950", text: "text-violet-600 dark:text-violet-300" },
	{ bg: "bg-blue-100 dark:bg-blue-950", text: "text-blue-600 dark:text-blue-300" },
	{ bg: "bg-emerald-100 dark:bg-emerald-950", text: "text-emerald-600 dark:text-emerald-300" },
	{ bg: "bg-orange-100 dark:bg-orange-950", text: "text-orange-600 dark:text-orange-300" },
	{ bg: "bg-pink-100 dark:bg-pink-950", text: "text-pink-600 dark:text-pink-300" },
	{ bg: "bg-amber-100 dark:bg-amber-950", text: "text-amber-600 dark:text-amber-300" },
	{ bg: "bg-cyan-100 dark:bg-cyan-950", text: "text-cyan-600 dark:text-cyan-300" },
	{ bg: "bg-rose-100 dark:bg-rose-950", text: "text-rose-600 dark:text-rose-300" },
] as const;

function getAreaIcon(name: string) {
	const n = name.toLowerCase();
	if (n.includes("iot") || n.includes("embedded")) return IconCpu;
	if (n.includes("web") || n.includes("frontend") || n.includes("mobile")) return IconWorld;
	if (n.includes("ai") || n.includes("machine") || n.includes("deep")) return IconStack2;
	if (n.includes("data") || n.includes("database") || n.includes("analytics")) return IconDatabase;
	if (n.includes("network") || n.includes("security") || n.includes("cyber")) return IconBinaryTree;
	if (n.includes("system") || n.includes("distributed") || n.includes("cloud")) return IconLayersLinked;
	if (n.includes("software") || n.includes("engineering")) return IconSparkles;
	return IconCode;
}

export function ProjectAreaSelection({ control, error }: Props) {
	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState("");

	const { data: projectAreas, isLoading } = useQuery({
		queryKey: ["project-areas"],
		queryFn: getProposalProjectAreas,
	});

	const areas: ProjectArea[] = Array.isArray(projectAreas)
		? projectAreas
		: (projectAreas?.data as ProjectArea[]) ?? [];

	const filtered = useMemo(() => {
		const q = search.toLowerCase();
		if (!q) return areas;
		return areas.filter(
			(a) =>
				a.name.toLowerCase().includes(q) ||
				(a.description ?? "").toLowerCase().includes(q),
		);
	}, [areas, search]);

	return (
		<>
		<Controller
				name="area_id"
				control={control}
				rules={{ required: "Project area is required" }}
				render={({ field }) => {
					const selected = areas.find((a) => a.id === field.value);

					return (
						<>
							{/* Trigger */}
							<button
								type="button"
								onClick={() => setOpen(true)}
								className={`w-full flex items-center justify-between rounded-md border px-3 py-2.5 text-sm transition-colors hover:bg-muted/30 focus:outline-none focus:ring-2 focus:ring-ring ${
									error ? "border-rose-400" : "border-input"
								}`}
							>
								{selected ? (
									<span className="font-medium truncate">{selected.name}</span>
								) : (
									<span className="text-muted-foreground">Choose a project area…</span>
								)}
								<IconChevronDown size={16} className="text-muted-foreground shrink-0 ml-2" />
							</button>

							{/* Dialog */}
							<Dialog
								open={open}
								onOpenChange={(v) => {
									setOpen(v);
									if (!v) setSearch("");
								}}
							>
								<DialogContent className="sm:max-w-3xl p-0 gap-0 overflow-hidden">
									<DialogHeader className="px-6 pt-6 pb-4 border-b">
										<DialogTitle>Select Project Area</DialogTitle>
										<DialogDescription>
											Read each area's description to find the best fit for your project.
										</DialogDescription>
									</DialogHeader>

									{/* Search */}
									<div className="flex items-center gap-3 px-6 py-4 border-b bg-muted/20">
										<div className="relative flex-1">
											<IconSearch
												size={15}
												className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
											/>
											<Input
												autoFocus
												placeholder="Search by name or description…"
												value={search}
												onChange={(e) => setSearch(e.target.value)}
												className="pl-9"
											/>
										</div>
										<span className="text-xs text-muted-foreground whitespace-nowrap">
											{filtered.length} area{filtered.length !== 1 ? "s" : ""}
										</span>
									</div>

									{/* Area grid */}
									<div className="overflow-y-auto max-h-[460px] p-4">
										{isLoading ? (
											<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
												{[...Array(6)].map((_, i) => (
													<div key={i} className="rounded-xl border p-4 animate-pulse">
														<div className="flex items-center gap-3 mb-3">
															<div className="h-10 w-10 rounded-xl bg-muted shrink-0" />
															<div className="h-4 w-36 rounded bg-muted" />
														</div>
														<div className="space-y-1.5">
															<div className="h-3 w-full rounded bg-muted" />
															<div className="h-3 w-5/6 rounded bg-muted" />
															<div className="h-3 w-4/6 rounded bg-muted" />
														</div>
													</div>
												))}
											</div>
										) : filtered.length === 0 ? (
											<div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
												<IconCode size={32} className="mb-2 opacity-30" />
												<p className="text-sm">No areas match your search.</p>
											</div>
										) : (
											<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
												{filtered.map((area, i) => {
													const isSelected = field.value === area.id;
													const palette = PALETTES[i % PALETTES.length];
													const Icon = getAreaIcon(area.name);
													return (
														<button
															key={area.id}
															type="button"
															onClick={() => {
																field.onChange(area.id);
																setOpen(false);
																setSearch("");
															}}
															className={`w-full rounded-xl border p-4 text-left transition-all duration-150 hover:shadow-sm ${
																isSelected
																	? "border-primary bg-primary/5 ring-1 ring-primary"
																	: "hover:border-border/80 hover:bg-muted/20"
															}`}
														>
															<div className="flex items-start justify-between gap-2 mb-2.5">
																<div className="flex items-center gap-3 min-w-0">
																	<div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isSelected ? "bg-primary" : palette.bg}`}>
																		<Icon size={18} className={isSelected ? "text-primary-foreground" : palette.text} />
																	</div>
																	<p className="font-semibold text-sm leading-snug">
																		{area.name}
																	</p>
																</div>
																{isSelected && (
																	<IconCheck size={16} className="text-primary shrink-0 mt-0.5" />
																)}
															</div>

															<p className="text-xs text-muted-foreground leading-relaxed">
																{area.description || "No description available."}
															</p>
														</button>
													);
												})}
											</div>
										)}
									</div>
								</DialogContent>
							</Dialog>
						</>
					);
				}}
			/>

			{error && <ErrorMessage error={error} />}
		</>
	);
}
