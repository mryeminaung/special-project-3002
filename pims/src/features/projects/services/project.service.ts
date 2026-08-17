import api from "@/api/api";

export async function getProjects() {
	const res = await api.get("/projects");
	return res.data.data;
}

export async function getProject(slug: string) {
	const res = await api.get(`/projects/${slug}`);
	return res.data;
}

export async function getAssignedProjects() {
	const res = await api.get("/projects/assigned");
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
