import PageWrapper from "@/components/common/page-wrapper";
import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { PAGE_META, HEADINGS } from "@/constants/navigation";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { HasRole } from "@/lib/utils";
import { useEventStore } from "@/stores/use-event-store";
import {
	IconTrash,
	IconUser,
	IconUsers,
	IconUsersGroup,
} from "@tabler/icons-react";
import { useEffect } from "react";
import EventCard from "./components/event-card";
import type { EventType } from "./events.type";

const eventTypeLabels: Record<EventType, string> = {
	special: "Special Project",
	capstone: "Capstone Project",
	"master-thesis": "Master/Thesis Project",
};

const orderedEventTypes: EventType[] = ["special", "capstone", "master-thesis"];

function formatDate(dateValue: string) {
	if (!dateValue) {
		return "-";
	}

	return new Date(`${dateValue}T00:00:00`).toLocaleDateString();
}

export default function EventsPage() {
	useHeaderInitializer(PAGE_META.events.title, PAGE_META.events.subtitle);
	const isIC = HasRole("ic");

	const eventConfigurations = useEventStore(
		(state) => state.eventConfigurations,
	);
	const deleteEventConfiguration = useEventStore(
		(state) => state.deleteEventConfiguration,
	);
	const fetchEventStatuses = useEventStore((state) => state.fetchEventStatuses);

	useEffect(() => {
		void fetchEventStatuses();
	}, [fetchEventStatuses]);

	const createdEvents = orderedEventTypes
		.map((eventType) => ({
			eventType,
			label: eventTypeLabels[eventType],
			configuration: eventConfigurations[eventType],
		}))
		.filter((eventItem) => !!eventItem.configuration);

	return (
		<PageWrapper>
			<Heading
				title={HEADINGS.events.title}
				description={HEADINGS.events.description}
			/>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-5">
				<EventCard
					eventType="special"
					title="Special Project"
					description="Announce and manage Special Project events, including submission deadlines and requirements."
					statusText="The registration window for Special Project is currently closed. Check back later or contact your academic advisor."
					icon={
						<IconUsersGroup
							color="white"
							size={50}
						/>
					}
				/>
				<EventCard
					eventType="capstone"
					title="Capstone Project"
					description="Create Capstone Project event announcements, track milestones, and share important dates."
					statusText="The registration window for Capstone Project is currently closed. Check back later or contact your academic advisor."
					icon={
						<IconUsers
							color="white"
							size={50}
						/>
					}
				/>
				<EventCard
					eventType="master-thesis"
					title="Master/Thesis Project"
					description="Manage Master/Thesis Project events, set deadlines, and provide project guidelines."
					statusText="The registration window for Master/Thesis Project is currently closed. Check back later or contact your academic advisor."
					icon={
						<IconUser
							color="white"
							size={50}
						/>
					}
				/>
			</div>

			<section className="mt-8 space-y-4">
				<h2 className="text-lg font-semibold text-neutral-900">
					Event Information
				</h2>

				{createdEvents.length === 0 && (
					<div className="rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-4 text-sm text-neutral-600">
						No event information created yet. Select an active event card and
						save its details.
					</div>
				)}

				{createdEvents.length > 0 && (
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
						{createdEvents.map((eventItem) => (
							<div
								key={eventItem.eventType}
								className="rounded-lg border bg-white p-4 shadow-sm">
								<div className="flex items-start justify-between gap-3">
									<p className="text-base font-semibold text-neutral-900">
										{eventItem.configuration?.title}
									</p>
									{isIC && (
										<Button
											type="button"
											variant="destructive"
											size="sm"
											className="h-8 px-2.5"
											onClick={() =>
												deleteEventConfiguration(eventItem.eventType)
											}>
											<IconTrash size={14} />
										</Button>
									)}
								</div>
								<p className="mt-2 text-xs font-medium tracking-wide text-neutral-500">
									Description
								</p>
								<p className="text-sm text-neutral-700">
									{eventItem.configuration?.description}
								</p>

								<p className="mt-3 text-xs font-medium tracking-wide text-neutral-500">
									Start Date
								</p>
								<p className="text-sm text-neutral-700">
									{formatDate(eventItem.configuration?.startDate ?? "")}
								</p>

								<p className="mt-3 text-xs font-medium tracking-wide text-neutral-500">
									End Date
								</p>
								<p className="text-sm text-neutral-700">
									{formatDate(eventItem.configuration?.endDate ?? "")}
								</p>
							</div>
						))}
					</div>
				)}
			</section>
		</PageWrapper>
	);
}
