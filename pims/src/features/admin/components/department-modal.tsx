import { createDepartment, updateDepartment } from "../services/admin.service";
import type { Department } from "../types/admin.types";
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
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {
	open: boolean;
	onClose: () => void;
	department?: Department | null;
};

export default function DepartmentModal({ open, onClose, department }: Props) {
	const queryClient = useQueryClient();
	const isEdit = Boolean(department);

	const [name, setName] = useState("");
	const [code, setCode] = useState("");
	const [description, setDescription] = useState("");
	const [isSaving, setIsSaving] = useState(false);
	const [nameError, setNameError] = useState("");
	const [codeError, setCodeError] = useState("");

	useEffect(() => {
		if (open) {
			setName(department?.name ?? "");
			setCode(department?.code ?? "");
			setDescription(department?.description ?? "");
			setNameError("");
			setCodeError("");
		}
	}, [open, department]);

	function validate() {
		let valid = true;
		if (!name.trim()) {
			setNameError("Name is required.");
			valid = false;
		} else {
			setNameError("");
		}
		if (!code.trim()) {
			setCodeError("Code is required.");
			valid = false;
		} else {
			setCodeError("");
		}
		return valid;
	}

	async function handleSave() {
		if (!validate()) return;

		try {
			setIsSaving(true);
			const payload = {
				name: name.trim(),
				code: code.trim(),
				description: description.trim() || undefined,
			};

			if (isEdit && department) {
				await updateDepartment(department.id, payload);
				toast.success("Department updated.");
			} else {
				await createDepartment(payload);
				toast.success("Department created.");
			}

			await queryClient.invalidateQueries({ queryKey: ["admin-departments"] });
			onClose();
		} catch (err: any) {
			const msg = err?.response?.data?.message ?? "Something went wrong.";
			toast.error(msg);
		} finally {
			setIsSaving(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={(v) => !v && onClose()}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>
						{isEdit ? "Edit Department" : "New Department"}
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-4 py-1">
					<div className="space-y-1.5">
						<Label htmlFor="dept-name">
							Name <span className="text-destructive">*</span>
						</Label>
						<Input
							id="dept-name"
							placeholder="e.g. Computer Science"
							value={name}
							onChange={(e) => {
								setName(e.target.value);
								if (nameError) setNameError("");
							}}
							disabled={isSaving}
						/>
						{nameError && (
							<p className="text-xs text-destructive">{nameError}</p>
						)}
					</div>

					<div className="space-y-1.5">
						<Label htmlFor="dept-code">
							Code <span className="text-destructive">*</span>
						</Label>
						<Input
							id="dept-code"
							placeholder="e.g. CS"
							value={code}
							onChange={(e) => {
								setCode(e.target.value);
								if (codeError) setCodeError("");
							}}
							disabled={isSaving}
						/>
						{codeError && (
							<p className="text-xs text-destructive">{codeError}</p>
						)}
					</div>

					<div className="space-y-1.5">
						<Label htmlFor="dept-desc">Description</Label>
						<Textarea
							id="dept-desc"
							placeholder="Brief description of this department…"
							rows={3}
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							disabled={isSaving}
							className="resize-none"
						/>
					</div>
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
