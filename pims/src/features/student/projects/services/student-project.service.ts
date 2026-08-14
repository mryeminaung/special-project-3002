import api from "@/api/api";

export async function getMyProjects() {
	const res = await api.get("/projects/me");
	return res.data;
}

export async function getStudentProject(slug: string) {
	const res = await api.get(`/projects/${slug}`);
	return res.data;
}

export async function uploadReport(formData: FormData) {
	const res = await api.post("/upload-report", formData, {
		headers: { "Content-Type": "multipart/form-data" },
	});
	return res.data;
}

export async function deleteReport(slug: string, type: "mid" | "final") {
	const res = await api.post("/delete-report", { slug, type });
	return res;
}

export async function updateSeminarDeadlines(
	slug: string,
	payload: { midSeminarDeadline?: string; finalSeminarDeadline?: string },
) {
	await api.patch(`/projects/${slug}/seminar-deadlines`, payload);
}

export async function updateSeminarStatus(
	slug: string,
	type: "mid" | "final",
	status: string,
) {
	await api.patch(`/projects/${slug}/seminar-status`, { type, status });
}

export async function updateReportStatus(
	slug: string,
	type: "mid" | "final",
	status: string,
) {
	await api.patch(`/projects/${slug}/report-status`, { type, status });
}
