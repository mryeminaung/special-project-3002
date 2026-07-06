import { Badge } from "@/components/ui/badge";
import { useRoleChecker } from "@/hooks/use-role-checker";
import { useEventStore } from "@/stores/use-event-store";
import { CircleX } from "lucide-react";
import { Link } from "react-router";
import type { EventType } from "../events.type";
import EventSelectionModal from "./event-selection-modal";

type EventCardProps = {
	eventType: EventType;
	title: string;
	description: string;
	statusText: string;
	icon?: React.ReactNode;
};

export default function EventCard({
	eventType,
	title,
	description,
	statusText,
	icon,
}: EventCardProps) {
	const isEnrollmentOpen = useEventStore(
		(state) => state.enrollmentByEvent[eventType],
	);
	const hasPreviousCreatedInfo = useEventStore(
		(state) => !!state.eventConfigurations[eventType],
	);
	const { isStudent, isIC, isFaculty } = useRoleChecker();
	let canCreateEventDetail = isEnrollmentOpen && isIC;
	let canApplyProposals = isEnrollmentOpen && isStudent;
	let canCreateProposal = isEnrollmentOpen && isFaculty && !isIC;

	return (
		<div
			className={`group relative min-w-70 rounded-xl border-neutral-200 bg-white p-3 py-5 shadow-sm transition-all duration-300 hover:shadow-lg border-t-4 ${
				isEnrollmentOpen ? "border-t-green-500" : "border-t-red-500"
			}`}>
			<Badge
				className={`absolute right-5 top-8 z-10 border-0 ${
					isEnrollmentOpen
						? "bg-green-100 text-green-700"
						: "bg-red-100 text-red-700"
				}`}>
				{isEnrollmentOpen ? "Active" : "Closed"}
			</Badge>

			<div className="mb-4 h-32 rounded-lg bg-primary-600 relative flex items-center justify-center overflow-hidden">
				<div className="absolute inset-0 bg-[url('/assets/top_background-J4V23-d-.png')] bg-cover bg-center bg-no-repeat"></div>
				{icon}
			</div>

			<div>
				<h3 className="font-display mb-2 text-xl font-semibold text-neutral-800 text-center">
					{title}
				</h3>

				{!isEnrollmentOpen && (
					<div className="bg-red-50 p-3 rounded-md flex items-start gap-x-3">
						<CircleX className="h-8 w-10 " />
						<div>
							<h3 className="text-md">Registration Closed</h3>
							<p className="text-sm">{statusText}</p>
						</div>
					</div>
				)}

				<div className={canApplyProposals ? "block" : "hidden"}>
					<div className="flex flex-col gap-y-3 text-center">
						<Link
							to={"/project-proposals/new/student"}
							className="cursor-pointer rounded-full bg-primary-600 px-5 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-primary-700 hover:shadow-md">
							Create a New Proposal
						</Link>
						<Link
							to={"/project-proposals/faculties"}
							className="cursor-pointer rounded-full bg-primary-600 px-5 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-primary-700 hover:shadow-md">
							Browse Faculty Proposals
						</Link>
					</div>
				</div>

				<div className={canCreateProposal ? "block" : "hidden"}>
					<div className="flex flex-col gap-y-3 text-center">
						<Link
							to={"/project-proposals/new/faculty"}
							className="cursor-pointer rounded-full bg-primary-600 px-5 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-primary-700 hover:shadow-md">
							Create a New Proposal
						</Link>
					</div>
				</div>

				<div className={canCreateEventDetail ? "block" : "hidden"}>
					<p className="mb-4 text-sm font-medium text-center text-neutral-600">
						{description}
					</p>
					<div className="flex items-center justify-center gap-3">
						<EventSelectionModal
							eventType={eventType}
							eventTitle={title}
							triggerText={
								hasPreviousCreatedInfo
									? "Already Created"
									: `Create Event Detail`
							}
							triggerDisabled={hasPreviousCreatedInfo}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
