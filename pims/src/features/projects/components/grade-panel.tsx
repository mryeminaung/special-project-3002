import { getGrades, giveGrade, updateGrade } from "../services/grade.service";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { IconPencil, IconPlus, IconStarFilled } from "@tabler/icons-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

type Member = { id: number; name: string; email: string };

type GradeEntry = {
	id: number;
	student_id: number;
	examiner_id: number;
	grade: string;
	remarks: string | null;
	type: "mid" | "final";
};

type Props = {
	projectSlug: string;
	members: Member[];
	readOnly?: boolean;
};

type FormState = {
	student_id: number | null;
	grade: string;
	remarks: string;
	type: "mid" | "final";
	gradeId: number | null;
};

const INITIAL_FORM: FormState = {
	student_id: null,
	grade: "",
	remarks: "",
	type: "mid",
	gradeId: null,
};

export default function GradePanel({ projectSlug, members, readOnly = false }: Props) {
	const queryClient = useQueryClient();
	const [open, setOpen] = useState(false);
	const [form, setForm] = useState<FormState>(INITIAL_FORM);
	const [saving, setSaving] = useState(false);

	const { data, isLoading } = useQuery({
		queryKey: ["grades", projectSlug],
		queryFn: () => getGrades(projectSlug),
		enabled: !!projectSlug,
		staleTime: 30_000,
	});

	const gradesByStudent: Record<number, GradeEntry[]> = (() => {
		const raw: { student: { id: number }; grades: GradeEntry[] }[] = data?.data ?? [];
		return Object.fromEntries(raw.map((g) => [g.student.id, g.grades]));
	})();

	function openForNew(studentId: number) {
		setForm({ ...INITIAL_FORM, student_id: studentId });
		setOpen(true);
	}

	function openForEdit(entry: GradeEntry) {
		setForm({
			student_id: entry.student_id,
			grade: entry.grade,
			remarks: entry.remarks ?? "",
			type: entry.type,
			gradeId: entry.id,
		});
		setOpen(true);
	}

	function close() {
		setOpen(false);
		setForm(INITIAL_FORM);
	}

	async function handleSubmit() {
		if (!form.student_id || !form.grade.trim()) {
			toast.error("Student and grade are required.");
			return;
		}
		try {
			setSaving(true);
			if (form.gradeId) {
				await updateGrade(projectSlug, form.gradeId, {
					grade: form.grade,
					remarks: form.remarks || undefined,
				});
				toast.success("Grade updated.");
			} else {
				await giveGrade(projectSlug, {
					student_id: form.student_id,
					grade: form.grade,
					remarks: form.remarks || undefined,
					type: form.type,
				});
				toast.success("Grade submitted.");
			}
			await queryClient.invalidateQueries({ queryKey: ["grades", projectSlug] });
			close();
		} catch (err: any) {
			toast.error(err?.response?.data?.message ?? "Failed to save grade.");
		} finally {
			setSaving(false);
		}
	}

	return (
		<div className="rounded-xl border bg-card overflow-hidden">
			{/* Header */}
			<div className="flex items-center gap-2 px-4 py-3 border-b bg-muted/40">
				<IconStarFilled size={15} className="text-primary-600" />
				<h3 className="text-sm font-semibold">Grades</h3>
			</div>

			{/* Body */}
			<div className="divide-y divide-border">
				{isLoading ? (
					<div className="px-4 py-6 text-sm text-muted-foreground text-center animate-pulse">
						Loading grades…
					</div>
				) : members.length === 0 ? (
					<div className="px-4 py-6 text-sm text-muted-foreground text-center">
						No team members.
					</div>
				) : (
					members.map((member) => {
						const entries: GradeEntry[] = gradesByStudent[member.id] ?? [];
						const midEntry = entries.find((e) => e.type === "mid");
						const finalEntry = entries.find((e) => e.type === "final");

						return (
							<div key={member.id} className="px-4 py-3 space-y-2">
								<div className="flex items-center justify-between gap-2">
									<p className="text-sm font-medium truncate">{member.name}</p>
									{!readOnly && (
										<Button
											size="sm"
											variant="outline"
											className="h-7 px-2 text-xs gap-1 shrink-0"
											onClick={() => openForNew(member.id)}>
											<IconPlus size={12} />
											Add
										</Button>
									)}
								</div>

								<div className="grid grid-cols-2 gap-2">
									{(["mid", "final"] as const).map((type) => {
										const entry = type === "mid" ? midEntry : finalEntry;
										return (
											<div
												key={type}
												className={cn(
													"rounded-lg border px-3 py-2 text-xs",
													entry
														? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800"
														: "bg-muted/40 border-dashed",
												)}>
												<div className="flex items-center justify-between gap-1 mb-0.5">
													<span className="font-medium capitalize text-muted-foreground">
														{type}
													</span>
													{entry && !readOnly && (
														<button
															type="button"
															onClick={() => openForEdit(entry)}
															className="text-muted-foreground hover:text-foreground">
															<IconPencil size={11} />
														</button>
													)}
												</div>
												{entry ? (
													<span className="font-semibold text-sm text-foreground">
														{entry.grade}
													</span>
												) : (
													<span className="text-muted-foreground">—</span>
												)}
											</div>
										);
									})}
								</div>
							</div>
						);
					})
				)}
			</div>

			{/* Dialog */}
			<Dialog open={open} onOpenChange={(v) => !v && close()}>
				<DialogContent className="sm:max-w-sm">
					<DialogHeader>
						<DialogTitle>{form.gradeId ? "Edit Grade" : "Give Grade"}</DialogTitle>
					</DialogHeader>

					<div className="space-y-4">
						{!form.gradeId && (
							<div className="space-y-1.5">
								<Label>Exam Type</Label>
								<Select
									value={form.type}
									onValueChange={(v) => setForm((f) => ({ ...f, type: v as "mid" | "final" }))}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="mid">Mid</SelectItem>
										<SelectItem value="final">Final</SelectItem>
									</SelectContent>
								</Select>
							</div>
						)}

						<div className="space-y-1.5">
							<Label>Grade</Label>
							<Input
								placeholder="e.g. A, B+, 85"
								value={form.grade}
								onChange={(e) => setForm((f) => ({ ...f, grade: e.target.value }))}
							/>
						</div>

						<div className="space-y-1.5">
							<Label>Remarks (optional)</Label>
							<Textarea
								placeholder="Any additional notes…"
								rows={3}
								value={form.remarks}
								onChange={(e) => setForm((f) => ({ ...f, remarks: e.target.value }))}
							/>
						</div>
					</div>

					<DialogFooter>
						<Button variant="outline" onClick={close} disabled={saving}>
							Cancel
						</Button>
						<Button
							onClick={handleSubmit}
							disabled={saving}
							className="bg-primary-600 hover:bg-primary-600/90 text-white">
							{saving ? "Saving…" : form.gradeId ? "Update" : "Submit"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
