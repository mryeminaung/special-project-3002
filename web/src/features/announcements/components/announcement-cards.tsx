import api from "@/api/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useRoleChecker } from "@/hooks/use-role-checker";
import { cn } from "@/lib/utils";
import {
	IconCalendarEvent,
	IconPencil,
	IconSpeakerphone,
	IconTrash,
	IconUser,
} from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import type {
	AnnouncementAudience,
	AnnouncementItem,
} from "../announcement.types";
import EditAnnouncement from "./edit-announcement";

function formatAnnouncementDate(value: string) {
	const parsed = new Date(value);
	if (Number.isNaN(parsed.getTime())) {
		return value;
	}

	return parsed.toLocaleString();
}

function getAudienceBadge(audience: AnnouncementAudience) {
	switch (audience) {
		case "students":
			return "bg-blue-100 text-blue-700 border-blue-200";
		case "faculties":
			return "bg-amber-100 text-amber-700 border-amber-200";
		default:
			return "bg-emerald-100 text-emerald-700 border-emerald-200";
	}
}

function getAudienceBorder(audience: AnnouncementAudience) {
	switch (audience) {
		case "students":
			return "border-l-blue-500";
		case "faculties":
			return "border-l-amber-500";
		default:
			return "border-l-emerald-500";
	}
}

export default function AnnouncementCards({
	announcements,
}: {
	announcements: AnnouncementItem[];
}) {
	const queryClient = useQueryClient();
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [announcementToDelete, setAnnouncementToDelete] = useState<number | null>(null);

	const deleteMutation = useMutation({
		mutationFn: (announcementId: number) =>
			api.delete(`/announcements/${announcementId}`),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["announcements"] });
			toast.success("Announcement deleted successfully");
		},
		onError: (error) => {
			console.error("Error deleting announcement:", error);
			toast.error("Failed to delete announcement. Please try again.");
		},
	});

	const { isIC, isStudent, isFaculty, isSupervisor } = useRoleChecker();
	const isFacultyRole = isFaculty || isSupervisor;

	const filteredAnnouncements = announcements.filter((announcement) => {
		if (isIC) return true;
		if (announcement.audience === "both") return true;
		if (isStudent) return announcement.audience === "students";
		if (isFacultyRole) return announcement.audience === "faculties";
		return false;
	});

	const handleDeleteClick = (announcementId: number) => {
		setAnnouncementToDelete(announcementId);
		setDeleteDialogOpen(true);
	};

	const confirmDelete = () => {
		if (announcementToDelete !== null) {
			deleteMutation.mutate(announcementToDelete);
			setDeleteDialogOpen(false);
			setAnnouncementToDelete(null);
		}
	};

	return (
		<>
			<div className="mt-6 grid grid-cols-2 gap-4">
				{filteredAnnouncements.map((announcement) => (
					<article
						key={announcement.id}
						className={cn(
							"relative group overflow-hidden rounded-xl p-5 shadow-sm border-l-4 bg-card",
							getAudienceBorder(announcement.audience),
						)}>
						<div className="flex flex-wrap items-start justify-between gap-3">
							<div className="flex items-center gap-2 text-primary-700">
								<IconSpeakerphone size={16} />
								<span className="text-sm font-semibold">
									{announcement.title}
								</span>
							</div>

							<div className="flex items-center gap-x-3">
								{isIC && (
									<div className="flex items-center gap-2">
										<EditAnnouncement announcement={announcement} />
										<IconTrash
											onClick={() => handleDeleteClick(announcement.id)}
											className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-destructive transition-colors"
										/>
									</div>
								)}
								<Badge
									className={`capitalize border ${getAudienceBadge(announcement.audience)}`}>
									{announcement.audience}
								</Badge>
							</div>
						</div>

						<div className="flex flex-col gap-1.5 text-sm">
							<div className="inline-flex items-center gap-1.5">
								<IconCalendarEvent size={14} />
								<span>{formatAnnouncementDate(announcement.createdAt)}</span>
							</div>
							<div className="inline-flex items-center gap-1.5">
								<IconUser size={14} />
								<span>By {announcement.announcer}</span>
							</div>
						</div>

						<p className="mt-4 leading-6">{announcement.description}</p>
					</article>
				))}
			</div>

			{/* Delete Confirmation Dialog */}
			<Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete Announcement</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete this announcement? This action cannot be undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setDeleteDialogOpen(false)}
							disabled={deleteMutation.isPending}>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={confirmDelete}
							disabled={deleteMutation.isPending}>
							{deleteMutation.isPending ? "Deleting..." : "Delete"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
