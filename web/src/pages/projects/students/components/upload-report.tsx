import api from "@/api/api";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { useQueryClient } from "@tanstack/react-query";
import {
	Download,
	FileText,
	Loader2,
	Save,
	Trash2,
	UploadCloud,
	X,
} from "lucide-react";
import { useRef, useState } from "react";

type UploadReportProps = {
	label: string;
	slug: string;
	type: "mid" | "final";
	midReportUrl: string;
	finalReportUrl: string;
	progressStatus: { [key: string]: boolean };
};

export function UploadReport({
	label,
	slug,
	type,
	midReportUrl,
	finalReportUrl,
}: UploadReportProps) {
	const queryClient = useQueryClient();
	const existingReportUrl = type === "mid" ? midReportUrl : finalReportUrl;
	const [isExistingReportDeleted, setIsExistingReportDeleted] = useState(false);
	const hasExistingReport =
		Boolean(existingReportUrl) && !isExistingReportDeleted;
	const [file, setFile] = useState<File | null>(null);
	const [fileUrl, setFileUrl] = useState<string | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files?.[0]) {
			const selectedFile = e.target.files[0];
			if (fileUrl) {
				URL.revokeObjectURL(fileUrl);
			}
			setFile(selectedFile);
			setFileUrl(URL.createObjectURL(selectedFile));
		}
	};

	const clearFile = () => {
		if (fileUrl) {
			URL.revokeObjectURL(fileUrl);
		}
		setFile(null);
		setFileUrl(null);
		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	const deleteReport = async () => {
		try {
			setIsDeleting(true);
			const res = await api.post("/delete-report", { slug, type });
			console.log(res.status);
			if (res.status >= 200 && res.status < 300) {
				await queryClient.invalidateQueries({
					queryKey: ["projectDetail", slug],
				});
				setIsExistingReportDeleted(true);
				clearFile();
			}
		} catch (err) {
			console.error(err);
		} finally {
			setIsDeleting(false);
		}
	};

	const getFileNameFromUrl = (url: string) => {
		try {
			const decodedPath = decodeURIComponent(url.split("?")[0]);
			return decodedPath.split("/").pop() || "Uploaded report";
		} catch {
			return "Uploaded report";
		}
	};

	const uploadReport = async (selectedFile?: File) => {
		const fileToUpload = selectedFile ?? file;
		if (!fileToUpload) return;
		const formData = new FormData();
		formData.append("file", fileToUpload);
		formData.append("type", type);
		formData.append("slug", slug);

		try {
			setIsSaving(true);
			const res = await api.post("/upload-report", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			console.log(res.status);

			if (res.status >= 200 && res.status < 300) {
				await queryClient.invalidateQueries({
					queryKey: ["projectDetail", slug],
				});
				clearFile();
			}
		} catch (err) {
			console.error(err);
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<Field className="w-full">
			<div className="flex items-center justify-between mb-3">
				<FieldLabel className="mb-2 block text-lg font-semibold text-foreground">
					{label}
				</FieldLabel>
				{hasExistingReport ? (
					<div className="flex items-center gap-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => void deleteReport()}
							disabled={isDeleting}
							className="gap-2">
							{isDeleting ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								<Trash2 className="h-4 w-4" />
							)}
							Delete
						</Button>
						<Button
							type="button"
							asChild
							className="gap-2 bg-primary-600 font-semibold text-white hover:bg-primary-500">
							<a
								href={existingReportUrl}
								target="_blank"
								rel="noopener noreferrer"
								download>
								<Download className="h-4 w-4" />
								Download
							</a>
						</Button>
					</div>
				) : (
					<Button
						onClick={() => void uploadReport()}
						disabled={!fileUrl || isSaving}
						className="w-full sm:w-fit gap-2 bg-primary-600 font-semibold text-white hover:bg-primary-500 hover:cursor-pointer">
						{isSaving ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<Save className="h-4 w-4" />
						)}
						{isSaving ? "Saving" : "Save"}
					</Button>
				)}
			</div>

			<div
				className={`relative group border-2 border-dashed rounded-xl p-4 transition-all duration-200 
          ${file ? "border-primary/50 bg-primary/5" : "border-muted-foreground/20 hover:border-primary/40 hover:bg-muted/30"}`}>
				<input
					type="file"
					ref={fileInputRef}
					name="report"
					onChange={handleFileChange}
					className={`absolute inset-0 w-full h-full opacity-0 z-10 ${hasExistingReport ? "cursor-default pointer-events-none" : "cursor-pointer"}`}
					accept=".pdf,.doc,.docx"
				/>

				{hasExistingReport && !file ? (
					<div className="flex items-center justify-between z-20 relative">
						<div className="flex items-center space-x-3 overflow-hidden">
							<div className="p-2 bg-blue-500/10 text-blue-600 rounded">
								<FileText className="h-5 w-5" />
							</div>
							<div className="flex flex-col overflow-hidden">
								<span className="text-sm font-medium truncate max-w-45">
									{getFileNameFromUrl(existingReportUrl)}
								</span>
								<span className="text-xs text-muted-foreground">
									Existing uploaded document
								</span>
							</div>
						</div>
					</div>
				) : !file ? (
					<div className="flex flex-col items-center justify-center space-y-3 pointer-events-none">
						<div className="p-3 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform">
							<UploadCloud className="h-6 w-6" />
						</div>
						<div className="text-center">
							<p className="text-sm font-medium text-foreground">
								Click or drag to upload
							</p>
							<p className="text-xs text-muted-foreground mt-1">
								PDF, DOCX up to 10MB
							</p>
						</div>
					</div>
				) : (
					<div className="flex items-center justify-between z-20 relative">
						<div className="flex items-center space-x-3 overflow-hidden">
							<div className="p-2 bg-blue-500/10 text-blue-600 rounded">
								<FileText className="h-5 w-5" />
							</div>
							<div className="flex flex-col overflow-hidden">
								<span className="text-sm font-medium truncate max-w-45">
									{file.name}
								</span>
								<span className="text-xs text-muted-foreground">
									{(file.size / 1024 / 1024).toFixed(2)} MB
								</span>
							</div>
						</div>
						<Button
							variant="ghost"
							size="icon"
							className="h-8 w-8 text-muted-foreground hover:text-destructive"
							onClick={(e) => {
								e.stopPropagation();
								clearFile();
							}}>
							<X className="h-4 w-4" />
						</Button>
					</div>
				)}
			</div>
		</Field>
	);
}
