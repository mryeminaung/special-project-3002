import { createAcademicYear, updateAcademicYear } from "../services/admin.service";
import type { AcademicYear } from "../types/admin.types";
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
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {
	open: boolean;
	onClose: () => void;
	academicYear?: AcademicYear | null;
};

const YEAR_RE = /^\d{4}\/\d{4}$/;

export default function AcademicYearModal({ open, onClose, academicYear }: Props) {
	const queryClient = useQueryClient();
	const isEdit = Boolean(academicYear);

	const [year, setYear] = useState("");
	const [semester, setSemester] = useState<1 | 2>(1);
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [isActive, setIsActive] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

	useEffect(() => {
		if (open) {
			setYear(academicYear?.year ?? "");
			setSemester(academicYear?.semester ?? 1);
			setStartDate(academicYear?.startDate ?? "");
			setEndDate(academicYear?.endDate ?? "");
			setIsActive(academicYear?.isActive ?? false);
			setErrors({});
		}
	}, [open, academicYear]);

	function validate() {
		const next: Record<string, string> = {};
		if (!year.trim()) {
			next.year = "Year is required.";
		} else if (!YEAR_RE.test(year.trim())) {
			next.year = 'Format must be "YYYY/YYYY" e.g. 2025/2026.';
		}
		if (!startDate) next.startDate = "Start date is required.";
		if (!endDate) next.endDate = "End date is required.";
		if (startDate && endDate && endDate <= startDate) {
			next.endDate = "End date must be after start date.";
		}
		setErrors(next);
		return Object.keys(next).length === 0;
	}

	async function handleSave() {
		if (!validate()) return;

		try {
			setIsSaving(true);
			const payload = {
				year: year.trim(),
				semester,
				start_date: startDate,
				end_date: endDate,
				is_active: isActive,
			};

			if (isEdit && academicYear) {
				await updateAcademicYear(academicYear.id, payload);
				toast.success("Academic year updated.");
			} else {
				await createAcademicYear(payload);
				toast.success("Academic year created.");
			}

			await queryClient.invalidateQueries({ queryKey: ["admin-academic-years"] });
			onClose();
		} catch (err: any) {
			const msg = err?.response?.data?.message ?? "Something went wrong.";
			toast.error(msg);
		} finally {
			setIsSaving(false);
		}
	}

	const label = year && YEAR_RE.test(year)
		? `${year} Semester ${semester === 1 ? "I" : "II"}`
		: "—";

	return (
		<Dialog open={open} onOpenChange={(v) => !v && onClose()}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>
						{isEdit ? "Edit Academic Year" : "New Academic Year"}
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-4 py-1">
					{/* Preview label */}
					<div className="rounded-lg bg-muted/50 border px-4 py-2.5 text-sm">
						<span className="text-muted-foreground text-xs">Preview: </span>
						<span className="font-semibold">{label}</span>
					</div>

					{/* Year */}
					<div className="space-y-1.5">
						<Label htmlFor="ay-year">
							Year <span className="text-destructive">*</span>
						</Label>
						<Input
							id="ay-year"
							placeholder="e.g. 2025/2026"
							value={year}
							onChange={(e) => {
								setYear(e.target.value);
								if (errors.year) setErrors((p) => ({ ...p, year: "" }));
							}}
							disabled={isSaving}
						/>
						{errors.year && <p className="text-xs text-destructive">{errors.year}</p>}
					</div>

					{/* Semester toggle */}
					<div className="space-y-1.5">
						<Label>Semester <span className="text-destructive">*</span></Label>
						<div className="flex gap-2">
							{([1, 2] as const).map((s) => (
								<button
									key={s}
									type="button"
									onClick={() => setSemester(s)}
									disabled={isSaving}
									className={`flex-1 rounded-md border py-2 text-sm font-medium transition-colors ${
										semester === s
											? "border-primary-600 bg-primary-600 text-white"
											: "border-border bg-transparent text-muted-foreground hover:bg-muted"
									}`}>
									Semester {s === 1 ? "I" : "II"}
								</button>
							))}
						</div>
					</div>

					{/* Dates */}
					<div className="grid grid-cols-2 gap-3">
						<div className="space-y-1.5">
							<Label htmlFor="ay-start">
								Start Date <span className="text-destructive">*</span>
							</Label>
							<Input
								id="ay-start"
								type="date"
								value={startDate}
								onChange={(e) => {
									setStartDate(e.target.value);
									if (errors.startDate) setErrors((p) => ({ ...p, startDate: "" }));
								}}
								disabled={isSaving}
							/>
							{errors.startDate && <p className="text-xs text-destructive">{errors.startDate}</p>}
						</div>
						<div className="space-y-1.5">
							<Label htmlFor="ay-end">
								End Date <span className="text-destructive">*</span>
							</Label>
							<Input
								id="ay-end"
								type="date"
								value={endDate}
								onChange={(e) => {
									setEndDate(e.target.value);
									if (errors.endDate) setErrors((p) => ({ ...p, endDate: "" }));
								}}
								disabled={isSaving}
							/>
							{errors.endDate && <p className="text-xs text-destructive">{errors.endDate}</p>}
						</div>
					</div>

					{/* Set active */}
					<button
						type="button"
						onClick={() => setIsActive((v) => !v)}
						disabled={isSaving}
						className={cn(
							"flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left transition-colors",
							isActive
								? "border-emerald-300 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950/40"
								: "border-border hover:bg-muted/40",
						)}>
						<div>
							<p className="text-sm font-medium">Set as Active</p>
							<p className="text-xs text-muted-foreground mt-0.5">
								Only one academic year can be active at a time.
							</p>
						</div>
						<div
							className={cn(
								"flex h-5 w-9 shrink-0 items-center rounded-full border-2 transition-colors",
								isActive
									? "border-emerald-600 bg-emerald-600"
									: "border-muted-foreground/30 bg-muted",
							)}>
							<span
								className={cn(
									"block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform duration-200",
									isActive ? "translate-x-4" : "translate-x-0.5",
								)}
							/>
						</div>
					</button>
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={onClose} disabled={isSaving}>
						Cancel
					</Button>
					<Button
						onClick={handleSave}
						disabled={isSaving}
						className="bg-primary-600 hover:bg-primary-600/90 text-white">
						{isSaving ? "Saving…" : isEdit ? "Save Changes" : "Create"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
