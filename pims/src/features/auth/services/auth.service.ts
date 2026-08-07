import api from "@/api/api";

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

export const authService = {
	async login(credentials: LoginCredentials): Promise<LoginResponse> {
		const response = await api.post<LoginResponse>("auth/login", credentials);
		return response.data;
	},

	async logout(): Promise<void> {
		await api.post("auth/logout");
	},

	async getCurrentUser(): Promise<LoginResponse["user"]> {
		const response = await api.get<{ user: LoginResponse["user"] }>("auth/me");
		return response.data.user;
	},

	async forgotPassword(email: string): Promise<void> {
		await api.post("auth/forgot-password", { email });
	},

	async resetPassword(
		token: string,
		password: string,
		passwordConfirmation: string,
	): Promise<void> {
		await api.post("auth/reset-password", {
			token,
			password,
			password_confirmation: passwordConfirmation,
		});
	},

	async changePassword(
		currentPassword: string,
		newPassword: string,
		newPasswordConfirmation: string,
	): Promise<void> {
		await api.post("auth/change-password", {
			current_password: currentPassword,
			new_password: newPassword,
			new_password_confirmation: newPasswordConfirmation,
		});
	},
};

export default authService;
