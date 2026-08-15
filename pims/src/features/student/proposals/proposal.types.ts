import type { ProposalStatus } from "@/types/api";

export type ProposalDetail = {
	id: number;
	title: string;
	slug: string;
	description: string;
	file: string;
	status: ProposalStatus;
	type: string;
	projectType: string;
	projectArea?: string | null;
	submittedAt: string;
	supervisor: {
		id: number;
		name: string;
		email: string;
	};
	submittedBy: {
		id: number;
		name: string;
		email: string;
	};
	members: Array<{
		id: number;
		name: string;
		email: string;
	}>;
};
