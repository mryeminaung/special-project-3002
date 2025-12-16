import { useAuthStore } from "@/stores/useAuthStore";
import axios from "axios";

const api = axios.create({
	baseURL: "http://localhost:8000/api/",
	withCredentials: true,

	headers: {
		Accept: "application/json",
		"Content-Type": "application/json",
	},
});

api.interceptors.request.use(
	(config) => {
		const authToken = useAuthStore.getState().authToken;

		if (authToken) {
			config.headers["Authorization"] = `Bearer ${authToken}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

export default api;
