import api from "@/api/api";
import type { EventType } from "@/features/events/events.type";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

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
	saveEventConfiguration: (
		eventType: EventType,
		configuration: EventConfiguration,
	) => void;
	deleteEventConfiguration: (eventType: EventType) => void;
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
	};
}

function applyStatuses(statuses: BackendProjectEvent[]) {
	const nextEnrollment: EnrollmentByEvent = { ...DEFAULT_ENROLLMENT_BY_EVENT };
	const nextIds: Partial<Record<EventType, number>> = {};

	for (const status of statuses) {
		const normalized = normalizeEventStatus(status);

		if (!normalized) {
			continue;
		}

		nextEnrollment[normalized.eventType] = normalized.isActive;
		nextIds[normalized.eventType] = normalized.id;
	}

	return {
		enrollmentByEvent: nextEnrollment,
		eventIdByType: nextIds,
	};
}

export const useEventStore = create<EventStoreState>()(
	persist(
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

				const res = await api.post<ApiSuccessResponse<BackendProjectEvent[]>>(
					`/project-events/${eventId}/toggle-active`,
				);
				const statuses = Array.isArray(res.data.data) ? res.data.data : [];

				if (statuses.length > 0) {
					set(applyStatuses(statuses));
					return;
				}

				set((state) => ({
					enrollmentByEvent: {
						...state.enrollmentByEvent,
						[eventType]: !state.enrollmentByEvent[eventType],
					},
				}));
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

				set((state) => ({
					eventConfigurations: {
						...state.eventConfigurations,
						[eventType]: configuration,
					},
				}));

				await get().fetchEventStatuses();
				return true;
			},

			saveEventConfiguration: (eventType, configuration) => {
				set((state) => ({
					eventConfigurations: {
						...state.eventConfigurations,
						[eventType]: configuration,
					},
				}));
			},

			deleteEventConfiguration: (eventType) => {
				set((state) => {
					const nextConfigurations = { ...state.eventConfigurations };
					delete nextConfigurations[eventType];

					return {
						eventConfigurations: nextConfigurations,
					};
				});
			},
		}),
		{
			name: "spms-events-store",
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => ({
				eventConfigurations: state.eventConfigurations,
			}),
		},
	),
);
