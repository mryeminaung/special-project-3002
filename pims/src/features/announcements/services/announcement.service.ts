import api from "@/api/api";
import type { AnnouncementFormData, AnnouncementItem } from "../announcement.types";

export async function getAnnouncements(): Promise<AnnouncementItem[]> {
	const res = await api.get("/announcements");
	return res.data.data;
}

export async function getAnnouncement(id: number): Promise<AnnouncementItem> {
	const res = await api.get(`/announcements/${id}`);
	return res.data.data;
}

export async function createAnnouncement(data: AnnouncementFormData): Promise<AnnouncementItem> {
	const res = await api.post("/announcements", data);
	return res.data.data;
}

export async function updateAnnouncement(id: number, data: Partial<AnnouncementFormData>): Promise<AnnouncementItem> {
	const res = await api.patch(`/announcements/${id}`, data);
	return res.data.data;
}

export async function deleteAnnouncement(id: number): Promise<void> {
	await api.delete(`/announcements/${id}`);
}
