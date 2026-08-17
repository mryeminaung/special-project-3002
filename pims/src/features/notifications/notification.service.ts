import api from "@/api/api";

export type AppNotification = {
	id: string;
	data: {
		type: "proposal_approved" | "examiner_assigned" | "announcement" | "project_event";
		title: string;
		body: string;
		url: string;
	};
	read: boolean;
	createdAt: string;
};

export type NotificationsResponse = {
	notifications: AppNotification[];
	unreadCount: number;
};

export async function getNotifications(): Promise<NotificationsResponse> {
	const res = await api.get("/notifications");
	return res.data.data;
}

export async function markNotificationRead(id: string): Promise<void> {
	await api.patch(`/notifications/${id}/read`);
}

export async function markAllNotificationsRead(): Promise<void> {
	await api.post("/notifications/read-all");
}
