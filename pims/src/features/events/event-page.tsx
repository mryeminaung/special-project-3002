import Heading from "@/components/heading";
import { PAGE_META, HEADINGS } from "@/constants/navigation";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { useEventStore } from "@/stores/use-event-store";
import {
	IconUser,
	IconUsers,
	IconUsersGroup,
} from "@tabler/icons-react";
import { useEffect } from "react";
import EventCard from "./components/event-card";

const orderedEventTypes = [
	"special",
	"capstone",
	"master-thesis",
] as const;

const eventCards: Array<{
	eventType: "special" | "capstone" | "master-thesis";
	title: string;
	icon: React.ReactNode;
}> = [
	{
		eventType: "special",
		title: "Special Project",
		icon: <IconUsersGroup size={18} />,
	},
	{
		eventType: "capstone",
		title: "Capstone Project",
		icon: <IconUsers size={18} />,
	},
	{
		eventType: "master-thesis",
		title: "Master / Thesis Project",
		icon: <IconUser size={18} />,
	},
];

export default function EventsPage() {
	useHeaderInitializer(PAGE_META.events.title, PAGE_META.events.subtitle);

	const fetchEventStatuses = useEventStore((state) => state.fetchEventStatuses);

	useEffect(() => {
		void fetchEventStatuses();
	}, [fetchEventStatuses]);

	return (
		<>
			<Heading
				title={HEADINGS.events.title}
				description={HEADINGS.events.description}
			/>

			{/* Project Registration Section */}
			<section className="mt-6">
				<h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
					Project Registration
				</h2>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{eventCards.map((card) => (
						<EventCard
							key={card.eventType}
							eventType={card.eventType}
							title={card.title}
							icon={card.icon}
						/>
					))}
				</div>
			</section>
		</>
	);
}
