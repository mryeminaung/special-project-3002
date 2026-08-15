import api from "@/api/api";
import type { Comment } from "@/types";

export async function getProposals(page: number) {
	const endpoint = page > 1 ? `/proposals?page=${page}` : "/proposals";
	const res = await api.get(endpoint);
	return res.data;
}

export async function browseProposals(page: number) {
	const endpoint =
		page > 1 ? `/proposals/browse?page=${page}` : "/proposals/browse";
	const res = await api.get(endpoint);
	return res.data;
}

export async function getProposal(slug: string) {
	const res = await api.get(`/proposals/${slug}`);
	return res.data;
}

export async function createProposal(data: Record<string, unknown>) {
	const res = await api.post("/proposals", data);
	return res;
}

export async function approveProposal(slug: string) {
	const res = await api.post(`/proposals/${slug}/approve`);
	return res;
}

export async function rejectProposal(slug: string) {
	const res = await api.post(`/proposals/${slug}/reject`);
	return res.data;
}

export async function getFacultyProposals() {
	const res = await api.get("/proposals/faculties");
	return res.data;
}

export async function joinProposal(slug: string) {
	const res = await api.post(`/proposals/${slug}/join`);
	return res.data;
}

export async function acceptApplicant(slug: string, studentId: number) {
	const res = await api.post(
		`/proposals/${slug}/applications/${studentId}/accept`,
	);
	return res.data;
}

export async function rejectApplicant(slug: string, studentId: number) {
	const res = await api.post(
		`/proposals/${slug}/applications/${studentId}/reject`,
	);
	return res.data;
}

export async function getComments(proposalId: number): Promise<Comment[]> {
	const res = await api.get(`/comments/${proposalId}`);
	return res.data.data as Comment[];
}

export async function createComment(data: {
	proposal_id: number;
	description: string;
}) {
	const res = await api.post("/comments", data);
	return res.data;
}

export async function editComment(
	proposalId: number,
	commentId: number,
	description: string,
) {
	const res = await api.patch(`/comments/${proposalId}/${commentId}`, {
		description,
		proposal_id: proposalId,
	});
	return res.data;
}

export async function deleteComment(commentId: number) {
	await api.delete(`/comments/${commentId}`);
}

export async function getProposalProjectAreas() {
	const res = await api.get("/project-areas");
	return res.data;
}

export async function uploadProposalDocument(formData: FormData) {
	const res = await api.post("/upload-to-s3", formData, {
		headers: { "Content-Type": "multipart/form-data" },
	});
	return res.data;
}
