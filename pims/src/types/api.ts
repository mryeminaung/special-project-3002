export type ProposalStatus = "pending" | "rejected" | "approved";
export type ProposalAppliedType = "Student" | "Faculty";
export type ProposalProjectType = "Special" | "Capstone" | "Master";
export type ProjectStatus = "active" | "pending" | "under_review" | "completed";

export interface ApiResponse<T> {
	success: boolean;
	message: string;
	data: T;
}

export interface PaginationMeta {
	currentPage: number;
	lastPage: number;
	perPage: number;
	total: number;
}

export interface PaginatedApiResponse<T> {
	success: boolean;
	message: string;
	data: {
		data: T[];
		meta: PaginationMeta;
	};
}
