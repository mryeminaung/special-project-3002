import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEventGuard } from "@/hooks/use-event-guard";
import { useRoleChecker } from "@/hooks/use-role-checker";
import { useEventStore } from "@/stores/use-event-store";
import {
	IconCalendar,
	IconEdit,
	IconTrash,
	IconCheck,
	IconX,
} from "@tabler/icons-react";
import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { formatDate } from "@/lib/date";
import type { EventType } from "../events.type";
import EventSelectionModal from "./event-selection-modal";

type EventCardProps = {
	eventType: EventType;
	title: string;
	icon?: React.ReactNode;
};

export default function EventCard({ eventType, title, icon }: EventCardProps) {
	const isEnrollmentOpen = useEventStore(
		(state) => state.enrollmentByEvent[eventType],
	);
	const deleteEventConfiguration = useEventStore(
		(state) => state.deleteEventConfiguration,
	);

	const { isStudent, isIC, isFaculty } = useRoleChecker();
	const { canSubmit, configuration } = useEventGuard(eventType);

	const [confirmDelete, setConfirmDelete] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const canCreateProposal = isEnrollmentOpen && isStudent && canSubmit;
	const canCreateFacultyProposal = isEnrollmentOpen && isFaculty && !isIC && canSubmit;

	async function handleDelete() {
		try {
			setIsDeleting(true);
			await deleteEventConfiguration(eventType);
			toast.success("Event details deleted.");
			setConfirmDelete(false);
		} catch {
			toast.error("Failed to delete event details.");
		} finally {
			setIsDeleting(false);
		}
	}

	return (
		<div
			className={`h-full flex flex-col rounded-xl border bg-card shadow-sm transition-all duration-200 hover:shadow-md border-l-4 ${
				isEnrollmentOpen ? "border-l-green-500" : "border-l-red-400"
			}`}>
			{/* Header */}
			<div className="flex items-center gap-3 p-5 pb-4">
				<div
					className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
						isEnrollmentOpen
							? "bg-green-100 text-green-600"
							: "bg-red-100 text-red-500"
					}`}>
					{icon}
				</div>
				<div className="flex-1 min-w-0">
					<h3 className="text-sm font-semibold text-foreground truncate">{title}</h3>
				</div>
				<Badge
					variant="outline"
					className={`shrink-0 text-xs ${
						isEnrollmentOpen
							? "bg-green-50 text-green-700 border-green-200"
							: "bg-red-50 text-red-600 border-red-200"
					}`}>
					{isEnrollmentOpen ? "Active" : "Closed"}
				</Badge>
			</div>

			<hr className="border-border mx-5" />

			{/* Event info — visible to all roles */}
			<div className="flex-1 p-5 py-4">
				{configuration ? (
					<div className="flex flex-col gap-2">
						<p className="text-sm font-medium text-foreground line-clamp-1">
							{configuration.title}
						</p>
						<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
							<IconCalendar size={13} className="text-primary-600 shrink-0" />
							<span>
								{formatDate(configuration.startDate)} — {formatDate(configuration.endDate)}
							</span>
						</div>
						{configuration.description && (
							<p className="text-xs text-muted-foreground line-clamp-2 mt-1">
								{configuration.description}
							</p>
						)}
					</div>
				) : (
					<p className="text-xs text-muted-foreground italic">
						{isEnrollmentOpen
							? "No event details configured yet."
							: "This event is currently closed."}
					</p>
				)}
			</div>

			{/* Actions */}
			<div className="p-5 pt-0 flex flex-col gap-2">
				{/* IC actions */}
				{isIC && isEnrollmentOpen && (
					<>
						{!configuration ? (
							<EventSelectionModal
								eventType={eventType}
								eventTitle={title}
								mode="create">
								<button
									type="button"
									className="w-full cursor-pointer rounded-lg bg-primary-600 px-4 py-2 text-xs font-medium text-white transition-all hover:bg-primary-700">
									Set Event Details
								</button>
							</EventSelectionModal>
						) : (
							<>
								{confirmDelete ? (
									<div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
										<p className="flex-1 text-xs text-red-700 font-medium">
											Delete event details?
										</p>
										<button
											onClick={handleDelete}
											disabled={isDeleting}
											className="flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-50">
											<IconCheck size={12} />
											{isDeleting ? "Deleting…" : "Yes"}
										</button>
										<button
											onClick={() => setConfirmDelete(false)}
											className="flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted">
											<IconX size={12} />
											No
										</button>
									</div>
								) : (
									<div className="flex gap-2">
										<EventSelectionModal
											eventType={eventType}
											eventTitle={title}
											mode="edit"
											initialValues={configuration}>
											<Button
												variant="outline"
												size="sm"
												className="flex-1 gap-1.5 text-xs">
												<IconEdit size={13} />
												Edit
											</Button>
										</EventSelectionModal>
										<Button
											variant="outline"
											size="sm"
											onClick={() => setConfirmDelete(true)}
											className="flex-1 gap-1.5 text-xs text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
											<IconTrash size={13} />
											Delete
										</Button>
									</div>
								)}
							</>
						)}
					</>
				)}

				{/* Student actions */}
				{isStudent && isEnrollmentOpen && configuration && (
					<>
						<Link to={`/proposals/new/student?event=${eventType}`}>
							<Button
								size="sm"
								className={`w-full text-xs ${
									canCreateProposal
										? "bg-primary-600 hover:bg-primary-700 text-white"
										: "bg-muted text-muted-foreground cursor-not-allowed pointer-events-none"
								}`}>
								Create Proposal
							</Button>
						</Link>
						<Link to="/proposals/faculties">
							<Button size="sm" variant="outline" className="w-full text-xs">
								Browse Faculty Proposals
							</Button>
						</Link>
					</>
				)}

				{/* Faculty actions */}
				{isFaculty && !isIC && isEnrollmentOpen && configuration && (
					<Link to={`/proposals/new/faculty?event=${eventType}`}>
						<Button
							size="sm"
							className={`w-full text-xs ${
								canCreateFacultyProposal
									? "bg-primary-600 hover:bg-primary-700 text-white"
									: "bg-muted text-muted-foreground cursor-not-allowed pointer-events-none"
							}`}>
							Create Proposal
						</Button>
					</Link>
				)}
			</div>
		</div>
	);
}
