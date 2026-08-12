import api from "@/api/api";
import { PAGE_META, HEADINGS } from "@/constants/navigation";
import ErrorMessage from "@/components/error-message";
import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEventGuard } from "@/hooks/use-event-guard";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { useRoleChecker } from "@/hooks/use-role-checker";
import { useAuthStore } from "@/stores/use-auth-store";
import type { EventType } from "@/features/events";
import { FileUpload, ProjectAreaSelection, ProjectTypeSelection } from "@/features/proposals";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconLoader, IconSend } from "@tabler/icons-react";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { Toaster } from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import * as z from "zod";
import UnAuthorized from "@/components/auth/un-authorized";
import { MajorsSelection } from "../components/majors-selection";

const ProposalSchema = z.object({
	title: z
		.string()
		.min(5, "Title must be at least 5 characters")
		.max(150, "Title is too long"),
	description: z
		.string()
		.min(20, "Please provide a more detailed description")
		.max(1000, "Please provide a clear and concise description"),
	supervisor_id: z.string().min(1, "Please select a project supervisor"),
	type: z.string(),
	project_type: z.string().min(1, "Please select a project type"),
	area_id: z.number(),
	max_students: z
		.string()
		.min(1, "Maximum students is required")
		.refine((value) => /^\d+$/.test(value), {
			message: "Maximum students must be a whole number",
		})
		.refine((value) => Number(value) >= 1, {
			message: "Maximum students must be at least 1",
		})
		.refine((value) => Number(value) <= 4, {
			message: "Maximum students cannot exceed 4",
		}),
	eligible_majors: z.string().min(1, "Please select an eligible major."),
	fileUrl: z.string().min(1, "Proposal document is required"),
});

export default function CreateFacultyProposalPage() {
	useHeaderInitializer(PAGE_META.createProposal.title, PAGE_META.createProposal.subtitle);

	const authUser = useAuthStore((state) => state.authUser);
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		control,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<z.infer<typeof ProposalSchema>>({
		resolver: zodResolver(ProposalSchema),
		defaultValues: {
			title: "",
			description: "",
			fileUrl: "",
			type: "faculty",
			max_students: "",
			eligible_majors: "",
			project_type: "",
			area_id: 1,
			supervisor_id: authUser?.id.toString(),
		},
		mode: "onChange",
	});

	type FileUploadHandle = { clear: () => Promise<void> };
	const fileUploadRef = useRef<FileUploadHandle | null>(null);

	const onSubmit = async (data: z.infer<typeof ProposalSchema>) => {
		const formattedData = {
			...data,
			supervisor_id: parseInt(data.supervisor_id, 10),
		};

		try {
			const res = await api.post("/proposals", formattedData);
			if (res.status === 201) {
				navigate("/proposals/browse");
			}
		} catch (error: any) {
			const validationErrors = error.response?.data?.errors;
			if (error.response.data.message) toast.error(error.response.data.message);

			if (validationErrors?.title) {
				setError("title", {
					type: "manual",
					message: validationErrors.title,
				});
			}
		}
	};

	const { isFaculty, isSupervisor } = useRoleChecker();
	if (!isFaculty && !isSupervisor) return <UnAuthorized />;

	const [searchParams] = useSearchParams();
	const eventType = (searchParams.get("event") as EventType) || null;
	const eventGuard = useEventGuard(eventType ?? "special");
	const isEventBlocked = eventType ? !eventGuard.canSubmit : false;

	return (
		<>
			<Toaster />
			<div className="space-y-1 mb-5">
					<Heading
						title={HEADINGS.createProposal.title}
						description="Complete the form below to submit your academic project proposal for review"
					/>
				</div>

				{isEventBlocked && (
					<Card className="px-6 py-8 border-amber-200 bg-amber-50 shadow-sm mb-5">
						<div className="text-center">
							<h3 className="text-lg font-semibold text-amber-800 mb-2">
								Submission Not Available
							</h3>
							<p className="text-sm text-amber-700">{eventGuard.blockReason}</p>
						</div>
					</Card>
				)}

				<Card className="px-6 py-6 border-gray-200 shadow-sm">
					<form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
						<div className="space-y-5">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
								<Field>
									<FieldLabel htmlFor="title">
										Project Name <span className="text-red-500">*</span>
									</FieldLabel>
									<Input
										id="title"
										{...register("title")}
										className="py-5"
										placeholder="Enter your project name"
										type="text"
									/>
									{errors.title && <ErrorMessage error={errors.title.message} />}
								</Field>

								<Field>
									<FieldLabel htmlFor="area_id">
										Project Area <span className="text-red-500">*</span>
									</FieldLabel>
									<ProjectAreaSelection
										control={control}
										error={errors.area_id?.message}
									/>
								</Field>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-5 mb-4">
								<ProjectTypeSelection
									control={control}
									error={errors.project_type?.message}
								/>

								<MajorsSelection
									control={control}
									error={errors.eligible_majors?.message}
								/>

								<Field>
									<FieldLabel htmlFor="max_students">
										Maximum Students <span className="text-red-500">*</span>
									</FieldLabel>
									<Input
										id="max_students"
										{...register("max_students")}
										className="py-5"
										min={2}
										max={4}
										placeholder="Enter maximum number of students"
										type="number"
									/>
									{errors.max_students && (
										<ErrorMessage error={errors.max_students.message} />
									)}
								</Field>
							</div>
						</div>

						<Field>
							<FieldLabel htmlFor="description">
								Project Description <span className="text-red-500">*</span>
							</FieldLabel>
							<Textarea
								id="description"
								{...register("description")}
								className="min-h-30 resize-none"
								placeholder="Describe your project, its objectives, scope, and expected outcomes"
							/>
							{errors.description && (
								<ErrorMessage error={errors.description.message} />
							)}
						</Field>

						<FileUpload
							ref={fileUploadRef}
							control={control}
							error={errors.fileUrl?.message}
						/>

						<div className="flex flex-col sm:flex-row items-center justify-end gap-3 mt-5">
							<Button
								type="submit"
								disabled={isSubmitting || isEventBlocked}
								className="hover:cursor-pointer w-full sm:w-fit order-1 sm:order-2 bg-primary-700 hover:bg-primary-700/80 hover:text-white text-white"
								variant="outline">
								<span>{isSubmitting ? "Submitting..." : "Submit Proposal"}</span>
								{isSubmitting ? (
									<IconLoader className="animate-spin" />
								) : (
									<IconSend />
								)}
							</Button>
						</div>
					</form>
				</Card>
		</>
	);
}
