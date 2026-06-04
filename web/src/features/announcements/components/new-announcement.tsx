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

import api from "@/api/api";
import ErrorMessage from "@/components/error-message";
import { useAuthStore } from "@/stores/use-auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const announcementSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().min(1, "Description is required"),
	audience: z.enum(["students", "faculties", "both"]),
	created_by: z.number(),
});

export function NewAnnouncement() {
	const queryClient = useQueryClient();

	const authUser = useAuthStore((state) => state.authUser);
	const [open, setOpen] = useState(false);

	const [selectedAudience, setSelectedAudience] = useState<
		"students" | "faculties" | "both"
	>("both");

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<z.infer<typeof announcementSchema>>({
		resolver: zodResolver(announcementSchema),
		defaultValues: {
			title: "",
			description: "",
			audience: "both",
			created_by: authUser.id,
		},
	});

	const [loading, setLoading] = useState(false);

	const onSubmit = async (data: z.infer<typeof announcementSchema>) => {
		const formData = { ...data, audience: selectedAudience };
		setLoading(true);
		try {
			const res = await api.post("/announcements", formData);
			if (res.status === 200 || res.status === 201) {
				await queryClient.invalidateQueries({ queryKey: ["announcements"] });
				setLoading(false);
				reset();
				setOpen(false);
			}
		} catch (error) {
			setLoading(false);
			console.error("Error creating announcement:", error);
		}
	};

	return (
		<Dialog
			open={open}
			onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					className="hover:cursor-pointer bg-primary-600 hover:bg-primary-600/80 ml-auto hover:text-white text-white"
					variant={"outline"}>
					<IconCirclePlus />
					<span>Create</span>
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-sm">
				<form onSubmit={handleSubmit(onSubmit)}>
					<DialogHeader>
						<DialogTitle>Create New Announcement</DialogTitle>
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
							<Label htmlFor="audience">Audience</Label>
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
							className="w-full">
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
