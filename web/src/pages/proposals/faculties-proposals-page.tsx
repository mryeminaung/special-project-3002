import Heading from "@/components/heading";
import PageWrapper from "@/components/page-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/stores/use-auth-store";
import {
	AppWindowIcon,
	CheckCircle2,
	Clock3,
	UserRound,
	Users,
} from "lucide-react";
import { useState } from "react";

type ProjectTypeFilter = "all" | "special" | "capstone" | "master-thesis";

type FacultyProposal = {
	title: string;
	description: string;
	area_id: number;
	slug: string;
	supervisor_name: string;
	supervisor_title: "Supervisor";
	submitted_at: string;
	fileUrl: string;
	status: "pending" | "approved" | "rejected";
	project_type: "special" | "capstone" | "master/thesis";
	type: "faculty";
	eligible_majors: "CSE" | "ECE" | "Both";
	max_students: number;
	join_request_status?: "none" | "pending";
};

const FACULTY_PROPOSALS_MOCK: FacultyProposal[] = [
	{
		title: "AI-Powered Smart Attendance",
		description:
			"Face recognition based classroom attendance system with anti-spoofing validation.",
		area_id: 1,
		slug: "ai-powered-smart-attendance",
		supervisor_name: "Dr. Thiri Aung",
		supervisor_title: "Supervisor",
		submitted_at: "2026-03-15",
		fileUrl: "https://example.com/proposals/ai-powered-smart-attendance.pdf",
		status: "approved",
		project_type: "special",
		type: "faculty",
		eligible_majors: "Both",
		max_students: 3,
		join_request_status: "pending",
	},
	{
		title: "E-Learning Analytics Dashboard",
		description:
			"A learning analytics platform to monitor student engagement and performance.",
		area_id: 2,
		slug: "e-learning-analytics-dashboard",
		supervisor_name: "U Min Khant",
		supervisor_title: "Supervisor",
		submitted_at: "2026-03-18",
		fileUrl: "https://example.com/proposals/e-learning-analytics-dashboard.pdf",
		status: "pending",
		project_type: "capstone",
		type: "faculty",
		eligible_majors: "CSE",
		max_students: 4,
		join_request_status: "none",
	},
	{
		title: "Secure Medical Record Exchange",
		description:
			"Blockchain-backed secure data exchange for inter-hospital medical records.",
		area_id: 3,
		slug: "secure-medical-record-exchange",
		supervisor_name: "Dr. Su Hnin",
		supervisor_title: "Supervisor",
		submitted_at: "2026-03-12",
		fileUrl: "https://example.com/proposals/secure-medical-record-exchange.pdf",
		status: "approved",
		project_type: "master/thesis",
		type: "faculty",
		eligible_majors: "ECE",
		max_students: 2,
		join_request_status: "none",
	},
	{
		title: "IoT Campus Energy Optimizer",
		description:
			"IoT sensors and predictive scheduling to reduce campus energy waste.",
		area_id: 4,
		slug: "iot-campus-energy-optimizer",
		supervisor_name: "U Ko Ko Lwin",
		supervisor_title: "Supervisor",
		submitted_at: "2026-03-10",
		fileUrl: "https://example.com/proposals/iot-campus-energy-optimizer.pdf",
		status: "rejected",
		project_type: "special",
		type: "faculty",
		eligible_majors: "ECE",
		max_students: 3,
		join_request_status: "none",
	},
	{
		title: "Credit Risk Prediction Engine",
		description:
			"Machine learning model and explainable AI interface for credit scoring.",
		area_id: 5,
		slug: "credit-risk-prediction-engine",
		supervisor_name: "Daw Nandar Yi",
		supervisor_title: "Supervisor",
		submitted_at: "2026-03-21",
		fileUrl: "https://example.com/proposals/credit-risk-prediction-engine.pdf",
		status: "pending",
		project_type: "capstone",
		type: "faculty",
		eligible_majors: "Both",
		max_students: 4,
		join_request_status: "none",
	},
	{
		title: "Adaptive Bengali-Myanmar Translator",
		description:
			"Neural translation system with domain adaptation for educational materials.",
		area_id: 6,
		slug: "adaptive-bengali-myanmar-translator",
		supervisor_name: "Dr. Kyaw Sint",
		supervisor_title: "Supervisor",
		submitted_at: "2026-03-27",
		fileUrl:
			"https://example.com/proposals/adaptive-bengali-myanmar-translator.pdf",
		status: "approved",
		project_type: "master/thesis",
		type: "faculty",
		eligible_majors: "CSE",
		max_students: 2,
		join_request_status: "none",
	},
];

const OCCUPIED_SLOTS_BY_PROPOSAL: Record<string, number> = {
	"ai-powered-smart-attendance": 1,
	"e-learning-analytics-dashboard": 2,
	"secure-medical-record-exchange": 1,
	"iot-campus-energy-optimizer": 0,
	"credit-risk-prediction-engine": 3,
	"adaptive-bengali-myanmar-translator": 1,
};

