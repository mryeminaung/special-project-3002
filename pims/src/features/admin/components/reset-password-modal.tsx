import { useMutation } from "@tanstack/react-query";
import { resetFacultyPassword, type AdminFaculty } from "../services/admin.service";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useState } from "react";
import { IconCopy, IconCheck } from "@tabler/icons-react";

interface ResetPasswordModalProps {
	faculty: AdminFaculty | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export default function ResetPasswordModal({
	faculty,
	open,
	onOpenChange,
}: ResetPasswordModalProps) {
	const [tempPassword, setTempPassword] = useState<string | null>(null);
	const [copied, setCopied] = useState(false);

	const mutation = useMutation({
		mutationFn: () => resetFacultyPassword(faculty!.id),
		onSuccess: (data) => {
			setTempPassword(data.temp_password);
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || "Failed to reset password");
			onOpenChange(false);
		},
	});

	const handleReset = () => {
		setTempPassword(null);
		setCopied(false);
		mutation.mutate();
	};

	const handleCopy = async () => {
		if (tempPassword) {
			await navigator.clipboard.writeText(tempPassword);
			setCopied(true);
			toast.success("Password copied to clipboard");
			setTimeout(() => setCopied(false), 2000);
		}
	};

	const handleClose = () => {
		setTempPassword(null);
		setCopied(false);
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Reset Password</DialogTitle>
					<DialogDescription>
						{tempPassword
							? "A new temporary password has been generated. Share it securely with the faculty member."
							: `Generate a new temporary password for ${faculty?.name}?`}
					</DialogDescription>
				</DialogHeader>

				{tempPassword && (
					<div className="flex items-center gap-2 rounded-lg border bg-muted/50 px-4 py-3">
						<code className="flex-1 font-mono text-sm font-semibold tracking-wide">
							{tempPassword}
						</code>
						<Button
							variant="ghost"
							size="icon"
							className="h-8 w-8 shrink-0"
							onClick={handleCopy}
						>
							{copied ? (
								<IconCheck size={14} className="text-emerald-600" />
							) : (
								<IconCopy size={14} />
							)}
						</Button>
					</div>
				)}

				<DialogFooter>
					<Button
						variant="outline"
						onClick={handleClose}
						disabled={mutation.isPending}
					>
						{tempPassword ? "Done" : "Cancel"}
					</Button>
					{!tempPassword && (
						<Button
							variant="destructive"
							onClick={handleReset}
							disabled={mutation.isPending}
						>
							{mutation.isPending ? "Resetting..." : "Reset Password"}
						</Button>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
