import api from "@/api/api";
import type { SupervisorData } from "@/types";
import type { SupervisorDetailResponse } from "../types/supervisor.types";

export type { SupervisorDetailResponse };

export async function getSupervisors(): Promise<SupervisorData[]> {
	const res = await api.get("/supervisors");
	const raw: any[] = res.data?.data ?? [];
	return raw.map((s) => ({
		id: s.id,
		name: s.name,
		email: s.email,
		status: s.status ?? "Active",
		role: s.roles?.[0] ?? "faculty",
		rank: s.profile?.rank ? { id: s.profile.rankId ?? 0, name: s.profile.rank } : null,
		department: s.profile?.department ? { id: s.profile.departmentId ?? 0, name: s.profile.department } : null,
	}));
}

export async function getSupervisorDetail(id: string): Promise<SupervisorDetailResponse> {
	const res = await api.get(`/supervisors/${id}/detail`);
	return res.data;
}
