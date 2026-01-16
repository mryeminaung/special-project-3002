import api from "@/api/api";
import ErrorMessage from "@/components/error-message";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { HasRole } from "@/lib/utils";
import { useAuthUserStore } from "@/stores/useAuthUserStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconLoader, IconSend } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import * as z from "zod";
import UnAuthorized from "../../UnAuthorized";
import FileUpload from "../components/file-upload";
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
};

export default function CreateProposalPage() {
	useHeaderInitializer("MIIT | Proposal Submission", "Create New Proposal");

	const [faculties, setFaculties] = useState<User[]>([]);
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

	const authUser = useAuthUserStore((state) => state.authUser);

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
			fileUrl: "",
			members: [],
			student_id: authUser.id,
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
			members: [...data.members.map((id) => parseInt(id, 10)), authUser.id],
			supervisor_id: parseInt(data.supervisor_id, 10),
		};
		const res = await api.post("/proposals/create", formattedData);
		if (res.status === 200) {
			navigate("/dashboard");
		}
	};

	const clearForm = async () => {
		reset();
		await fileUploadRef.current?.clear();
	};

	if (!HasRole("Student")) return <UnAuthorized />;

	return (
		<>
			<div className="mx-auto max-w-7xl px-4">
				<div className="space-y-1 mb-5">
					<h3 className="text-2xl font-semibold">
						Submit Your Project Proposal
					</h3>
					<p className="text-base text-muted-foreground">
						Complete the form below to submit your academic project proposal for
						review
					</p>
				</div>

				<Card className="px-6 pb-6 border-gray-200 shadow-sm">
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
									supervisors={faculties}
									error={errors.supervisor_id?.message}
								/>

								<MembersSelection
									control={control}
									members={students}
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
		</>
	);
}
