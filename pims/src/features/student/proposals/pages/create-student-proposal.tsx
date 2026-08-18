import { createProposal } from "@/features/proposals/services/proposal.service";
import { PAGE_META, HEADINGS } from "@/constants/navigation";
import ErrorMessage from "@/components/error-message";
import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEventGuard } from "@/hooks/use-event-guard";
import { useActiveAcademicYear } from "@/hooks/use-active-academic-year";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { useAuthStore } from "@/stores/use-auth-store";
import { useEventStore } from "@/stores/use-event-store";
import type { EventType } from "@/features/events";
import { FileUpload, ProjectAreaSelection, ProjectTypeSelection } from "@/features/proposals";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconLoader, IconSend } from "@tabler/icons-react";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router";
import * as z from "zod";
import MembersSelection from "../components/members-selection";
import SupervisorSelection from "../components/supervisor-selection";

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
	project_type: z.string().min(1, "Please select a project type"),
	student_id: z.number(),
	area_id: z.number(),
	type: z.enum(["student", "faculty"]),
	members: z
		.array(z.string())
		.min(2, "Select at least 2 team members")
		.max(3, "Maximum 3 members allowed"),

	fileUrl: z.string().min(1, "Proposal file is required"),
});

export default function CreateStudentProposalPage() {
	useHeaderInitializer(PAGE_META.createProposal.title, PAGE_META.createProposal.subtitle);

	const authUser = useAuthStore((state) => state.authUser);

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
			type: "student",
			project_type: "",
			members: [],
			student_id: authUser?.id,
			area_id: 1,
			supervisor_id: "",
		},
		mode: "onChange",
	});

	type FileUploadHandle = { clear: () => Promise<void> };
	const fileUploadRef = useRef<FileUploadHandle | null>(null);

	const navigate = useNavigate();

	const onSubmit = async (data: z.infer<typeof ProposalSchema>) => {
		const formattedData = {
			...data,
			members: [
				...data.members.map((id) => parseInt(id, 10)),
				authUser?.id,
			],
			supervisor_id: parseInt(data.supervisor_id, 10),
		};

		try {
			const res = await createProposal(formattedData);
			if (res.status === 201) {
				navigate("/proposals/me");
			}
		} catch (error: any) {
			const validationErrors = error.response?.data?.errors;
			console.log(validationErrors);
			if (error.response.data.message)
				toast.error(error.response.data.message);

			if (validationErrors?.title) {
				setError("title", {
					type: "manual",
					message: validationErrors.title,
				});
			}
		}
	};

	const [searchParams] = useSearchParams();
	const eventType = (searchParams.get("event") as EventType) || null;
	const eventGuard = useEventGuard(eventType ?? "special");
	const fetchEventStatuses = useEventStore((state) => state.fetchEventStatuses);
	const isLoadingStatuses = useEventStore((state) => state.isLoadingStatuses);
	const { hasActiveYear, isLoading: isLoadingYear } = useActiveAcademicYear();

	useEffect(() => {
		void fetchEventStatuses();
	}, [fetchEventStatuses]);

	const isEventBlocked = eventType ? !eventGuard.canSubmit : false;
	const isYearBlocked = !isLoadingYear && !hasActiveYear;

	return (
		<>
			<Toaster />
			<div className="space-y-1 mb-5">
					<Heading
						title={HEADINGS.createProposal.title}
						description="	Complete the form below to submit your academic project proposal for
							review"
					/>
				</div>

				{isYearBlocked && (
					<Card className="px-6 py-8 border-red-200 bg-red-50 shadow-sm mb-5">
						<div className="text-center">
							<h3 className="text-lg font-semibold text-red-800 mb-2">
								No Active Academic Year
							</h3>
							<p className="text-sm text-red-700">
								Proposal submissions are currently unavailable. Please contact the administrator to set an active academic year.
							</p>
						</div>
					</Card>
				)}

				{!isLoadingStatuses && isEventBlocked && (
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
							{/* Row 1: Project Name (wider) + Project Area */}
							<div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-5">
								<Field className="md:col-span-2">
									<FieldLabel htmlFor="title">
										Project Name{" "}
										<span className="text-red-500">*</span>
									</FieldLabel>
									<Input
										id="title"
										{...register("title")}
										className="py-5"
										placeholder="Enter your project name"
										type="text"
									/>
									{errors.title && (
										<ErrorMessage
											error={errors.title.message}
										/>
									)}
								</Field>
								<Field className="md:col-span-1">
									<FieldLabel htmlFor="area_id">
										Project Area{" "}
										<span className="text-red-500">*</span>
									</FieldLabel>
									<ProjectAreaSelection
										control={control}
										error={errors.area_id?.message}
									/>
								</Field>
							</div>

							{/* Row 2: Supervisor (wider) + Project Type */}
							<div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-5">
								<div className="md:col-span-2">
									<SupervisorSelection
										control={control}
										error={errors.supervisor_id?.message}
									/>
								</div>
								<div className="md:col-span-1">
									<ProjectTypeSelection
										control={control}
										error={errors.project_type?.message}
									/>
								</div>
							</div>

							{/* Project Description */}
							<Field>
								<FieldLabel htmlFor="description">
									Project Description{" "}
									<span className="text-red-500">*</span>
								</FieldLabel>
								<Textarea
									id="description"
									{...register("description")}
									className="min-h-30 resize-none"
									placeholder="Describe your project, its objectives, scope, and expected outcomes"
								/>
								{errors.description && (
									<ErrorMessage
										error={errors.description.message}
									/>
								)}
							</Field>

							{/* Team Member Selection */}
							<MembersSelection
								control={control}
								error={errors.members?.message}
							/>
						</div>

						<FileUpload
							ref={fileUploadRef}
							control={control}
							error={errors.fileUrl?.message}
						/>

						<div className="flex flex-col sm:flex-row items-center justify-end gap-3 mt-5">
							<Button
								type="submit"
								disabled={isSubmitting || isEventBlocked || isYearBlocked}
								className="hover:cursor-pointer w-full sm:w-fit order-1 sm:order-2 bg-primary-700 hover:bg-primary-700/80 hover:text-white text-white"
								variant={"outline"}
							>
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
		</>
	);
}
