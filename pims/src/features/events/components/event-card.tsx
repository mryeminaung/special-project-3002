import { Badge } from "@/components/ui/badge";
import { useEventGuard } from "@/hooks/use-event-guard";
import { useRoleChecker } from "@/hooks/use-role-checker";
import { useEventStore } from "@/stores/use-event-store";
import { CalendarIcon, CircleX } from "lucide-react";
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

function formatDate(dateStr: string) {
	if (!dateStr) return "";
	const d = dateStr.includes("T") ? new Date(dateStr) : new Date(`${dateStr}T00:00:00`);
	return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString();
}

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
	const { canSubmit, blockReason, configuration } = useEventGuard(eventType);

	const canCreateEventDetail = isEnrollmentOpen && isIC;
	const canApplyProposals = isEnrollmentOpen && isStudent && canSubmit;
	const canCreateProposal = isEnrollmentOpen && isFaculty && !isIC && canSubmit;

	return (
		<div
			className={`group relative min-w-70 rounded-xl border-neutral-200 bg-white p-3 py-5 shadow-sm transition-all duration-300 hover:shadow-lg border-t-4 ${
				isEnrollmentOpen ? "border-t-green-500" : "border-t-red-500"
			}`}
		>
			<Badge
				className={`absolute right-5 top-8 z-10 border-0 ${
					isEnrollmentOpen
						? "bg-green-100 text-green-700"
						: "bg-red-100 text-red-700"
				}`}
			>
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
							<h3 className="text-sm">Registration Closed</h3>
							<p className="text-[13px]">{statusText}</p>
						</div>
					</div>
				)}

				{isEnrollmentOpen && configuration && (
					<div className="bg-primary-50 border border-primary-200 p-3 rounded-md flex items-start gap-x-3 mb-3">
						<CalendarIcon className="h-5 w-5 text-primary-600 mt-0.5 shrink-0" />
						<div>
							<h3 className="text-sm font-medium text-primary-800">Submission Period</h3>
							<p className="text-[13px] text-primary-700">
								{formatDate(configuration.startDate)} — {formatDate(configuration.endDate)}
							</p>
						</div>
					</div>
				)}

				{isEnrollmentOpen && !canSubmit && blockReason && (isStudent || (isFaculty && !isIC)) && (
					<div className="bg-amber-50 border border-amber-200 p-3 rounded-md mb-3">
						<p className="text-[13px] text-amber-800">{blockReason}</p>
					</div>
				)}

				<div className={(isStudent && isEnrollmentOpen) ? "block" : "hidden"}>
					<div className="flex flex-col gap-y-3 text-center">
						<Link
							to={`/proposals/new/student?event=${eventType}`}
							className={`cursor-pointer rounded-full px-5 py-3 text-sm font-medium text-white transition-all duration-200 shadow-md ${
								canApplyProposals
									? "bg-primary-600 hover:bg-primary-700 hover:shadow-lg"
									: "bg-gray-400 cursor-not-allowed pointer-events-none"
							}`}
						>
							Create a New Proposal
						</Link>
						<Link
							to={"/proposals/faculties"}
							className="cursor-pointer rounded-full bg-primary-600 px-5 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-primary-700 hover:shadow-md"
						>
							Browse Faculty Proposals
						</Link>
					</div>
				</div>

				<div className={(isFaculty && !isIC && isEnrollmentOpen) ? "block" : "hidden"}>
					<div className="flex flex-col gap-y-3 text-center">
						<Link
							to={`/proposals/new/faculty?event=${eventType}`}
							className={`cursor-pointer rounded-full px-5 py-3 text-sm font-medium text-white transition-all duration-200 shadow-md ${
								canCreateProposal
									? "bg-primary-600 hover:bg-primary-700 hover:shadow-lg"
									: "bg-gray-400 cursor-not-allowed pointer-events-none"
							}`}
						>
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
