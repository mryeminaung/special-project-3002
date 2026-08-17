import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { useCan } from "@/hooks/use-can";
import {
	IconArrowLeft,
	IconMailOpened,
	IconMail,
	IconTrash,
} from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import type { AnnouncementItem } from "../announcement.types";
import { deleteAnnouncement } from "../services/announcement.service";
import EditAnnouncement from "./edit-announcement";
import { formatFullDateTime } from "@/lib/date";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

function getAudienceBadgeClasses(audience: string) {
	switch (audience) {
		case "students":
			return "bg-blue-50 text-blue-700 border-blue-200";
		case "faculties":
			return "bg-amber-50 text-amber-700 border-amber-200";
		default:
			return "bg-emerald-50 text-emerald-700 border-emerald-200";
	}
}

interface AnnouncementDetailProps {
	announcement: AnnouncementItem | null;
	isOpen: boolean;
	onClose: () => void;
	onMarkAsRead: (id: number) => void;
	onMarkAsUnread: (id: number) => void;
	isRead: (id: number) => boolean;
}

export default function AnnouncementDetail({
	announcement,
	isOpen,
	onClose,
	onMarkAsRead,
	onMarkAsUnread,
	isRead,
}: AnnouncementDetailProps) {
	const { can } = useCan();
	const queryClient = useQueryClient();
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	const deleteMutation = useMutation({
		mutationFn: deleteAnnouncement,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["announcements"] });
			toast.success("Announcement deleted successfully");
			onClose();
		},
		onError: (error) => {
			console.error("Error deleting announcement:", error);
			toast.error("Failed to delete announcement. Please try again.");
		},
	});

	if (!announcement) return null;

	const read = isRead(announcement.id);

	const handleToggleRead = () => {
		if (read) {
			onMarkAsUnread(announcement.id);
		} else {
			onMarkAsRead(announcement.id);
		}
	};

	const handleConfirmDelete = () => {
		deleteMutation.mutate(announcement.id);
		setDeleteDialogOpen(false);
	};

	return (
		<>
			<Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
				<SheetContent className="sm:max-w-lg w-full">
					<SheetHeader className="pr-8">
						<button
							onClick={onClose}
							className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-1 -ml-1">
							<IconArrowLeft size={16} />
							Back to Announcements
						</button>
						<SheetTitle className="text-lg font-semibold leading-snug">
							{announcement.title}
						</SheetTitle>
						<div className="flex flex-col gap-1 text-sm text-muted-foreground">
							<span className="font-medium text-foreground">
								{announcement.announcer}
							</span>
							<span>{formatFullDateTime(announcement.createdAt)}</span>
						</div>
						<div className="flex items-center gap-2 mt-1">
							<span className="text-xs text-muted-foreground">Audience:</span>
							<Badge
								variant="outline"
								className={`capitalize text-xs ${getAudienceBadgeClasses(announcement.audience)}`}>
								{announcement.audience}
							</Badge>
						</div>
					</SheetHeader>

					<Separator className="my-2" />

					<div className="px-4 pb-4 flex-1 overflow-y-auto">
						<p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
							{announcement.description}
						</p>
					</div>

					<div className="px-4 pb-4 flex items-center gap-2 flex-wrap">
						<Button
							variant="outline"
							size="sm"
							onClick={handleToggleRead}
							className="gap-1.5">
							{read ? (
								<>
									<IconMail size={14} />
									Mark as Unread
								</>
							) : (
								<>
									<IconMailOpened size={14} />
									Mark as Read
								</>
							)}
						</Button>

						{can('manage-announcements') && (
							<>
								<EditAnnouncement announcement={announcement} />
								<Button
									variant="outline"
									size="sm"
									onClick={() => setDeleteDialogOpen(true)}
									className="gap-1.5 text-destructive hover:text-destructive">
									<IconTrash size={14} />
									Delete
								</Button>
							</>
						)}
					</div>
				</SheetContent>
			</Sheet>

			{/* Delete Confirmation Dialog */}
			<Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<DialogContent className="border-t-primary-500">
					<DialogHeader>
						<DialogTitle className="text-primary-700">
							Delete Announcement
						</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete this announcement? This action
							cannot be undone.
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
							onClick={handleConfirmDelete}
							disabled={deleteMutation.isPending}>
							{deleteMutation.isPending ? "Deleting..." : "Delete"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
