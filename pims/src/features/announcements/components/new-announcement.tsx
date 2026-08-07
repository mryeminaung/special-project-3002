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
import { IconCirclePlus, IconLoader } from "@tabler/icons-react";

import ErrorMessage from "@/components/error-message";
import { useAuthStore } from "@/stores/use-auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import type { AnnouncementAudience } from "../announcement.types";
import { createAnnouncement } from "../services/announcement.service";

type AudienceOption = {
	value: AnnouncementAudience;
	label: string;
};

const AUDIENCE_OPTIONS: AudienceOption[] = [
	{ value: "students", label: "Students" },
	{ value: "faculties", label: "Faculties" },
	{ value: "both", label: "Both" },
];

const announcementSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().min(1, "Description is required"),
	audience: z.enum(["students", "faculties", "both"]),
	created_by: z.number(),
});

type AnnouncementFormData = z.infer<typeof announcementSchema>;

export function NewAnnouncement() {
	const queryClient = useQueryClient();
	const authUser = useAuthStore((state) => state.authUser);
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const {
		register,
		handleSubmit,
		reset,
		setValue,
		watch,
		formState: { errors },
	} = useForm<AnnouncementFormData>({
		resolver: zodResolver(announcementSchema),
		defaultValues: {
			title: "",
			description: "",
			audience: "both",
			created_by: authUser.id,
		},
	});

	const selectedAudience = watch("audience");

	const onSubmit = async (data: AnnouncementFormData) => {
		setLoading(true);
		try {
			await createAnnouncement(data);
			await queryClient.invalidateQueries({ queryKey: ["announcements"] });
			toast.success("Announcement created successfully");
			reset();
			setOpen(false);
		} catch (error) {
			console.error("Error creating announcement:", error);
			toast.error("Failed to create announcement. Please try again.");
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
				}
			}}>
			<DialogTrigger asChild>
				<Button
					className="bg-primary-600 hover:bg-primary-600/80 ml-auto text-white hover:text-white"
					variant={"outline"}>
					<IconCirclePlus />
					<span>Create</span>
				</Button>
			</DialogTrigger>
			<DialogContent className="border-t-primary-500 sm:max-w-sm">
				<form onSubmit={handleSubmit(onSubmit)}>
					<DialogHeader>
						<DialogTitle className="text-primary-700">
							Create New Announcement
						</DialogTitle>
						<DialogDescription className="mb-2">
							Fill in the details for your new announcement.
							<br />
							Click <b>Save</b> when you&apos;re done.
						</DialogDescription>
					</DialogHeader>
					<FieldGroup>
						<Field>
							<Label htmlFor="title">Title</Label>
							<Input
								{...register("title")}
								id="title"
								name="title"
							/>
							{errors.title && <ErrorMessage error={errors.title?.message} />}
						</Field>
						<Field>
							<Label htmlFor="description">Description</Label>
							<Textarea
								{...register("description")}
								id="description"
								className="min-h-30 resize-none"
								name="description"
							/>
							{errors.description && (
								<ErrorMessage error={errors.description?.message} />
							)}
						</Field>
						<Field>
							<Label>Audience</Label>
							<div className="flex items-center gap-x-3">
								{AUDIENCE_OPTIONS.map((option) => (
									<Button
										key={option.value}
										type="button"
										onClick={() =>
											setValue("audience", option.value, {
												shouldValidate: true,
											})
										}
										className={`flex-1 ${selectedAudience === option.value ? "bg-primary-600  hover:bg-primary-600/80 ml-auto text-white hover:text-white" : ""}`}
										variant={
											selectedAudience === option.value ? "default" : "outline"
										}
										color={
											selectedAudience === option.value ? "primary" : "default"
										}>
										{option.label}
									</Button>
								))}
							</div>
						</Field>
					</FieldGroup>
					<DialogFooter className="mt-5">
						<Button
							type="submit"
							className="w-full bg-primary-600 hover:bg-primary-600/80 ml-auto text-white hover:text-white"
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
