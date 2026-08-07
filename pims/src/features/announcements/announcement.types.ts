export type AnnouncementAudience = "students" | "faculties" | "both";

export type AnnouncementItem = {
	id: number;
	title: string;
	description: string;
	announcer: string;
	audience: AnnouncementAudience;
	createdAt: string;
	updatedAt?: string;
};

export type AnnouncementFormData = {
	title: string;
	description: string;
	audience: AnnouncementAudience;
	created_by: number;
};