export default function FacultiesProposalsPage() {
	const [activeTab, setActiveTab] = useState<ProjectTypeFilter>("all");
	const authUser = useAuthStore((state) => state.authUser);

	const userMajorNormalized = (authUser?.major ?? "").toLowerCase();

	const userMajorCategory: "CSE" | "ECE" | null =
		userMajorNormalized.includes("cse") ||
		userMajorNormalized.includes("computer science")
			? "CSE"
			: userMajorNormalized.includes("ece") ||
				  userMajorNormalized.includes("electronic") ||
				  userMajorNormalized.includes("electronics")
				? "ECE"
				: null;

	const filteredProposals = FACULTY_PROPOSALS_MOCK.filter((proposal) => {
		if (activeTab === "all") {
			return proposal.type === "faculty";
		}

		if (activeTab === "master-thesis") {
			return proposal.project_type === "master/thesis";
		}

		return proposal.project_type === activeTab;
	});

	return (
		<PageWrapper>
			<div className="flex flex-col lg:flex-row gap-2 lg:items-center justify-between">
				<Heading title="Browse Faculties Proposals" />
				<Tabs
					value={activeTab}
					onValueChange={(value) => setActiveTab(value as ProjectTypeFilter)}>
					<TabsList className="py-5 space-x-3">
						<TabsTrigger
							className="px-5 py-4"
							value="all">
							<AppWindowIcon />
							All
						</TabsTrigger>
						<TabsTrigger
							className="px-5 py-4"
							value="special">
							<AppWindowIcon />
							Special
						</TabsTrigger>
						<TabsTrigger
							className="px-5 py-4"
							value="capstone">
							<AppWindowIcon />
							Capstone
						</TabsTrigger>
						<TabsTrigger
							className="px-5 py-4"
							value="master-thesis">
							<AppWindowIcon />
							Master/Thesis
						</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>

			<div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
				{filteredProposals.map((proposal) => {
					const occupiedSlots = OCCUPIED_SLOTS_BY_PROPOSAL[proposal.slug] ?? 0;
					const availableSlots = Math.max(
						proposal.max_students - occupiedSlots,
						0,
					);
					const isMajorEligible =
						proposal.eligible_majors === "Both" ||
						userMajorCategory === proposal.eligible_majors;
					const isTeamFull = availableSlots === 0;
					const isRequestPending = proposal.join_request_status === "pending";
					const disableJoin =
						isTeamFull || !isMajorEligible || isRequestPending;

					const buttonLabel = isTeamFull
						? "Team Full"
						: isRequestPending
							? "Request Pending"
							: !isMajorEligible
								? "Not Eligible For Your Major"
								: "Request to Join";

					const ButtonIcon = isTeamFull
						? CheckCircle2
						: isRequestPending
							? Clock3
							: null;

					const capacityState = isTeamFull ? "Full" : null;

					return (
						<Card
							key={proposal.slug}
							className="rounded-2xl border border-slate-200 shadow-none bg-slate-50/50">
							<CardContent className="p-3 space-y-3">
								<div className="flex items-start justify-between gap-3">
									<div className="flex items-center gap-3 min-w-0">
										<div className="rounded-full bg-slate-200 p-2.5 text-blue-600 mt-0.5">
											<UserRound className="size-5" />
										</div>
										<div className="min-w-0">
											<p className="font-semibold text-sm leading-none truncate">
												{proposal.supervisor_name}
											</p>
											<p className="text-muted-foreground text-sm">
												{proposal.supervisor_title}
											</p>
										</div>
									</div>
									<Badge
										variant="secondary"
										className="capitalize px-2.5 py-0.5 text-[11px] bg-slate-200 text-slate-700 border-0">
										{proposal.project_type === "master/thesis"
											? "Master/Thesis"
											: proposal.project_type}
									</Badge>
								</div>

								<h3 className="text-lg font-semibold leading-tight line-clamp-2">
									{proposal.title}
								</h3>

								<p className="text-slate-600 text-sm leading-relaxed line-clamp-2">
									{proposal.description}
								</p>

								<div className="rounded-xl bg-slate-200 px-4 py-3 flex items-center justify-between">
									<div className="flex items-center gap-2 text-slate-700">
										<Users className="size-5" />
										<span className="text-sm">Team capacity</span>
									</div>
									<div className="text-base font-semibold">
										{occupiedSlots}/{proposal.max_students}
										{capacityState && (
											<span className="text-red-500 font-medium ml-2 text-sm">
												{capacityState}
											</span>
										)}
									</div>
								</div>

								<div>
									<Button
										className="w-full h-10 text-sm"
										type="button"
										disabled={disableJoin}
										variant={disableJoin ? "outline" : "default"}>
										{ButtonIcon ? <ButtonIcon className="size-4" /> : null}
										{buttonLabel}
									</Button>
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>

			{filteredProposals.length === 0 && (
				<div className="mt-6 rounded-md border border-dashed p-8 text-center text-muted-foreground">
					No faculty proposals found for the selected project type.
				</div>
			)}
		</PageWrapper>
	);
}
