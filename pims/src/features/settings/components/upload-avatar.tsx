import { uploadProfilePicture, deleteProfilePicture } from "../services/settings.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/use-auth-store";
import { getInitials } from "@/lib/utils";
import { IconCamera, IconLoader2 } from "@tabler/icons-react";
import { useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function ChangeAvatar() {
	const authUser = useAuthStore((state) => state.authUser);
	const updateAuthUser = useAuthStore((state) => state.updateAuthUser);

	const avatarFallbackName = authUser?.name ? getInitials(authUser.name) : "";

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
			const resData = await uploadProfilePicture(formData);
			updateAuthUser(resData?.data);
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
			const resData = await deleteProfilePicture();
			updateAuthUser(resData?.data);
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
					{(isPreviewing ?? authUser?.avatar_url) ? (
						<AvatarImage src={isPreviewing ?? authUser?.avatar_url} />
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
