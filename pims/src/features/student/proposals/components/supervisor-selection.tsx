import { getSupervisorsForProposal } from "../services/student-proposal.service";
import ErrorMessage from "@/components/error-message";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Controller } from "react-hook-form";
import { IconBuilding, IconCheck, IconChevronDown, IconSearch, IconUser } from "@tabler/icons-react";

interface Props {
	control: any;
	error?: string;
}

type Faculty = {
	id: number;
	name: string;
	email: string;
	department?: string;
	workloadCount?: number;
	maxCapacity?: number;
};

function WorkloadBar({ count, capacity }: { count?: number; capacity?: number }) {
	if (count === undefined || !capacity) return null;
	const pct = Math.min(Math.round((count / capacity) * 100), 100);
	const color =
		pct <= 50 ? "bg-emerald-500" : pct <= 80 ? "bg-amber-500" : "bg-rose-500";
	const label =
		pct <= 50 ? "text-emerald-600" : pct <= 80 ? "text-amber-600" : "text-rose-600";

	return (
		<div className="flex items-center gap-2 mt-1.5">
			<div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
				<div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
			</div>
			<span className={`text-xs font-medium tabular-nums ${label}`}>
				{count}/{capacity}
			</span>
		</div>
	);
}

function getInitials(name: string) {
	return name
		.split(" ")
		.slice(0, 2)
		.map((n) => n[0])
		.join("")
		.toUpperCase();
}

