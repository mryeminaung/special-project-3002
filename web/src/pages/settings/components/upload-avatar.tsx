import api from "@/api/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/use-auth-store";
import { IconCamera, IconLoader2 } from "@tabler/icons-react";
import { useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function ChangeAvatar() {
	const authUser = useAuthStore((state) => state.authUser);
	const setAuth = useAuthStore((state) => state.setAuth);

	const avatarFallbackName = authUser?.name
		?.split(" ")
		.slice(1, 3)
		.map((name: string) => name[0])
		.join("");

	const fileInputRef = useRef<HTMLInputElement>(null);
	const [uploadStatus, setUploadStatus] = useState<
		"idle" | "uploading" | "saved"
	>("idle");
	const [isRemoving, setIsRemoving] = useState(false);
	const [isPreviewing, setIsPreviewing] = useState<string | null>(null);

	// Triggered when "Change" button is clicked
	const handleImageClick = () => fileInputRef.current?.click();

	// Handle local preview and upload
	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Show local preview immediately
		setIsPreviewing(URL.createObjectURL(file));

		setUploadStatus("uploading");
		const formData = new FormData();
		formData.append("avatar_url", file);

		try {
			const res = await api.post("/upload-profile-picture", formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			setAuth(res.data);
			setUploadStatus("saved");
			toast.success("Profile picture uploaded!");
			setTimeout(() => setUploadStatus("idle"), 2000);
		} catch (error) {
			toast.error("Upload failed. Please try again.");
			setUploadStatus("idle");
		}
	};

	const handleRemove = async () => {
		if (!authUser?.avatar_url || isRemoving) return;

		setIsRemoving(true);
		try {
			const res = await api.delete("/delete-profile-picture");
			setAuth(res.data);
			setIsPreviewing(null);
			toast.success("Profile picture removed!");
		} catch (error) {
			toast.error("Remove failed. Please try again.");
		} finally {
			setIsRemoving(false);
		}
	};

	return (
		<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<Toaster />
			<div className="flex items-center gap-4">
				<Avatar className="size-20 border-2 border-primary-100">
					{authUser?.avatar_url !== null ? (
						<AvatarImage src={authUser?.avatar_url} />
					) : (
						<AvatarFallback className="bg-primary-50 text-primary-700">
							{avatarFallbackName}
						</AvatarFallback>
					)}
				</Avatar>

				<div>
					<p className="text-sm font-medium">Profile photo</p>
					<p className="text-xs text-muted-foreground">
						Visible to other users
					</p>
				</div>
			</div>

			<div className="flex gap-2">
				<input
					type="file"
					ref={fileInputRef}
					onChange={handleFileChange}
					accept="image/*"
					className="hidden"
				/>
				<Button
					variant="outline"
					size="sm"
					disabled={uploadStatus === "uploading"}
					onClick={handleImageClick}
					className="gap-2">
					{uploadStatus === "uploading" ? (
						<IconLoader2
							className="animate-spin"
							size={16}
						/>
					) : (
						<IconCamera size={16} />
					)}
					{uploadStatus === "uploading" ? "Uploading..." : "Upload"}
				</Button>
				<Button
					variant="outline"
					size="sm"
					disabled={isRemoving || !authUser?.avatar_url}
					onClick={handleRemove}
					className="gap-2">
					{isRemoving ? "Removing..." : "Remove"}
				</Button>
			</div>
		</div>
	);
}
