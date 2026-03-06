import Heading from "@/components/heading";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEventStore, type EventType } from "@/stores/use-event-store";
import { AppWindowIcon, SettingsIcon } from "lucide-react";
import { useState } from "react";

const projectLabels: Record<EventType, string> = {
	special: "Special Project",
	capstone: "Capstone Project",
	"master-thesis": "Master/Thesis Project",
};

export default function EventsSetting() {
	const [activeTab, setActiveTab] = useState<EventType>("special");
	const enrollmentByEvent = useEventStore((state) => state.enrollmentByEvent);
	const toggleEnrollmentWindow = useEventStore(
		(state) => state.toggleEnrollmentWindow,
	);

	const isEnrollmentOpen = enrollmentByEvent[activeTab];

	function handleToggleEnrollment() {
		toggleEnrollmentWindow(activeTab);
	}

	return (
		<section>
			<Heading
				title="Events Settings"
				variant="sm"
				description="Fine-tune each project type with dedicated controls, deadlines, and validation."
			/>

			<Tabs
				value={activeTab}
				onValueChange={(value) => setActiveTab(value as EventType)}
				className="mt-3">
				<TabsList className="py-5">
					<TabsTrigger
						className="px-5 py-4"
						value="special">
						<AppWindowIcon />
						Special Project
					</TabsTrigger>
					<TabsTrigger
						className="px-5 py-4"
						value="capstone">
						<AppWindowIcon />
						Capstone Project
					</TabsTrigger>
					<TabsTrigger
						className="px-5 py-4"
						value="master-thesis">
						<AppWindowIcon />
						Master/Thesis Project
					</TabsTrigger>
				</TabsList>
			</Tabs>

			<div className="mt-4 flex items-center justify-between rounded-xl border bg-muted/20 px-5 py-4">
				<div className="flex items-start gap-3">
					<span className="mt-0.5 rounded-md border bg-background p-1.5 text-muted-foreground">
						<SettingsIcon className="size-4" />
					</span>

					<div>
						<p className="text-base font-semibold">Enrollment Window</p>
						<p className="text-sm text-muted-foreground">
							{isEnrollmentOpen
								? `${projectLabels[activeTab]} enrollment is open. Students can submit and browse.`
								: `${projectLabels[activeTab]} enrollment is closed. Students cannot submit or browse.`}
						</p>
					</div>
				</div>

				<button
					type="button"
					role="switch"
					aria-checked={isEnrollmentOpen}
					aria-label={`Toggle ${projectLabels[activeTab]} enrollment window`}
					onClick={handleToggleEnrollment}
					className={`relative h-6 w-11 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none ${
						isEnrollmentOpen ? "bg-primary" : "bg-muted-foreground/30"
					}`}>
					<span
						className={`absolute top-0.5 left-0.5 size-5 rounded-full bg-background shadow transition-transform ${
							isEnrollmentOpen ? "translate-x-5" : "translate-x-0"
						}`}
					/>
				</button>
			</div>
		</section>
	);
}
