import api from "@/api/api";

export async function updateProfile(data: { phoneNo: string; address: string }) {
	const res = await api.patch("/update-profile", data);
	return res.data;
}

export async function uploadProfilePicture(formData: FormData) {
	const res = await api.post("/upload-profile-picture", formData, {
		headers: { "Content-Type": "multipart/form-data" },
	});
	return res.data;
}

export async function deleteProfilePicture() {
	const res = await api.delete("/delete-profile-picture");
	return res.data;
}
