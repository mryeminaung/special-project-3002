export type FacultyDetailResponse = {
	id: number;
	name: string;
	email: string;
	roles?: string[];
	rank?: string | null;
	department?: string | null;
	phone?: string | null;
	address?: string | null;
	imageUrl?: string | null;
	activeProjects: { id: number; title: string; students: string }[];
	pastProjects: {
		id: number;
		title: string;
		year?: string | null;
		outcome: string;
	}[];
};
