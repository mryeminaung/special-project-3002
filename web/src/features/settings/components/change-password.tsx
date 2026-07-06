import authService from "@/api/auth.service";
import ErrorMessage from "@/components/error-message";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Field,
	FieldContent,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/use-auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconEye, IconEyeOff, IconLoader2 } from "@tabler/icons-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const PasswordSchema = z
	.object({
		current_password: z.string().min(1, "Current password is required"),
		password: z.string().min(8, "New password must be at least 8 characters"),
		password_confirmation: z.string().min(1, "Please confirm your password"),
	})
	.refine((data) => data.password === data.password_confirmation, {
		message: "Passwords don't match",
		path: ["password_confirmation"],
	});
export default function ChangePassword() {
	const [showOld, setShowOld] = useState(false);
	const [showNew, setShowNew] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);

	const logout = useAuthStore((state) => state.logout);

	const {
		register,
		setError,
		formState: { errors, isSubmitting },
		handleSubmit,
		reset,
	} = useForm<z.infer<typeof PasswordSchema>>({
		resolver: zodResolver(PasswordSchema),
		defaultValues: {
			current_password: "",
			password: "",
			password_confirmation: "",
		},
	});

	const onSubmit = async (data: z.infer<typeof PasswordSchema>) => {
		try {
			await authService.changePassword(
				data.current_password,
				data.password,
				data.password_confirmation,
			);
			reset();
			logout();
		} catch (error: any) {
			const validationErrors = error.response?.data?.errors;
			if (validationErrors?.current_password) {
				setError("current_password", {
					type: "manual",
					message: validationErrors.current_password,
				});
			}
		}
	};

	return (
		<Card className="py-5">
			<CardHeader>
				<CardTitle>Security</CardTitle>
				<CardDescription>Manage your account password</CardDescription>
			</CardHeader>

			<CardContent>
				<form onSubmit={handleSubmit(onSubmit)}>
					<FieldGroup>
						{/* Old Password */}
						<Field>
							<FieldLabel>Old Password</FieldLabel>
							<FieldContent>
								<div className="relative">
									<Input
										type={showOld ? "text" : "password"}
										placeholder="********"
										{...register("current_password")}
										className={
											errors.current_password ? "border-red-500 pr-10" : "pr-10"
										}
									/>
									<button
										type="button"
										onClick={() => setShowOld(!showOld)}
										className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
										{showOld ? <IconEyeOff size={18} /> : <IconEye size={18} />}
									</button>
								</div>
								<CardDescription>Enter your current password</CardDescription>
								{errors.current_password && (
									<ErrorMessage error={errors.current_password.message} />
								)}
							</FieldContent>
						</Field>

						{/* New Password */}
						<Field>
							<FieldLabel>New Password</FieldLabel>
							<FieldContent>
								<div className="relative">
									<Input
										type={showNew ? "text" : "password"}
										placeholder="********"
										{...register("password")}
										className={
											errors.password ? "border-red-500 pr-10" : "pr-10"
										}
									/>
									<button
										type="button"
										onClick={() => setShowNew(!showNew)}
										className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
										{showNew ? <IconEyeOff size={18} /> : <IconEye size={18} />}
									</button>
								</div>
								<CardDescription>Create a new password</CardDescription>
								{errors.password && (
									<ErrorMessage error={errors.password.message} />
								)}
							</FieldContent>
						</Field>

						{/* Confirm Password */}
						<Field>
							<FieldLabel>Confirm Password</FieldLabel>
							<FieldContent>
								<div className="relative">
									<Input
										type={showConfirm ? "text" : "password"}
										placeholder="********"
										{...register("password_confirmation")}
										className={
											errors.password_confirmation
												? "border-red-500 pr-10"
												: "pr-10"
										}
									/>
									<button
										type="button"
										onClick={() => setShowConfirm(!showConfirm)}
										className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
										{showConfirm ? (
											<IconEyeOff size={18} />
										) : (
											<IconEye size={18} />
										)}
									</button>
								</div>
								<CardDescription>
									Re-enter your new password to confirm
								</CardDescription>
								{errors.password_confirmation && (
									<ErrorMessage error={errors.password_confirmation.message} />
								)}
							</FieldContent>
						</Field>

						<Button
							type="submit"
							disabled={isSubmitting}
							className="bg-primary-700 max-w-fit ml-auto hover:bg-primary-800 text-white">
							{isSubmitting ? (
								<>
									<IconLoader2
										className="animate-spin"
										size={18}
									/>
									Resetting Password
								</>
							) : (
								"Save changes"
							)}
						</Button>
					</FieldGroup>
				</form>
			</CardContent>
		</Card>
	);
}
