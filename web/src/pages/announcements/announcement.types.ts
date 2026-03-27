export type AnnouncementAudience = "students" | "faculties" | "both";

export type AnnouncementItem = {
	id: number;
	title: string;
	description: string;
	audience: AnnouncementAudience;
	createdAt: string;
	announcer: string;
};
