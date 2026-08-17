import api from "@/api/api";
import type { AcademicYear, AdminStudent, Department, DepartmentDetail, ProjectArea, ProjectEvent } from "../types/admin.types";

export type { AcademicYear, AdminStudent, Department, DepartmentDetail, ProjectArea, ProjectEvent };

function unwrapList<T>(res: { data: unknown }): T[] {
	const outer = res.data as Record<string, unknown> | null;
	const d = outer?.data ?? outer;
	if (Array.isArray((d as Record<string, unknown>)?.data)) return ((d as Record<string, unknown>).data) as T[];
	if (Array.isArray(d)) return d as T[];
	return [];
}

export async function getProjectAreas(): Promise<ProjectArea[]> {
	const res = await api.get("/project-areas");
	return unwrapList<ProjectArea>(res);
}

export async function createProjectArea(payload: {
	name: string;
	description?: string;
}): Promise<ProjectArea> {
	const res = await api.post("/project-areas", payload);
	return (res.data?.data ?? res.data) as ProjectArea;
}

export async function updateProjectArea(
	id: number,
	payload: { name: string; description?: string },
): Promise<ProjectArea> {
	const res = await api.put(`/project-areas/${id}`, payload);
	return (res.data?.data ?? res.data) as ProjectArea;
}

export async function getDepartments(): Promise<Department[]> {
	const res = await api.get("/admin/departments");
	return unwrapList<Department>(res);
}

export async function getDepartmentDetail(id: number): Promise<DepartmentDetail> {
	const res = await api.get(`/admin/departments/${id}/detail`);
	return (res.data?.data ?? res.data) as DepartmentDetail;
}

export async function createDepartment(payload: {
	name: string;
	code: string;
	description?: string;
}): Promise<Department> {
	const res = await api.post("/admin/departments", payload);
	return (res.data?.data ?? res.data) as Department;
}

export async function updateDepartment(
	id: number,
	payload: { name: string; code: string; description?: string },
): Promise<Department> {
	const res = await api.put(`/admin/departments/${id}`, payload);
	return (res.data?.data ?? res.data) as Department;
}

export async function deleteDepartment(id: number): Promise<void> {
	await api.delete(`/admin/departments/${id}`);
}

export async function getAdminStudents(): Promise<AdminStudent[]> {
	const res = await api.get("/students");
	const body = res.data?.data ?? res.data;
	return Array.isArray(body) ? body : [];
}

export async function getStudentFilters(): Promise<{
	majors: string[];
	batches: string[];
}> {
	const res = await api.get("/students/filters");
	return (res.data?.data ?? res.data) as { majors: string[]; batches: string[] };
}

export async function getProjectEvents(): Promise<ProjectEvent[]> {
	const res = await api.get("/project-events");
	return unwrapList<ProjectEvent>(res);
}

export async function getAdminFaculties() {
	const res = await api.get("/faculties");
	return res.data;
}

export interface AdminFaculty {
	id: number;
	name: string;
	email: string;
	rank: string | null;
	rank_id: number | null;
	department: string | null;
	department_id: number | null;
	phone: string | null;
	address: string | null;
}

export async function updateFaculty(
	id: number,
	payload: {
		name?: string;
		email?: string;
		phone_number?: string;
		address?: string;
		department_id?: number;
		rank_id?: number;
	},
): Promise<AdminFaculty> {
	const res = await api.put(`/admin/faculties/${id}`, payload);
	return (res.data?.data ?? res.data) as AdminFaculty;
}

export async function resetFacultyPassword(
	id: number,
): Promise<{ temp_password: string }> {
	const res = await api.post(`/admin/faculties/${id}/reset-password`);
	return (res.data?.data ?? res.data) as { temp_password: string };
}

export async function getDepartmentsForSelect(): Promise<
	{ id: number; name: string }[]
> {
	const res = await api.get("/admin/departments");
	const body = res.data?.data ?? res.data;
	return Array.isArray(body) ? body : Array.isArray(body?.data) ? body.data : [];
}

export async function getRanksForSelect(): Promise<
	{ id: number; name: string }[]
> {
	const res = await api.get("/admin/ranks");
	const body = res.data?.data ?? res.data;
	return Array.isArray(body) ? body : Array.isArray(body?.data) ? body.data : [];
}

// ─── Academic Years ───────────────────────────────────────────────────────────

export async function getAcademicYears(): Promise<AcademicYear[]> {
	const res = await api.get("/admin/academic-years");
	return unwrapList<AcademicYear>(res);
}

export async function createAcademicYear(payload: {
	year: string;
	semester: 1 | 2;
	start_date: string;
	end_date: string;
	is_active?: boolean;
}): Promise<AcademicYear> {
	const res = await api.post("/admin/academic-years", payload);
	return (res.data?.data ?? res.data) as AcademicYear;
}

export async function updateAcademicYear(
	id: number,
	payload: {
		year?: string;
		semester?: 1 | 2;
		start_date?: string;
		end_date?: string;
		is_active?: boolean;
	},
): Promise<AcademicYear> {
	const res = await api.put(`/admin/academic-years/${id}`, payload);
	return (res.data?.data ?? res.data) as AcademicYear;
}

export async function setActiveAcademicYear(id: number): Promise<AcademicYear> {
	const res = await api.post(`/admin/academic-years/${id}/set-active`);
	return (res.data?.data ?? res.data) as AcademicYear;
}

export async function deleteAcademicYear(id: number): Promise<void> {
	await api.delete(`/admin/academic-years/${id}`);
}
