import api from "@/api/api";
import type { EventType } from "@/features/events/events.type";
import { create } from "zustand";

type EventConfiguration = {
	title: string;
	description: string;
	startDate: string;
	endDate: string;
};

type EnrollmentByEvent = Record<EventType, boolean>;

type EventStoreState = {
	enrollmentByEvent: EnrollmentByEvent;
	eventIdByType: Partial<Record<EventType, number>>;
	eventConfigurations: Partial<Record<EventType, EventConfiguration>>;
	isLoadingStatuses: boolean;
	fetchEventStatuses: () => Promise<void>;
	toggleEnrollmentWindow: (eventType: EventType) => Promise<void>;
	createProjectEvent: (
		eventType: EventType,
		configuration: EventConfiguration,
	) => Promise<boolean>;
	updateProjectEvent: (
		eventType: EventType,
		configuration: EventConfiguration,
	) => Promise<boolean>;
	deleteEventConfiguration: (eventType: EventType) => Promise<void>;
};

type ApiSuccessResponse<T> = {
	success: boolean;
	message: string;
	data: T;
	status: number;
};

type BackendProjectEvent = {
	id: number;
	type: string;
	title?: string | null;
	detail?: string | null;
	startDate?: string | null;
	start_date?: string | null;
	endDate?: string | null;
	end_date?: string | null;
	is_active?: boolean;
	isActive?: boolean;
};

const DEFAULT_ENROLLMENT_BY_EVENT: EnrollmentByEvent = {
	special: false,
	capstone: false,
	"master-thesis": false,
};

const backendToEventType: Record<string, EventType> = {
	special: "special",
	capstone: "capstone",
	"master/thesis": "master-thesis",
	"master-thesis": "master-thesis",
	master: "master-thesis",
};

const eventTypeToBackend: Record<EventType, string> = {
	special: "special",
	capstone: "capstone",
	"master-thesis": "master/thesis",
};

function normalizeEventStatus(payload: BackendProjectEvent) {
	const mappedType = backendToEventType[payload.type];

	if (!mappedType || typeof payload.id !== "number") {
		return null;
	}

	const isActive =
		typeof payload.is_active === "boolean"
			? payload.is_active
			: Boolean(payload.isActive);

	return {
		id: payload.id,
		eventType: mappedType,
		isActive,
		title: payload.title ?? null,
		detail: payload.detail ?? null,
		startDate: payload.startDate ?? payload.start_date ?? null,
		endDate: payload.endDate ?? payload.end_date ?? null,
	};
}

function applyStatuses(statuses: BackendProjectEvent[]) {
	const nextEnrollment: EnrollmentByEvent = { ...DEFAULT_ENROLLMENT_BY_EVENT };
	const nextIds: Partial<Record<EventType, number>> = {};
	const nextConfigurations: Partial<Record<EventType, EventConfiguration>> = {};

	for (const status of statuses) {
		const normalized = normalizeEventStatus(status);

		if (!normalized) {
			continue;
		}

		nextEnrollment[normalized.eventType] = normalized.isActive;
		nextIds[normalized.eventType] = normalized.id;

		if (normalized.title || normalized.detail) {
			nextConfigurations[normalized.eventType] = {
				title: normalized.title ?? "",
				description: normalized.detail ?? "",
				startDate: normalized.startDate ?? "",
				endDate: normalized.endDate ?? "",
			};
		}
	}

	return {
		enrollmentByEvent: nextEnrollment,
		eventIdByType: nextIds,
		eventConfigurations: nextConfigurations,
	};
}

export const useEventStore = create<EventStoreState>()(
	(set, get) => ({
		enrollmentByEvent: DEFAULT_ENROLLMENT_BY_EVENT,
		eventIdByType: {},
		eventConfigurations: {},
		isLoadingStatuses: false,

		fetchEventStatuses: async () => {
			set({ isLoadingStatuses: true });

			try {
				const res =
					await api.get<ApiSuccessResponse<BackendProjectEvent[]>>(
						"/project-events",
					);
				const statuses = Array.isArray(res.data.data) ? res.data.data : [];
				set(applyStatuses(statuses));
			} finally {
				set({ isLoadingStatuses: false });
			}
		},

		toggleEnrollmentWindow: async (eventType: EventType) => {
			let eventId = get().eventIdByType[eventType];

			if (!eventId) {
				await get().fetchEventStatuses();
				eventId = get().eventIdByType[eventType];
			}

			if (!eventId) {
				await api.post<ApiSuccessResponse<BackendProjectEvent>>(
					"/project-events",
					{
						title: null,
						detail: null,
						type: eventTypeToBackend[eventType],
						start_date: null,
						end_date: null,
						is_active: true,
					},
				);

				await get().fetchEventStatuses();
				return;
			}

			await api.post<ApiSuccessResponse<BackendProjectEvent>>(
				`/project-events/${eventId}/toggle-active`,
			);

			await get().fetchEventStatuses();
		},

		createProjectEvent: async (eventType, configuration) => {
			const payload = {
				title: configuration.title.trim(),
				detail: configuration.description.trim(),
				type: eventTypeToBackend[eventType],
				start_date: configuration.startDate,
				end_date: configuration.endDate,
				is_active: true,
			};

			await api.post<ApiSuccessResponse<BackendProjectEvent>>(
				"/project-events",
				payload,
			);

			await get().fetchEventStatuses();
			return true;
		},

		updateProjectEvent: async (eventType, configuration) => {
			const eventId = get().eventIdByType[eventType];
			if (!eventId) throw new Error("No event found to update");

			const payload = {
				title: configuration.title.trim(),
				detail: configuration.description.trim(),
				type: eventTypeToBackend[eventType],
				start_date: configuration.startDate,
				end_date: configuration.endDate,
				is_active: get().enrollmentByEvent[eventType],
			};

			await api.patch<ApiSuccessResponse<BackendProjectEvent>>(
				`/project-events/${eventId}`,
				payload,
			);

			await get().fetchEventStatuses();
			return true;
		},

		deleteEventConfiguration: async (eventType) => {
			const eventId = get().eventIdByType[eventType];

			if (eventId) {
				await api.delete(`/project-events/${eventId}`);
			}

			await get().fetchEventStatuses();
		},
	}),
);
