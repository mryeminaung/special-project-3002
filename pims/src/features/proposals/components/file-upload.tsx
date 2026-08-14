import { uploadProposalDocument } from "../services/proposal.service";
import ErrorMessage from "@/components/error-message";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { FileText, Loader2, Trash2, UploadCloud, X } from "lucide-react";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { type Control, useController } from "react-hook-form";

interface Props {
	control: Control<any>;
	error?: string;
}

export type FileUploadHandle = {
	clear: () => void;
};

function getFileNameFromUrl(url: string) {
	try {
		const decodedPath = decodeURIComponent(url.split("?")[0]);
		return decodedPath.split("/").pop() || "Uploaded document";
	} catch {
		return "Uploaded document";
	}
}

const FileUpload = forwardRef<FileUploadHandle, Props>(
	({ control, error }, ref) => {
		const fileInputRef = useRef<HTMLInputElement>(null);
		const [isUploading, setIsUploading] = useState(false);

		const {
			field: { value: fileUrl, onChange: setFileUrl },
		} = useController({
			name: "fileUrl",
			control,
			defaultValue: "",
		});

		const [fileUrlError, setFileUrlError] = useState<string | null>(null);

		const clearFile = () => {
			setFileUrl("");
			setFileUrlError(null);
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		};

		useImperativeHandle(ref, () => ({
			clear: async () => {
				clearFile();
			},
		}));

		const handleFileSelect = async (files: FileList | null) => {
			const file = files?.[0];
			if (!file) return;

			const formData = new FormData();
			formData.append("file", file);

			try {
				setIsUploading(true);
				setFileUrlError(null);
				const res = await uploadProposalDocument(formData);
				if (res.status === 200) {
					setFileUrl(res.data.url);
					setFileUrlError(null);
				} else {
					throw new Error("Invalid response from server");
				}
			} catch (err: any) {
				const msg =
					err?.response?.data?.message ||
					err.message ||
					"Upload failed";
				setFileUrlError(msg);

				setFileUrl("");
			} finally {
				setIsUploading(false);
			}
		};

		const hasUploadedFile = Boolean(fileUrl);
		const uploadedFileName = hasUploadedFile
			? getFileNameFromUrl(fileUrl)
			: "";

		return (
			<Field className="mt-5">
				<div className="mb-3 flex items-center justify-between gap-3">
					<FieldLabel
						htmlFor="proposal"
						className="mb-0 block font-semibold text-foreground"
					>
						Project Documents{" "}
						<span className="text-red-500">*</span>
					</FieldLabel>
					{hasUploadedFile && (
						<Button
							type="button"
							variant="outline"
							onClick={clearFile}
							className="gap-2"
						>
							<Trash2 className="h-4 w-4" />
							Clear
						</Button>
					)}
				</div>

				<div
					className={`relative group overflow-hidden rounded-xl border-2 border-dashed p-4 transition-all duration-200 ${hasUploadedFile ? "border-primary/50 bg-primary/5" : "border-muted-foreground/20 hover:border-primary/40 hover:bg-muted/30"}`}
				>
					<input
						type="file"
						id="proposal"
						ref={fileInputRef}
						className={`absolute inset-0 z-10 h-full w-full opacity-0 ${hasUploadedFile || isUploading ? "cursor-default pointer-events-none" : "cursor-pointer"}`}
						accept=".doc,.docx,.pdf"
						onChange={(e) => handleFileSelect(e.target.files)}
					/>

					{isUploading ? (
						<div className="flex flex-col items-center justify-center space-y-3 pointer-events-none">
							<div className="p-3 rounded-full bg-primary/10 text-primary">
								<Loader2 className="h-6 w-6 animate-spin" />
							</div>
							<div className="text-center">
								<p className="text-sm font-medium text-foreground">
									Uploading document...
								</p>
								<p className="text-xs text-muted-foreground mt-1">
									Please wait while the file is being saved.
								</p>
							</div>
						</div>
					) : hasUploadedFile ? (
						<div className="flex items-center justify-between z-20 relative">
							<div className="flex items-center space-x-3 overflow-hidden">
								<div className="p-2 bg-blue-500/10 text-blue-600 rounded">
									<FileText className="h-5 w-5" />
								</div>
								<div className="flex flex-col overflow-hidden">
									<span className="text-sm font-medium truncate max-w-45">
										{uploadedFileName}
									</span>
									<span className="text-xs text-muted-foreground">
										Uploaded document
									</span>
								</div>
							</div>
						</div>
					) : (
						<div className="flex flex-col items-center justify-center space-y-3 pointer-events-none">
							<div className="p-3 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform">
								<UploadCloud className="h-6 w-6" />
							</div>
							<div className="text-center">
								<p className="text-sm font-medium text-foreground">
									Click to upload proposal document
								</p>
								<p className="text-xs text-muted-foreground mt-1">
									PDF, DOCX up to 10MB
								</p>
							</div>
						</div>
					)}

					{hasUploadedFile && (
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="absolute right-3 top-3 z-20 h-8 w-8 text-muted-foreground hover:text-destructive"
							onClick={(e) => {
								e.stopPropagation();
								clearFile();
							}}
						>
							<X className="h-4 w-4" />
						</Button>
					)}
				</div>

				{(error || fileUrlError) && (
					<ErrorMessage error={fileUrlError || error} />
				)}
			</Field>
		);
	},
);

export default FileUpload;
