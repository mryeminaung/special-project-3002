import api from "@/api/api";

export async function getGrades(slug: string) {
	const res = await api.get(`/projects/${slug}/grades`);
	return res.data;
}

export async function giveGrade(
	slug: string,
	data: { student_id: number; grade: string; remarks?: string; type: "mid" | "final" },
) {
	const res = await api.post(`/projects/${slug}/grades`, data);
	return res.data;
}

export async function updateGrade(
	slug: string,
	gradeId: number,
	data: { grade: string; remarks?: string },
) {
	const res = await api.patch(`/projects/${slug}/grades/${gradeId}`, data);
	return res.data;
}
