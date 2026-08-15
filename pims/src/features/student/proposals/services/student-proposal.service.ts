import api from "@/api/api";

export async function getMyProposals() {
	const res = await api.get("/proposals/me");
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
