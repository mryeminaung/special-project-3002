import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type EventType = "special" | "capstone" | "master-thesis";

type EnrollmentByEvent = Record<EventType, boolean>;

export type EventConfiguration = {
	eventDetail: string;
	submissionDeadline: string;
	extraDocumentName: string | null;
	updatedAt: string;
};

type EventConfigurationsByType = Partial<Record<EventType, EventConfiguration>>;

type EventStoreProps = {
	enrollmentByEvent: EnrollmentByEvent;
	eventConfigurations: EventConfigurationsByType;
	setEnrollmentWindow: (eventType: EventType, isOpen: boolean) => void;
	toggleEnrollmentWindow: (eventType: EventType) => void;
	saveEventConfiguration: (
		eventType: EventType,
		configuration: Omit<EventConfiguration, "updatedAt">,
	) => void;
	deleteEventConfiguration: (eventType: EventType) => void;
};

const initialEnrollmentByEvent: EnrollmentByEvent = {
	special: false,
	capstone: true,
	"master-thesis": false,
};

export const useEventStore = create<EventStoreProps>()(
	persist(
		(set) => ({
			enrollmentByEvent: initialEnrollmentByEvent,
			eventConfigurations: {},
			setEnrollmentWindow: (eventType, isOpen) =>
				set((state) => ({
					enrollmentByEvent: {
						...state.enrollmentByEvent,
						[eventType]: isOpen,
					},
				})),
			toggleEnrollmentWindow: (eventType) =>
				set((state) => ({
					enrollmentByEvent: {
						...state.enrollmentByEvent,
						[eventType]: !state.enrollmentByEvent[eventType],
					},
				})),
			saveEventConfiguration: (eventType, configuration) =>
				set((state) => ({
					eventConfigurations: {
						...state.eventConfigurations,
						[eventType]: {
							...configuration,
							updatedAt: new Date().toISOString(),
						},
					},
				})),
			deleteEventConfiguration: (eventType) =>
				set((state) => {
					const nextConfigurations = { ...state.eventConfigurations };
					delete nextConfigurations[eventType];

					return {
						eventConfigurations: nextConfigurations,
					};
				}),
		}),
		{
			name: "event-settings",
			storage: createJSONStorage(() => localStorage),
		},
	),
);
