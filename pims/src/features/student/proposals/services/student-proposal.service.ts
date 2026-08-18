import api from "@/api/api";

export async function getMyProposals(yearId?: number) {
	const params = new URLSearchParams();
	if (yearId) params.set("year_id", String(yearId));
	const query = params.toString();
	const res = await api.get(`/proposals/me${query ? `?${query}` : ""}`);
	return res.data;
}

export async function getSupervisorsForProposal() {
	const res = await api.get("faculties-for-proposal");
	return res.data;
}

export async function getStudentsForProposal() {
	const res = await api.get("students-for-proposal");
	return res.data;
}
