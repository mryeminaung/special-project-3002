import api from "@/api/api";
import ErrorMessage from "@/components/error-message";
import Heading from "@/components/heading";
import PageWrapper from "@/components/page-wrapper";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import UnAuthorized from "@/components/un-authorized";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { useRoleChecker } from "@/hooks/use-role-checker";
import { useAuthStore } from "@/stores/use-auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconLoader, IconSend } from "@tabler/icons-react";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router";
import * as z from "zod";
import FileUpload from "../../components/file-upload";
import { ProjectAreaSelection } from "../../components/project-area-selection";
import { ProjectTypeSelection } from "../../components/project-type-selection";
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
	useHeaderInitializer("MIIT | Proposal Submission", "Create New Proposal");

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
			members: [...data.members.map((id) => parseInt(id, 10)), authUser?.id],
			supervisor_id: parseInt(data.supervisor_id, 10),
		};

		try {
			const res = await api.post("/proposals", formattedData);
			if (res.status === 201) {
				navigate("/project-proposals/me");
			}
		} catch (error: any) {
			const validationErrors = error.response?.data?.errors;
			console.log(validationErrors);
			if (error.response.data.message) toast.error(error.response.data.message);

			if (validationErrors?.title) {
				setError("title", {
					type: "manual",
					message: validationErrors.title,
				});
			}
		}
	};

	const { isStudent } = useRoleChecker();
	if (!isStudent) return <UnAuthorized />;

	return (
		<>
			<Toaster />
			<PageWrapper>
				<div className="space-y-1 mb-5">
					<Heading
						title="Submit Your Proposal"
						description="	Complete the form below to submit your academic project proposal for
						review"
					/>
				</div>

				<Card className="px-6 py-6 border-gray-200 shadow-sm">
					<form
						autoComplete="off"
						onSubmit={handleSubmit(onSubmit)}>
						<div className="space-y-5">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
								{/* project name */}
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
									{errors.title && (
										<ErrorMessage error={errors.title.message} />
									)}
								</Field>
								{/* project area */}
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
							<div className="grid grid-cols-2 gap-x-10 gap-y-5">
								{/* supervisor selection */}
								<SupervisorSelection
									control={control}
									error={errors.supervisor_id?.message}
								/>

								{/* project type */}
								<ProjectTypeSelection
									control={control}
									error={errors.project_type?.message}
								/>
							</div>

							{/* project description */}
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

							{/* team member selection */}
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
								disabled={isSubmitting}
								className="hover:cursor-pointer w-full sm:w-fit order-1 sm:order-2 bg-primary-700 hover:bg-primary-700/80 hover:text-white text-white"
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
			</PageWrapper>
		</>
	);
}
