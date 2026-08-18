import api from "@/api/api";

export async function getSADashboard() {
	const res = await api.get("/dashboard");
	return res.data.data;
}

export async function getSAProposals(page: number, yearId?: number) {
	const params = new URLSearchParams();
	if (page > 1) params.set("page", String(page));
	if (yearId) params.set("year_id", String(yearId));
	const q = params.toString();
	const res = await api.get(`/proposals/all${q ? `?${q}` : ""}`);
	return res.data;
}

export async function getSAProjects(yearId?: number) {
	const res = await api.get(`/projects${yearId ? `?year_id=${yearId}` : ""}`);
	return res.data.data;
}

export async function getSAStudents() {
	const res = await api.get("/students");
	return res.data.data;
}

export async function getSAStudentFilters() {
	const res = await api.get("/students/filters");
	return res.data.data;
}
