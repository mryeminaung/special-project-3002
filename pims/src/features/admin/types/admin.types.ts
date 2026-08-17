export interface ProjectArea {
	id: number;
	name: string;
	description: string;
	projects_count: number;
}

export interface Department {
	id: number;
	name: string;
	slug: string;
	code: string;
	description: string | null;
	faculties_count: number;
}

export interface DepartmentDetail extends Department {
	faculties: DepartmentFaculty[];
}

export interface DepartmentFaculty {
	id: number;
	phone_number: string | null;
	address: string | null;
	user: {
		id: number;
		name: string;
		email: string;
		avatar_url: string | null;
	};
	rank: {
		id: number;
		name: string;
	} | null;
}

export interface AdminStudent {
	id: number;
	name: string;
	email: string;
	avatar_url: string | null;
	major_name: string | null;
	phone_number: string | null;
	gpa: string | null;
	batch: string | null;
	graduation_status: string;
	registered_at: string;
}

export interface AcademicYear {
	id: number;
	label: string;
	year: string;
	semester: 1 | 2;
	startDate: string;
	endDate: string;
	isActive: boolean;
	proposalsCount?: number;
	projectsCount?: number;
}

export interface ProjectEvent {
	id: number;
	type: string;
	title?: string | null;
	detail?: string | null;
	start_date?: string | null;
	startDate?: string | null;
	end_date?: string | null;
	endDate?: string | null;
	is_active?: boolean;
	isActive?: boolean;
}
