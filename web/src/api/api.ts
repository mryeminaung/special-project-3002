import { useAuthStore } from "@/stores/use-auth-store";
import axios from "axios";

const api = axios.create({
	baseURL: "http://localhost:8000/api/",
	withCredentials: true,
	withXSRFToken: true,
	headers: {
		Accept: "application/json",
		"Content-Type": "application/json",
	},
});

// Request Interceptor (Existing - keeps logged in)
api.interceptors.request.use(
	(config) => {
		const authToken = useAuthStore.getState().token;
		if (authToken) {
			config.headers["Authorization"] = `Bearer ${authToken}`;
		}
		return config;
	},
	(error) => Promise.reject(error),
);

// Response Interceptor (New - catches invalid/expired tokens)
api.interceptors.response.use(
	(response) => response, // Pass through successful responses
	(error) => {
		// Check if the error is 401 (Unauthorized)
		if (error.response && error.response.status === 401) {
			console.warn("Session expired or token invalid. Clearing storage...");

			// Use the logout action from Zustand store
			useAuthStore.getState().logout();

			// Optional: Redirect to login page manually if not using a Guard component
			if (typeof window !== "undefined") {
				window.location.href = "/login";
			}
		}
		return Promise.reject(error);
	},
);

export default api;
