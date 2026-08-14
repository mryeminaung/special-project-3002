export type SupervisorDetailResponse = {
	id: number;
	name: string;
	email: string;
	rank?: string | null;
	faculty?: string | null;
	phone?: string | null;
	imageUrl?: string | null;
	activeProjects: { id: number; title: string; students: string }[];
	pastProjects: {
		id: number;
		title: string;
		year?: string | null;
		outcome: string;
	}[];
};
