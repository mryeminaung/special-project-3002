import { createProjectArea, updateProjectArea } from "../services/admin.service";
import type { ProjectArea } from "../types/admin.types";
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
	area?: ProjectArea | null;
};

export default function ProjectAreaModal({ open, onClose, area }: Props) {
	const queryClient = useQueryClient();
	const isEdit = Boolean(area);

	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [isSaving, setIsSaving] = useState(false);
	const [nameError, setNameError] = useState("");

	useEffect(() => {
		if (open) {
			setName(area?.name ?? "");
			setDescription(area?.description ?? "");
			setNameError("");
		}
	}, [open, area]);

	function validate() {
		if (!name.trim()) {
			setNameError("Name is required.");
			return false;
		}
		setNameError("");
		return true;
	}

	async function handleSave() {
		if (!validate()) return;

		try {
			setIsSaving(true);
			const payload = { name: name.trim(), description: description.trim() };

			if (isEdit && area) {
				await updateProjectArea(area.slug, payload);
				toast.success("Project area updated.");
			} else {
				await createProjectArea(payload);
				toast.success("Project area created.");
			}

			await queryClient.invalidateQueries({ queryKey: ["admin-project-areas"] });
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
						{isEdit ? "Edit Project Area" : "New Project Area"}
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-4 py-1">
					<div className="space-y-1.5">
						<Label htmlFor="area-name">
							Name <span className="text-destructive">*</span>
						</Label>
						<Input
							id="area-name"
							placeholder="e.g. Artificial Intelligence"
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
						<Label htmlFor="area-desc">Description</Label>
						<Textarea
							id="area-desc"
							placeholder="Brief description of this project area…"
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
