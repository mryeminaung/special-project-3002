import { useEventStore } from "@/stores/use-event-store";
import type { EventType } from "@/features/events/events.type";

type EventGuardResult = {
	/** Whether the event exists, is active, and current date is within the date range */
	canSubmit: boolean;
	/** Whether the event is active (is_active = true) */
	isActive: boolean;
	/** Whether the event has configuration (title, dates) */
	hasConfig: boolean;
	/** Whether current date is within start/end date range */
	isWithinDateRange: boolean;
	/** The event configuration if it exists */
	configuration: {
		title: string;
		description: string;
		startDate: string;
		endDate: string;
	} | null;
	/** Reason why submission is blocked (null if allowed) */
	blockReason: string | null;
};

function parseDate(dateStr: string, endOfDay = false): Date | null {
	if (!dateStr) return null;
	// Strip any time/timezone component so we always work in local time,
	// avoiding UTC-midnight vs local-time mismatches from the backend.
	const datePart = dateStr.split("T")[0].split(" ")[0];
	if (!/^\d{4}-\d{2}-\d{2}$/.test(datePart)) return null;
	const d = new Date(`${datePart}T${endOfDay ? "23:59:59" : "00:00:00"}`);
	return isNaN(d.getTime()) ? null : d;
}

function toDateString(date: Date): string {
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, "0");
	const d = String(date.getDate()).padStart(2, "0");
	return `${y}-${m}-${d}`;
}

export function useEventGuard(eventType: EventType): EventGuardResult {
	const isActive = useEventStore(
		(state) => state.enrollmentByEvent[eventType],
	);
	const configuration = useEventStore(
		(state) => state.eventConfigurations[eventType] ?? null,
	);

	const hasConfig = !!configuration;
	const now = new Date();

	let isWithinDateRange = false;

	if (hasConfig && configuration) {
		const startDate = parseDate(configuration.startDate);
		const endDate = parseDate(configuration.endDate, true);

		if (startDate && endDate) {
			isWithinDateRange = now >= startDate && now <= endDate;
		} else if (startDate) {
			isWithinDateRange = now >= startDate;
		} else if (endDate) {
			isWithinDateRange = now <= endDate;
		} else {
			// No dates set — allow if event is active and has config
			isWithinDateRange = true;
		}
	}

	const canSubmit = isActive && hasConfig && isWithinDateRange;

	let blockReason: string | null = null;
	if (!isActive) {
		blockReason = "This project type enrollment is currently closed.";
	} else if (!hasConfig) {
		blockReason = "No event has been created for this project type yet. Please wait for the instructor to set up the event.";
	} else if (!isWithinDateRange) {
		if (configuration) {
			const startDate = parseDate(configuration.startDate);
			const endDate = parseDate(configuration.endDate, true);
			const todayStr = toDateString(now);

			if (startDate && todayStr < toDateString(startDate)) {
				blockReason = `Submission period has not started yet. Opens on ${configuration.startDate}.`;
			} else if (endDate && todayStr > toDateString(endDate)) {
				blockReason = `Submission period has ended. Closed on ${configuration.endDate}.`;
			} else {
				blockReason = "Submission is currently outside the allowed date range.";
			}
		}
	}

	return {
		canSubmit,
		isActive,
		hasConfig,
		isWithinDateRange,
		configuration,
		blockReason,
	};
}
