export interface LoginCredentials {
	email: string;
	password: string;
}

export interface LoginResponse {
	user: {
		id: number;
		name: string;
		email: string;
		phoneNumber?: string | null;
		address?: string | null;
		avatar_url?: string | null;
		role?: string;
		major?: string | null;
		gpa?: string | null;
		rank?: string | null;
		departmentName?: string | null;
		graduationStatus?: string | null;
		status?: string | null;
	};
	token: string;
}
