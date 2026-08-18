import api from "@/api/api";

export async function getProjects(yearId?: number) {
	const res = await api.get(`/projects${yearId ? `?year_id=${yearId}` : ""}`);
	return res.data.data;
}

export async function getProject(slug: string) {
	const res = await api.get(`/projects/${slug}`);
	return res.data;
}

export async function getStudentProjects(yearId?: number) {
	const res = await api.get(`/projects/me${yearId ? `?year_id=${yearId}` : ""}`);
	return res.data.data;
}

export async function getAssignedProjects(yearId?: number) {
	const res = await api.get(`/projects/assigned${yearId ? `?year_id=${yearId}` : ""}`);
	return res.data.data;
}

export async function updateReportStatus(
	slug: string,
	type: "mid" | "final",
	status: "submitted" | "not submitted",
) {
	const res = await api.patch(`/projects/${slug}/report-status`, { type, status });
	return res.data;
}

export async function updateSeminarStatus(
	slug: string,
	type: "mid" | "final",
	status: "completed" | "not completed",
) {
	const res = await api.patch(`/projects/${slug}/seminar-status`, { type, status });
	return res.data;
}

export async function syncExaminers(slug: string, examinerIds: number[]) {
	const res = await api.post(`/projects/${slug}/examiners`, { examiner_ids: examinerIds });
	return res.data;
}

export async function removeExaminer(slug: string, userId: number) {
	const res = await api.delete(`/projects/${slug}/examiners/${userId}`);
	return res.data;
}

export async function approveReport(slug: string, type: "mid" | "final") {
	const res = await api.patch(`/projects/${slug}/report-approval`, { type });
	return res.data;
}

export async function markProjectComplete(slug: string) {
	const res = await api.post(`/projects/${slug}/complete`);
	return res.data;
}
