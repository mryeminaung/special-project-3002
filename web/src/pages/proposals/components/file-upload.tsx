import api from "@/api/api";
import ErrorMessage from "@/components/error-message";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Check, Loader2, Trash2, Upload } from "lucide-react";
import nprogress from "nprogress";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { type Control, useController } from "react-hook-form";

interface Props {
	control: Control<any>;
	error?: string;
}

type FileUploadHandle = {
	clear: () => Promise<void>;
};

const FileUpload = forwardRef<FileUploadHandle, Props>(
	({ control, error }, ref) => {
		const fileInputRef = useRef<HTMLInputElement>(null);

		const {
			field: { value: fileUrl, onChange: setFileUrl },
		} = useController({
			name: "fileUrl",
			control,
		});

		const [isUploading, setIsUploading] = useState(false);
		const [progress, setProgress] = useState(0);
		const [fileName, setFileName] = useState<string | null>(null);

		useImperativeHandle(ref, () => ({
			async clear() {
				if (fileUrl) {
					try {
						nprogress.start();
						await api.post("/delete-from-s3", { url: fileUrl });
					} catch (err) {
						console.error("Delete Error during clear:", err);
					} finally {
						nprogress.done();
					}
				}

				// clear local state
				setFileUrl("");
				setFileName(null);
				setProgress(0);
				setIsUploading(false);
				if (fileInputRef.current) {
					try {
						fileInputRef.current.value = "";
					} catch {}
				}
			},
		}));

		const handleFileSelect = async (files: FileList | null) => {
			const file = files?.[0];
			if (!file) return;

			// Reset states
			setFileName(file.name);
			setIsUploading(true);
			setProgress(0);
			nprogress.start();

			const formData = new FormData();
			formData.append("file", file);

			try {
				const response = await api.post("/upload-to-s3", formData, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
					onUploadProgress: (progressEvent) => {
						const percentCompleted = Math.round(
							(progressEvent.loaded * 100) / (progressEvent.total || 100),
						);
						setProgress(percentCompleted);
						nprogress.set(Math.min(1, Math.max(0, percentCompleted / 100)));
					},
				});

				setFileUrl(response.data.url);
				setProgress(100);
				nprogress.set(1);
			} catch (err) {
				console.error("Upload Error:", err);
				setFileName(null);
			} finally {
				setIsUploading(false);
				nprogress.done();
			}
		};

		const handleDelete = async () => {
			if (!fileUrl) return;

			try {
				nprogress.start();
				nprogress.set(0.5);
				await api.post("/delete-from-s3", { url: fileUrl });
				setFileUrl("");
				setFileName(null);
				setProgress(0);

				if (fileInputRef.current) {
					try {
						(fileInputRef.current as HTMLInputElement).value = "";
					} catch {}
				}
			} catch (err) {
				console.error("Delete Error:", err);
			} finally {
				nprogress.done();
			}
		};

		return (
			<Field>
				<FieldLabel htmlFor="proposal">
					Project Documents <span className="text-red-500">*</span>
				</FieldLabel>

				<div className="flex flex-col justify-center">
					{/* Hide dropzone if a file is already uploaded or uploading */}
					{!fileUrl && !isUploading && (
						<div
							className="border-2 w-full border-primary-950/50 border-dashed rounded-md p-8 flex flex-col items-center text-center cursor-pointer hover:bg-muted/50 transition-colors"
							onClick={() => fileInputRef.current?.click()}
							onDragOver={(e) => e.preventDefault()}
							onDrop={(e) => {
								e.preventDefault();
								handleFileSelect(e.dataTransfer.files);
							}}>
							<div className="mb-2 bg-muted rounded-full p-3">
								<Upload className="h-5 w-5 text-primary-950" />
							</div>
							<p className="text-sm font-medium text-foreground">
								Upload project proposal
							</p>
							<p className="text-sm text-muted-foreground mt-1">
								(Word, PDF, max 10MB)
							</p>
							<input
								type="file"
								id="proposal"
								ref={fileInputRef}
								className="hidden"
								accept=".doc,.docx,.pdf"
								onChange={(e) => handleFileSelect(e.target.files)}
							/>
						</div>
					)}

					{/* Status Card: Show during upload OR when file exists */}
					{(isUploading || fileUrl) && (
						<div className="border border-border rounded-lg p-3">
							<div className="flex items-center justify-between mb-2">
								<div className="flex items-center gap-2 overflow-hidden">
									{isUploading ? (
										<Loader2 className="h-4 w-4 animate-spin text-primary" />
									) : (
										<Check className="h-4 w-4 text-green-500" />
									)}
									<span className="text-sm font-medium truncate max-w-[200px]">
										{fileName || "Project Document"}
									</span>
								</div>

								{!isUploading && (
									<Button
										type="button"
										variant="ghost"
										size="sm"
										className="h-8 w-8 hover:text-red-500"
										onClick={handleDelete}>
										<Trash2 className="h-4 w-4" />
									</Button>
								)}
							</div>

							{isUploading ? (
								<div className="flex items-center gap-3">
									<div className="h-2 bg-muted rounded-full overflow-hidden flex-1">
										<div
											className="h-full bg-primary-800 transition-all duration-300"
											style={{ width: `${progress}%` }}></div>
									</div>
									<span className="text-xs text-muted-foreground">
										{progress}%
									</span>
								</div>
							) : (
								<p className="text-xs text-green-600 font-medium">
									Ready for submission
								</p>
							)}
						</div>
					)}
				</div>

				{error && <ErrorMessage error={error} />}
			</Field>
		);
	},
);

export default FileUpload;
