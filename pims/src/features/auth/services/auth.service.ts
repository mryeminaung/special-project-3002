import api from "@/api/api";
import type { LoginCredentials, LoginResponse } from "../types/auth.types";

export type { LoginCredentials, LoginResponse };

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
		await api.post("auth/reset-password", {
			current_password: currentPassword,
			password: newPassword,
			password_confirmation: newPasswordConfirmation,
		});
	},
};

export default authService;
