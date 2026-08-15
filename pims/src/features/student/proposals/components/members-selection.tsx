import { getStudentsForProposal } from "../services/student-proposal.service";
import ErrorMessage from "@/components/error-message";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import {
	IconCheck,
	IconChevronDown,
	IconSearch,
	IconUser,
	IconUsers,
	IconX,
} from "@tabler/icons-react";

interface Props {
	control: any;
	error?: string;
}

type User = {
	id: number;
	name: string;
	email: string;
	batch?: string | number | null;
};

function getInitials(name: string) {
	return name
		.split(" ")
		.slice(0, 2)
		.map((n) => n[0])
		.join("")
		.toUpperCase();
}

export default function MembersSelection({ control, error }: Props) {
	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState("");
	const [majorFilter, setMajorFilter] = useState("all");
	const [batchFilter, setBatchFilter] = useState("all");

	const { data: studentsRes, isLoading } = useQuery({
		queryKey: ["students-for-proposal"],
		queryFn: getStudentsForProposal,
	});

	const students: User[] = Array.isArray(studentsRes)
		? studentsRes
		: (studentsRes?.data as User[]) ?? [];

	const batches = useMemo(() => {
		const seen = new Set<string>();
		students.forEach((s) => { if (s.batch) seen.add(String(s.batch)); });
		return Array.from(seen).sort((a, b) => b.localeCompare(a));
	}, [students]);

	const filtered = useMemo(() => {
		const q = search.toLowerCase();
		return students.filter((s) => {
			const matchesMajor = majorFilter === "all" || s.email.toLowerCase().includes(majorFilter);
			const matchesBatch = batchFilter === "all" || String(s.batch ?? "") === batchFilter;
			const matchesSearch = !q || s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
			return matchesMajor && matchesBatch && matchesSearch;
		});
	}, [students, majorFilter, batchFilter, search]);

	return (
		<Field>
			<FieldLabel htmlFor="members">
				Team Members <span className="text-red-500">*</span>
			</FieldLabel>

			<Controller
				name="members"
				control={control}
				rules={{
					required: "Team members are required",
					validate: (val: string[]) => {
						if (val.length < 2) return "Minimum 2 members required";
						if (val.length > 5) return "Maximum 5 members allowed";
						return true;
					},
				}}
				render={({ field }) => {
					const selectedIds: string[] = field.value ?? [];
					const selectedStudents = students.filter((s) =>
						selectedIds.includes(s.id.toString()),
					);

					const toggle = (id: string) => {
						const next = selectedIds.includes(id)
							? selectedIds.filter((x) => x !== id)
							: [...selectedIds, id];
						field.onChange(next);
					};

					const remove = (id: string) =>
						field.onChange(selectedIds.filter((x) => x !== id));

					return (
						<>
							{/* Trigger */}
							<button
								id="members"
								type="button"
								onClick={() => setOpen(true)}
								className={`w-full min-h-[42px] flex items-center justify-between rounded-md border px-3 py-2 text-sm transition-colors hover:bg-muted/30 focus:outline-none focus:ring-2 focus:ring-ring ${
									error ? "border-rose-400" : "border-input"
								}`}
							>
								{selectedStudents.length === 0 ? (
									<span className="text-muted-foreground">
										Select 2–5 team members…
									</span>
								) : (
									<div className="flex flex-wrap gap-1.5">
										{selectedStudents.map((s) => (
											<span
												key={s.id}
												className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
											>
												{s.name.length > 16 ? s.name.slice(0, 15) + "…" : s.name}
												<button
													type="button"
													onClick={(e) => {
														e.stopPropagation();
														remove(s.id.toString());
													}}
													className="hover:text-rose-500 transition-colors"
												>
													<IconX size={11} />
												</button>
											</span>
										))}
									</div>
								)}
								<div className="flex items-center gap-1.5 shrink-0 ml-2">
									{selectedStudents.length > 0 && (
										<span className="text-xs text-muted-foreground tabular-nums">
											{selectedStudents.length}/5
										</span>
									)}
									<IconChevronDown size={16} className="text-muted-foreground" />
								</div>
							</button>

							{/* Dialog */}
							<Dialog
								open={open}
								onOpenChange={(v) => {
									setOpen(v);
									if (!v) setSearch("");
								}}
							>
								<DialogContent className="sm:max-w-4xl p-0 gap-0 overflow-hidden">
									<DialogHeader className="px-6 pt-6 pb-4 border-b">
										<DialogTitle>Select Team Members</DialogTitle>
										<DialogDescription>
											Choose 2–5 members. Selected:{" "}
											<span className="font-semibold text-foreground">
												{selectedIds.length}/5
											</span>
										</DialogDescription>
									</DialogHeader>

									{/* Filter bar */}
									<div className="flex flex-wrap items-center gap-3 px-6 py-4 border-b bg-muted/20">
										<div className="relative flex-1 min-w-48">
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

										<Select value={majorFilter} onValueChange={setMajorFilter}>
											<SelectTrigger className="w-36">
												<SelectValue placeholder="All Majors" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="all">All Majors</SelectItem>
												<SelectItem value="cse">CSE</SelectItem>
												<SelectItem value="ece">ECE</SelectItem>
											</SelectContent>
										</Select>

										<Select value={batchFilter} onValueChange={setBatchFilter}>
											<SelectTrigger className="w-36">
												<SelectValue placeholder="All Batches" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="all">All Batches</SelectItem>
												{batches.map((b) => (
													<SelectItem key={b} value={b}>
														Batch {b}
													</SelectItem>
												))}
											</SelectContent>
										</Select>

										<span className="text-xs text-muted-foreground whitespace-nowrap">
											{filtered.length} found
										</span>
									</div>

									{/* Student grid */}
									<div className="overflow-y-auto max-h-[420px] p-4">
										{isLoading ? (
											<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
												{[...Array(6)].map((_, i) => (
													<div key={i} className="rounded-xl border p-4 animate-pulse">
														<div className="flex items-center gap-3">
															<div className="h-10 w-10 rounded-full bg-muted shrink-0" />
															<div className="space-y-1.5 flex-1">
																<div className="h-3.5 w-28 rounded bg-muted" />
																<div className="h-3 w-36 rounded bg-muted" />
															</div>
														</div>
													</div>
												))}
											</div>
										) : filtered.length === 0 ? (
											<div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
												<IconUser size={32} className="mb-2 opacity-30" />
												<p className="text-sm">No students found.</p>
											</div>
										) : (
											<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
												{filtered.map((student) => {
													const isSelected = selectedIds.includes(
														student.id.toString(),
													);
													return (
														<button
															key={student.id}
															type="button"
															onClick={() => toggle(student.id.toString())}
															className={`w-full rounded-xl border p-4 text-left transition-all duration-150 hover:shadow-sm ${
																isSelected
																	? "border-primary bg-primary/5 ring-1 ring-primary"
																	: "hover:border-border/80 hover:bg-muted/20"
															}`}
														>
															<div className="flex items-start justify-between gap-2">
																<div className="flex items-center gap-3 min-w-0">
																	<div
																		className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
																			isSelected
																				? "bg-primary text-primary-foreground"
																				: "bg-muted text-muted-foreground"
																		}`}
																	>
																		{getInitials(student.name)}
																	</div>
																	<div className="min-w-0">
																		<p className="font-semibold text-sm truncate">
																			{student.name}
																		</p>
																		<p className="text-xs text-muted-foreground truncate">
																			{student.email}
																		</p>
																		{student.batch && (
																			<span className="mt-1 inline-block rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium">
																				Batch {student.batch}
																			</span>
																		)}
																	</div>
																</div>
																{isSelected && (
																	<IconCheck
																		size={16}
																		className="text-primary shrink-0 mt-0.5"
																	/>
																)}
															</div>
														</button>
													);
												})}
											</div>
										)}
									</div>

									{/* Footer */}
									<div className="flex items-center justify-between px-6 py-4 border-t bg-muted/20">
										<div className="flex items-center gap-2 text-sm text-muted-foreground">
											<IconUsers size={15} />
											<span>
												{selectedIds.length === 0
													? "No members selected"
													: `${selectedIds.length} member${selectedIds.length > 1 ? "s" : ""} selected`}
											</span>
										</div>
										<Button
											type="button"
											onClick={() => setOpen(false)}
											className="bg-primary-600 hover:bg-primary-700 text-white"
										>
											Done
										</Button>
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
