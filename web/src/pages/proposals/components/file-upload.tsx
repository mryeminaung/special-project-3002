import api from "@/api/api";
import ErrorMessage from "@/components/error-message";
import { Field, FieldLabel } from "@/components/ui/field";
import { forwardRef, useRef, useState } from "react";
import { type Control, useController } from "react-hook-form";

interface Props {
	control: Control<any>;
	error?: string;
}

export type FileUploadHandle = {
	clear: () => void;
};

const FileUpload = forwardRef<FileUploadHandle, Props>(
	({ control, error }, ref) => {
		const fileInputRef = useRef<HTMLInputElement>(null);

		const {
			field: { value: fileUrl, onChange: setFileUrl },
		} = useController({
			name: "fileUrl",
			control,
			defaultValue: "",
		});

		const [fileUrlError, setFileUrlError] = useState<string | null>(null);

		const handleFileSelect = async (files: FileList | null) => {
			const file = files?.[0];
			if (!file) return;

			const formData = new FormData();
			formData.append("file", file);

			try {
				// Updated to generic upload endpoint for Local Storage
				const res = await api.post("/upload-to-s3", formData, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
				});
				if (res.data.status === 200) {
					setFileUrl(res.data.data.url);
					setFileUrlError(null);
				} else {
					throw new Error("Invalid response from server");
				}
			} catch (err: any) {
				const msg =
					err?.response?.data?.message || err.message || "Upload failed";
				setFileUrlError(msg);

				setFileUrl("");
			}
		};

		return (
			<Field className="mt-5">
				<FieldLabel htmlFor="proposal">
					Project Documents <span className="text-red-500">*</span>
				</FieldLabel>

				<div className="flex flex-col justify-center">
					<input
						type="file"
						id="proposal"
						ref={fileInputRef}
						className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
						accept=".doc,.docx,.pdf"
						onChange={(e) => handleFileSelect(e.target.files)}
					/>
				</div>

				{(error || fileUrlError) && (
					<ErrorMessage error={fileUrlError || error} />
				)}
			</Field>
		);
	},
);

export default FileUpload;
