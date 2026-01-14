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

type ProposalStatus = "pending" | "approved" | "rejected";

export interface ProjectProposal {
	id: string;
	title: string;
	slug: string;
	description: string;
	file: string;
	submittedBy: User;
	supervisor: User;
	members: User[];
	status: ProposalStatus;
	submitted_at: string;
}

export type Comment = {
	id: number;
	author: {
		id: number;
		name: string;
		role: "Student" | "Supervisor" | "IC";
	};
	description: string;
	updatedAt: string;
};
