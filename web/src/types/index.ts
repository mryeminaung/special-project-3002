export type UserRole =
	| "IC"
	| "Student Affairs"
	| "Faculty"
	| "Supervisor"
	| "Student";

export interface UsersData {
	id: number;
	name: string;
	email: string;
	role: UserRole;
	status: string;
	phoneNumber?: string;
	rank: string;
	departmentName?: string;
}

export interface User {
	id: number;
	name: string;
	email: string;
}
export interface ProjectProposal {
	id: string;
	title: string;
	slug: string;
	description: string;
	file: string;
	submittedBy: User;
	supervisor: User;
	students: User[];
	status: "pending" | "approved" | "rejected";
	submitted_at: string;
}
