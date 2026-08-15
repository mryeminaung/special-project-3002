import api from "@/api/api";
import type { ApiResponse } from "@/types/api";
import type { FacultyDetailResponse } from "../types/faculty.types";

export type { FacultyDetailResponse };

export async function getFacultyDetail(id: string) {
	const res = await api.get<ApiResponse<FacultyDetailResponse>>(`/faculties/${id}/detail`);
	return res.data.data;
}

export async function getFaculties() {
	const res = await api.get("/faculties");
	return res.data;
}
