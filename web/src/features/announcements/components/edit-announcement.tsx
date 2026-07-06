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
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IconLoader, IconPencil } from "@tabler/icons-react";

import api from "@/api/api";
import ErrorMessage from "@/components/error-message";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import type { AnnouncementAudience, AnnouncementItem } from "../announcement.types";

const editAnnouncementSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().min(1, "Description is required"),
	audience: z.enum(["students", "faculties", "both"]),
});

type EditAnnouncementFormData = z.infer<typeof editAnnouncementSchema>;

export default function EditAnnouncement({ announcement }: { announcement: AnnouncementItem }) {
	const queryClient = useQueryClient();
	const [open, setOpen] = useState(false);
	const [selectedAudience, setSelectedAudience] = useState<AnnouncementAudience>(announcement.audience);
	const [loading, setLoading] = useState(false);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<EditAnnouncementFormData>({
		defaultValues: {
			title: announcement.title,
			description: announcement.description,
			audience: announcement.audience,
		},
	});

	const onSubmit = async (data: EditAnnouncementFormData) => {
		const formData = { ...data, audience: selectedAudience };
		setLoading(true);
		try {
			const res = await api.put(`/announcements/${announcement.id}`, formData);
			if (res.status === 200) {
				await queryClient.invalidateQueries({ queryKey: ["announcements"] });
				toast.success("Announcement updated successfully");
				reset();
				setOpen(false);
			}
		} catch (error) {
			console.error("Error updating announcement:", error);
			toast.error("Failed to update announcement. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(isOpen) => {
				setOpen(isOpen);
				if (!isOpen) {
					reset();
					setSelectedAudience(announcement.audience);
				}
			}}>
			<DialogTrigger asChild>
				<IconPencil
					className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-primary transition-colors"
				/>
			</DialogTrigger>
			<DialogContent className="sm:max-w-sm">
				<form onSubmit={handleSubmit(onSubmit)}>
					<DialogHeader>
						<DialogTitle>Edit Announcement</DialogTitle>
						<DialogDescription className="mb-2">
							Update the details for this announcement.
							<br />
							Click <b>Save</b> when you&apos;re done.
						</DialogDescription>
					</DialogHeader>
					<FieldGroup>
						<Field>
							<Label htmlFor="edit-title">Title</Label>
							<Input
								{...register("title")}
								id="edit-title"
								name="title"
							/>
							{errors.title && <ErrorMessage error={errors.title?.message} />}
						</Field>
						<Field>
							<Label htmlFor="edit-description">Description</Label>
							<Textarea
								{...register("description")}
								id="edit-description"
								className="min-h-30 resize-none"
								name="description"
							/>
							{errors.description && (
								<ErrorMessage error={errors.description?.message} />
							)}
						</Field>
						<Field>
							<Label htmlFor="edit-audience">Audience</Label>
							<div className="flex items-center gap-x-3">
								<Button
									type="button"
									onClick={() => setSelectedAudience("students")}
									className="flex-1"
									variant={
										selectedAudience === "students" ? "default" : "outline"
									}>
									Students
								</Button>
								<Button
									type="button"
									onClick={() => setSelectedAudience("faculties")}
									className="flex-1"
									variant={
										selectedAudience === "faculties" ? "default" : "outline"
									}>
									Faculties
								</Button>
								<Button
									type="button"
									onClick={() => setSelectedAudience("both")}
									className="flex-1"
									variant={selectedAudience === "both" ? "default" : "outline"}>
									Both
								</Button>
							</div>
						</Field>
					</FieldGroup>
					<DialogFooter className="mt-5">
						<Button
							type="submit"
							className="w-full"
							disabled={loading}>
							{loading && (
								<IconLoader
									size={20}
									className="animate-spin"
								/>
							)}
							{loading ? "Saving" : "Save"} Changes
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
