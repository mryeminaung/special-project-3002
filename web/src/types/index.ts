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

type TeamStatus = "active";

export interface TeamsData {
	id: number;
	title: string;
	leader: User;
	members: User[];
	status: TeamStatus;
	started_at: string;
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

type ProjectStatus = "active" | "competed" | "under review";

export interface Project {
	id: string;
	name: string;
	slug: string;
	description: string;
	leader: string;
	supervisor: string;
	members: User[];
	memberCount: number;
	status: ProjectStatus;
	started_at: string;
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
