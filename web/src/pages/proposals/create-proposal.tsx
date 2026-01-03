import api from "@/api/api";
import ErrorMessage from "@/components/error-message";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import RootLayout from "@/layouts/RootLayout";
import { HasRole } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconLoader, IconSend } from "@tabler/icons-react";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import UnAuthorized from "../UnAuthorized";
import FileUpload from "./components/file-upload";
import MembersSelection from "./components/members-selection";
import SupervisorSelection from "./components/supervisor-selection";

const ProposalSchema = z.object({
	title: z
		.string()
		.min(5, "Title must be at least 5 characters")
		.max(150, "Title is too long"),

	description: z
		.string()
		.min(20, "Please provide a more detailed description")
		.max(500, "Please provide a clear and concise description"),

	supervisor_id: z.string().min(1, "Please select a project supervisor"),

	members: z
		.array(z.string())
		.min(2, "Select at least 2 team members")
		.max(5, "Maximum 5 members allowed"),

	fileUrl: z.string().min(1, "Proposal file is required"),
});

export default function CreateProposalPage() {
	if (!HasRole("Student")) return <UnAuthorized />;

	useHeaderInitializer("MIIT | Proposal Submission", "Create New Proposal");

	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<z.infer<typeof ProposalSchema>>({
		resolver: zodResolver(ProposalSchema),
		defaultValues: {
			title: "",
			description: "",
			supervisor_id: "",
			members: [],
			fileUrl: "",
		},
		mode: "onSubmit",
	});

	type FileUploadHandle = { clear: () => Promise<void> };
	const fileUploadRef = useRef<FileUploadHandle | null>(null);

	const onSubmit = async (data: z.infer<typeof ProposalSchema>) => {
		const res = await api.post("/proposals/create", data);
		console.log(res);
	};

	const clearForm = async () => {
		reset();
		await fileUploadRef.current?.clear();
	};

	return (
		<RootLayout>
			<div className="mx-6">
				<div className="space-y-1 mb-5">
					<h3 className="text-2xl font-semibold">
						Submit Your Project Proposal
					</h3>
					<p className="text-base text-muted-foreground">
						Complete the form below to submit your academic project proposal for
						review
					</p>
				</div>

				<Card className="shadow-2xs px-6 pb-6">
					<form
						autoComplete="off"
						onSubmit={handleSubmit(onSubmit)}>
						<div className="grid grid-cols-1 @xl/main:grid-cols-2 @5xl/main:grid-cols-2 gap-6">
							<div className="space-y-5">
								<Field>
									<FieldLabel htmlFor="title">
										Project Name <span className="text-red-500">*</span>
									</FieldLabel>
									<Input
										id="title"
										{...register("title")}
										className="text-sm py-5 placeholder:font-normal placeholder:text-[14px] placeholder:text-muted-foreground/80"
										placeholder="Enter your project name"
										type="text"
									/>
									{errors.title && (
										<ErrorMessage error="Project title is required" />
									)}
								</Field>

								<SupervisorSelection
									control={control}
									error={errors.supervisor_id?.message}
								/>

								<MembersSelection
									control={control}
									error={errors.members?.message}
								/>
							</div>

							<div className="space-y-5">
								<Field>
									<FieldLabel htmlFor="description">
										Project Description <span className="text-red-500">*</span>
									</FieldLabel>
									<Textarea
										id="description"
										{...register("description")}
										className="min-h-[228px] text-sm h-auto placeholder:font-normal placeholder:text-[14px] placeholder:text-muted-foreground/80"
										placeholder="Describe your project, its objectives, scope, and expected outcomes"
									/>
									{errors.description && (
										<ErrorMessage error={errors.description.message} />
									)}
								</Field>
							</div>
						</div>
						<div className="my-3">
							<FileUpload
								ref={fileUploadRef}
								control={control}
								error={errors.fileUrl?.message}
							/>
						</div>

						<div className="flex flex-col sm:flex-row items-center justify-end gap-3">
							<Button
								type="button"
								disabled={isSubmitting}
								className="hover:cursor-pointer w-full sm:w-fit order-2 sm:order-1"
								onClick={clearForm}
								variant={"outline"}>
								<span>Clear Form</span>
							</Button>
							<Button
								type="submit"
								disabled={isSubmitting}
								className="hover:cursor-pointer w-full sm:w-fit order-1 sm:order-2 bg-primary-950 hover:bg-cherry-pie-950/80 hover:text-white text-white"
								variant={"outline"}>
								{isSubmitting ? (
									<>
										<span>Submitting...</span>
										<IconLoader className="animate-spin" />
									</>
								) : (
									<>
										<span>Submit Proposal</span>
										<IconSend />
									</>
								)}
							</Button>
						</div>
					</form>
				</Card>
			</div>
		</RootLayout>
	);
}
