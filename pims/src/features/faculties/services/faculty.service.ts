import api from "@/api/api";

export type FacultyDetailResponse = {
	id: number;
	name: string;
	email: string;
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

export async function getFacultyDetail(id: string) {
	const res = await api.get<{
		success: boolean;
		message: string;
		data: FacultyDetailResponse;
	}>(`/faculties/${id}/detail`);
	return res.data.data;
}
