import { syncExaminers } from "../services/project.service";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn, getInitials } from "@/lib/utils";
import { IconCheck, IconSearch, IconX } from "@tabler/icons-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/api/api";

type Faculty = {
	id: number;
	name: string;
	email: string;
	rank?: string | null;
	department?: string | null;
	workloadCount?: number;
};

type Props = {
	open: boolean;
	onClose: () => void;
	projectSlug: string;
	assignedIds: number[];
};

async function getFacultiesForExaminer(): Promise<Faculty[]> {
	const res = await api.get("/faculties-for-proposal");
	const body = res.data?.data ?? res.data;
	return Array.isArray(body) ? body : [];
}

export default function ExaminerModal({ open, onClose, projectSlug, assignedIds }: Props) {
	const queryClient = useQueryClient();
	const [search, setSearch] = useState("");
	const [selected, setSelected] = useState<number[]>([]);
	const [isSaving, setIsSaving] = useState(false);

	const { data: faculties = [], isLoading } = useQuery<Faculty[]>({
		queryKey: ["faculties-for-examiner"],
		queryFn: getFacultiesForExaminer,
		enabled: open,
	});

	useEffect(() => {
		if (open) {
			setSelected(assignedIds);
			setSearch("");
		}
	}, [open, assignedIds]);

	const filtered = faculties.filter(
		(f) =>
			f.name.toLowerCase().includes(search.toLowerCase()) ||
			f.email.toLowerCase().includes(search.toLowerCase()) ||
			(f.department ?? "").toLowerCase().includes(search.toLowerCase()),
	);

	function toggle(id: number) {
		setSelected((prev) =>
			prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
		);
	}

	async function handleSave() {
		try {
			setIsSaving(true);
			await syncExaminers(projectSlug, selected);
			toast.success("Examiners updated.");
			await queryClient.invalidateQueries({ queryKey: ["projectDetail", projectSlug] });
			onClose();
		} catch (err: any) {
			toast.error(err?.response?.data?.message ?? "Failed to update examiners.");
		} finally {
			setIsSaving(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={(v) => !v && onClose()}>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Manage Examiners</DialogTitle>
				</DialogHeader>

				{/* Selected chips */}
				{selected.length > 0 && (
					<div className="flex flex-wrap gap-1.5 -mb-1">
						{selected.map((id) => {
							const f = faculties.find((x) => x.id === id);
							if (!f) return null;
							return (
								<span
									key={id}
									className="inline-flex items-center gap-1 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 text-xs px-2.5 py-1 font-medium">
									{f.name}
									<button
										type="button"
										onClick={() => toggle(id)}
										className="ml-0.5 hover:text-primary-900">
										<IconX size={11} />
									</button>
								</span>
							);
						})}
					</div>
				)}

				{/* Search */}
				<div className="relative">
					<IconSearch
						size={14}
						className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
					/>
					<Input
						placeholder="Search by name, email, or department…"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="pl-8"
					/>
				</div>

				{/* List */}
				<div className="max-h-72 overflow-y-auto -mx-1 space-y-1 pr-1">
					{isLoading ? (
						[...Array(5)].map((_, i) => (
							<div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-lg animate-pulse">
								<div className="h-8 w-8 rounded-full bg-muted shrink-0" />
								<div className="flex-1 space-y-1.5">
									<div className="h-3.5 w-36 bg-muted rounded" />
									<div className="h-3 w-24 bg-muted rounded" />
								</div>
							</div>
						))
					) : filtered.length === 0 ? (
						<p className="py-8 text-center text-sm text-muted-foreground">No faculties found.</p>
					) : (
						filtered.map((f) => {
							const isSelected = selected.includes(f.id);
							return (
								<button
									key={f.id}
									type="button"
									onClick={() => toggle(f.id)}
									className={cn(
										"flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
										isSelected
											? "bg-primary-50 dark:bg-primary-900/30"
											: "hover:bg-muted/60",
									)}>
									<Avatar className="h-8 w-8 shrink-0">
										<AvatarFallback className="bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 text-xs font-semibold">
											{getInitials(f.name)}
										</AvatarFallback>
									</Avatar>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium leading-none truncate">{f.name}</p>
										<p className="text-xs text-muted-foreground mt-0.5 truncate">
											{[f.rank, f.department].filter(Boolean).join(" · ") || f.email}
										</p>
									</div>
									<div
										className={cn(
											"flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
											isSelected
												? "border-primary-600 bg-primary-600"
												: "border-muted-foreground/30",
										)}>
										{isSelected && <IconCheck size={11} className="text-white" />}
									</div>
								</button>
							);
						})
					)}
				</div>

				<DialogFooter>
					<p className="mr-auto text-xs text-muted-foreground self-center">
						{selected.length} selected
					</p>
					<Button variant="outline" onClick={onClose} disabled={isSaving}>
						Cancel
					</Button>
					<Button
						onClick={handleSave}
						disabled={isSaving}
						className="bg-primary-600 hover:bg-primary-600/90 text-white">
						{isSaving ? "Saving…" : "Save"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
