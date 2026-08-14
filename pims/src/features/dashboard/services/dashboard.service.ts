import api from "@/api/api";

export async function getDashboardData() {
	const res = await api.get("/dashboard");
	return res.data?.data ?? res.data;
}
