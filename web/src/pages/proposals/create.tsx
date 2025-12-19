import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	MultiSelect,
	MultiSelectContent,
	MultiSelectGroup,
	MultiSelectItem,
	MultiSelectTrigger,
	MultiSelectValue,
} from "@/components/ui/multi-select";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import RootLayout from "@/layouts/RootLayout";
import { useRoleCheck } from "@/lib/utils";
import { IconSend } from "@tabler/icons-react";
import { AlertCircle } from "lucide-react";
import UnAuthorized from "../UnAuthorized";

export default function CreateProposalPage() {
	useHeaderInitializer("MIIT | Project Proposal", "Create Project Proposal");

	const supervisors = [
		{ id: "sup001", name: "Daw Khaine Aye San" },
		{ id: "sup002", name: "Dr. Aye Aye Kyaw" },
		{ id: "sup003", name: "Daw Saw Win" },
		{ id: "sup004", name: "Dr. Sin Thira Myint" },
		{ id: "sup005", name: "Daw Zarchi" },
	];

	const members = [
		{ id: "mem001", name: "Mg Ye Min Aung" },
		{ id: "mem002", name: "Mg Khant Zaw Phyo" },
		{ id: "mem003", name: "Mg Aung Paing Min" },
		{ id: "mem004", name: "Mg Min Myat Thaw" },
	];

	if (!useRoleCheck("Student")) return <UnAuthorized />;

	return (
		<RootLayout>
			<Card className="mx-6 shadow-2xs px-6 pb-6">
				<div className="space-y-1 mb-3">
					<h3 className="text-[15px] font-semibold">
						Project Proposal Details
					</h3>
					<p className="text-sm text-muted-foreground">
						Fill in all required information for your project submission
					</p>
				</div>

				<div className="grid grid-cols-1 @xl/main:grid-cols-2 @5xl/main:grid-cols-2 gap-6">
					<div className="space-y-5">
						<Field>
							<FieldLabel htmlFor="title"> Project Name *</FieldLabel>
							<Input
								id="title"
								className="py-5 placeholder:font-normal placeholder:text-[14px] placeholder:text-muted-foreground/80"
								placeholder="Enter your project name"
								type="text"
							/>
							<div className="flex items-center gap-2 text-sm text-red-600">
								<AlertCircle className="h-4 w-4" />
								Project title is required
							</div>
						</Field>

						<Field>
							<FieldLabel htmlFor="supervisor">Project Supervisor *</FieldLabel>
							<Select value={""}>
								<SelectTrigger
									id="supervisor"
									className="py-5">
									<SelectValue placeholder="Choose your supervisor" />
								</SelectTrigger>
								<SelectContent>
									{supervisors.map((supervisor) => (
										<SelectItem
											key={supervisor.id}
											value={supervisor.id}>
											{supervisor.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<div className="flex items-center gap-2 text-sm text-red-600">
								<AlertCircle className="h-4 w-4" />
								Supervisor should not be empty
							</div>
						</Field>

						<Field>
							<FieldLabel htmlFor="members">Team Members *</FieldLabel>
							<MultiSelect>
								<MultiSelectTrigger
									id="members"
									className="w-full py-2.5">
									<MultiSelectValue placeholder="Select your team members..." />
								</MultiSelectTrigger>
								<MultiSelectContent className="overflow-auto">
									<MultiSelectGroup>
										{members.map((member) => (
											<MultiSelectItem
												key={member.id}
												value={member.id}>
												{member.name}
											</MultiSelectItem>
										))}
									</MultiSelectGroup>
								</MultiSelectContent>
							</MultiSelect>
							<div className="flex items-center gap-2 text-sm text-red-600">
								<AlertCircle className="h-4 w-4" />
								Select at least two members
							</div>
						</Field>
					</div>

					<div className="space-y-5">
						<Field>
							<FieldLabel htmlFor="description">
								Project Description *
							</FieldLabel>
							<Textarea
								id="description"
								className="min-h-[228px] placeholder:font-normal placeholder:text-[14px] placeholder:text-muted-foreground/80"
								placeholder="Describe your project, its objectives, scope, and expected outcomes"
							/>
							<div className="flex items-center gap-2 text-sm text-red-600">
								<AlertCircle className="h-4 w-4" />
								Project description is required
							</div>
						</Field>
					</div>
				</div>

				<div className="my-3">
					<FieldLabel htmlFor="supervisor">
						Project Documents (PDF, DOC, PPT) *
					</FieldLabel>
					<div className="border-3 my-3 border-dotted min-h-32 rounded-lg"></div>
					<div className="flex items-center gap-2 text-sm text-red-600">
						<AlertCircle className="h-4 w-4" />
						Only allowed files can be uploaded
					</div>
				</div>
				<div className="flex items-center ml-auto gap-x-3">
					<Button
						className="hover:cursor-pointer"
						onClick={() => alert("Downloading...")}
						variant={"outline"}>
						<span>Clear Form</span>
					</Button>
					<Button
						className="hover:cursor-pointer bg-cherry-pie-950 hover:bg-cherry-pie-950/80 hover:text-white text-white"
						onClick={() => alert("Downloading...")}
						variant={"outline"}>
						<IconSend />
						<span>Submit Proposal</span>
					</Button>
				</div>
			</Card>
		</RootLayout>
	);
}