export default function SupervisorSelection({ control, error }: Props) {
	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState("");
	const [deptFilter, setDeptFilter] = useState("all");

	const { data: supervisorsRes, isLoading } = useQuery({
		queryKey: ["faculties-for-proposal"],
		queryFn: getSupervisorsForProposal,
	});

	const supervisors: Faculty[] = Array.isArray(supervisorsRes)
		? supervisorsRes
		: ((supervisorsRes?.data as Faculty[]) ?? []);

	const departments = useMemo(() => {
		const names = supervisors
			.map((s) => s.department?.trim())
			.filter((d): d is string => Boolean(d));
		return Array.from(new Set(names)).sort((a, b) => a.localeCompare(b));
	}, [supervisors]);

	const filtered = useMemo(() => {
		const q = search.toLowerCase();
		return supervisors.filter((s) => {
			const matchesDept = deptFilter === "all" || s.department === deptFilter;
			const matchesSearch = !q || s.name.toLowerCase().includes(q) || (s.email ?? "").toLowerCase().includes(q);
			return matchesDept && matchesSearch;
		});
	}, [supervisors, search, deptFilter]);

	return (
		<Field>
			<Controller
				name="supervisor_id"
				control={control}
				rules={{ required: "Supervisor should not be empty" }}
				render={({ field }) => {
					const selected = supervisors.find((s) => s.id.toString() === field.value);

					return (
						<>
							<FieldLabel htmlFor="supervisor">
								Project Supervisor <span className="text-red-500">*</span>
							</FieldLabel>

							{/* Trigger */}
							<button
								id="supervisor"
								type="button"
								onClick={() => setOpen(true)}
								className={`w-full flex items-center justify-between rounded-md border px-3 py-2.5 text-sm transition-colors hover:bg-muted/30 focus:outline-none focus:ring-2 focus:ring-ring ${
									error ? "border-rose-400" : "border-input"
								}`}
							>
								{selected ? (
									<div className="flex items-center gap-3 min-w-0">
										<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
											{getInitials(selected.name)}
										</div>
										<div className="min-w-0 text-left">
											<p className="font-medium truncate">{selected.name}</p>
											<p className="text-xs text-muted-foreground truncate">
												{selected.department || selected.email}
											</p>
										</div>
									</div>
								) : (
									<span className="text-muted-foreground">Choose your supervisor…</span>
								)}
								<IconChevronDown size={16} className="text-muted-foreground shrink-0 ml-2" />
							</button>

							{/* Dialog */}
							<Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setSearch(""); }}>
								<DialogContent className="sm:max-w-4xl p-0 gap-0 overflow-hidden">
									<DialogHeader className="px-6 pt-6 pb-4 border-b">
										<DialogTitle>Select a Supervisor</DialogTitle>
										<DialogDescription>
											Search by name or filter by department.
										</DialogDescription>
									</DialogHeader>

									{/* Filter bar */}
									<div className="flex items-center gap-3 px-6 py-4 border-b bg-muted/20">
										<div className="relative flex-1">
											<IconSearch
												size={15}
												className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
											/>
											<Input
												autoFocus
												placeholder="Search by name or email…"
												value={search}
												onChange={(e) => setSearch(e.target.value)}
												className="pl-9"
											/>
										</div>
										<Select value={deptFilter} onValueChange={setDeptFilter}>
											<SelectTrigger className="w-48">
												<IconBuilding size={14} className="text-muted-foreground mr-1" />
												<SelectValue placeholder="All Departments" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="all">All Departments</SelectItem>
												{departments.map((d) => (
													<SelectItem key={d} value={d}>{d}</SelectItem>
												))}
											</SelectContent>
										</Select>
										<span className="text-xs text-muted-foreground whitespace-nowrap">
											{filtered.length} found
										</span>
									</div>

									{/* Supervisor list */}
									<div className="overflow-y-auto max-h-[420px] p-4">
										{isLoading ? (
											<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
												{[...Array(6)].map((_, i) => (
													<div key={i} className="rounded-xl border p-4 animate-pulse">
														<div className="flex items-center gap-3 mb-2">
															<div className="h-10 w-10 rounded-full bg-muted shrink-0" />
															<div className="space-y-1.5 flex-1">
																<div className="h-3.5 w-32 rounded bg-muted" />
																<div className="h-3 w-24 rounded bg-muted" />
															</div>
														</div>
														<div className="h-1.5 w-full rounded-full bg-muted" />
													</div>
												))}
											</div>
										) : filtered.length === 0 ? (
											<div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
												<IconUser size={32} className="mb-2 opacity-30" />
												<p className="text-sm">No supervisors found.</p>
											</div>
										) : (
											<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
												{filtered.map((sup) => {
													const isSelected = field.value === sup.id.toString();
													const isAtCapacity = (sup.workloadCount ?? 0) >= (sup.maxCapacity ?? 5);
													return (
														<button
															key={sup.id}
															type="button"
															disabled={isAtCapacity && !isSelected}
															title={isAtCapacity && !isSelected ? `${sup.name} has reached the supervision limit` : undefined}
															onClick={() => {
																if (isAtCapacity) return;
																field.onChange(sup.id.toString());
																setOpen(false);
																setSearch("");
															}}
															className={`w-full rounded-xl border p-4 text-left transition-all duration-150 hover:shadow-sm ${
																isSelected
																	? "border-primary bg-primary/5 ring-1 ring-primary"
																	: isAtCapacity
																		? "opacity-50 cursor-not-allowed bg-muted/30"
																		: "hover:border-border/80 hover:bg-muted/20"
															}`}
														>
															<div className="flex items-start justify-between gap-2">
																<div className="flex items-center gap-3 min-w-0">
																	<div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
																		isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
																	}`}>
																		{getInitials(sup.name)}
																	</div>
																	<div className="min-w-0">
																		<p className="font-semibold text-sm truncate">{sup.name}</p>
																		<p className="text-xs text-muted-foreground truncate flex items-center gap-1">
																			<IconBuilding size={11} />
																			{sup.department || sup.email}
																		</p>
																	</div>
																</div>
																{isSelected && (
																	<IconCheck size={16} className="text-primary shrink-0 mt-0.5" />
																)}
															</div>
															<WorkloadBar
																count={sup.workloadCount}
																capacity={sup.maxCapacity}
															/>
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
		</Field>
	);
}
