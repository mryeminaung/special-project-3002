import api from "@/api/api";
import ErrorMessage from "@/components/error-message";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { HasRole } from "@/lib/utils";
import { useAuthStore } from "@/stores/use-auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconLoader, IconSend } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router";
import * as z from "zod";
import UnAuthorized from "../../auth/un-authorized";
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

	student_id: z.number(),

	members: z
		.array(z.string())
		.min(2, "Select at least 2 team members")
		.max(3, "Maximum 3 members allowed"),

	fileUrl: z.string().min(1, "Proposal file is required"),
});

type User = {
	id: number;
	name: string;
	email: string;
};

type Faculty = User & { department: string };

export default function CreateProposalPage() {
	useHeaderInitializer("MIIT | Proposal Submission", "Create New Proposal");

	const [faculties, setFaculties] = useState<Faculty[]>([]);
	const [students, setStudents] = useState<User[]>([]);

	const loadInitialData = async () => {
		try {
			const [facultiesRes, studentsRes] = await Promise.all([
				api.get("faculties-for-proposal"),
				api.get("students-for-proposal"),
			]);
			setFaculties(facultiesRes.data);
			setStudents(studentsRes.data);
		} catch (error) {
			console.error("Failed to load proposal data", error);
		}
	};

	useEffect(() => {
		loadInitialData();
	}, []);

	const authUser = useAuthStore((state) => state.authUser);

	const {
		register,
		handleSubmit,
		control,
		setError,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<z.infer<typeof ProposalSchema>>({
		resolver: zodResolver(ProposalSchema),
		defaultValues: {
			title: "",
			description: "",
			fileUrl: "",
			members: [],
			student_id: authUser?.id,
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
			const res = await api.post("/proposals/create", formattedData);
			if (res.status === 201) {
				navigate("/project-proposals/my-proposals");
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

	const clearForm = async () => {
		reset();
		await fileUploadRef.current?.clear();
	};

	if (!HasRole("Student")) return <UnAuthorized />;

	return (
		<>
			<Toaster />
			<div className="mx-auto max-w-7xl">
				<div className="space-y-1 mb-5">
					<h3 className="text-2xl font-semibold">Submit Your Proposal</h3>
					<p className="text-base text-muted-foreground">
						Complete the form below to submit your academic project proposal for
						review
					</p>
				</div>

				<Card className="px-6 py-6 border-gray-200 shadow-sm">
					<form
						autoComplete="off"
						onSubmit={handleSubmit(onSubmit)}>
						<div className="space-y-5">
							{/* project name */}
							<Field>
								<FieldLabel
									htmlFor="title"
									className="md:text-base">
									Project Name <span className="text-red-500">*</span>
								</FieldLabel>
								<Input
									id="title"
									{...register("title")}
									className="py-5 md:text-base placeholder:font-normal  placeholder:text-muted-foreground/80"
									placeholder="Enter your project name"
									type="text"
								/>
								{errors.title && <ErrorMessage error={errors.title.message} />}
							</Field>

							{/* project description */}
							<Field>
								<FieldLabel
									htmlFor="description"
									className="md:text-base">
									Project Description <span className="text-red-500">*</span>
								</FieldLabel>
								<Textarea
									id="description"
									{...register("description")}
									className="min-h-48 md:text-base placeholder:font-normal  placeholder:text-muted-foreground/80"
									placeholder="Describe your project, its objectives, scope, and expected outcomes"
								/>
								{errors.description && (
									<ErrorMessage error={errors.description.message} />
								)}
							</Field>

							{/* supervisor selection */}
							<SupervisorSelection
								control={control}
								supervisors={faculties}
								error={errors.supervisor_id?.message}
							/>

							{/* team member selection */}
							<MembersSelection
								control={control}
								members={students}
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
			</div>
		</>
	);
}
