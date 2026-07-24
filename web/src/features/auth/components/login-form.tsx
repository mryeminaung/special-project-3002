import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { useTheme } from "@/hooks/use-theme";
import { useAuthStore } from "@/stores/use-auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconEye, IconEyeOff, IconLogin2, IconMail } from "@tabler/icons-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import * as z from "zod";
import authService from "../services/auth.service";

const LoginSchema = z.object({
	email: z
		.string()
		.email("Invalid email format")
		.regex(/^[\w-\d]+@miit\.edu\.mm$/i, "Email must end with @miit.edu.mm"),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

export function LoginForm() {
	const navigate = useNavigate();
	const [showPwd, setShowPwd] = useState(false);
	const { theme } = useTheme();
	const setAuthUser = useAuthStore((state) => state.setAuth);
	useHeaderInitializer("MIIT | Log In to the site", "");

	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<z.infer<typeof LoginSchema>>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: "myat_thuzar_tun@miit.edu.mm",
			password: "miit@123",
		},
		mode: "onTouched",
	});

	const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
		try {
			const response = await authService.login(data);
			setAuthUser(response);
			navigate("/dashboard");
		} catch (error: any) {
			if (error.status === 422) {
				setError(
					"email",
					{
						type: "validate",
						message: error.response.data.message,
					},
					{
						shouldFocus: true,
					},
				);
				setError(
					"password",
					{
						type: "validate",
						message: error.response.data.message,
					},
					{
						shouldFocus: true,
					},
				);
			}
		}
	};

	return (
		<div className="max-w-145 drop-shadow-2xl drop-shadow-primary-50/20 w-full">
			{/* <GradientWrapper> */}
			<Card className="overflow-hidden p-3 rounded-3xl px-1 sm:px-3 md:px-8 py-8">
				<CardHeader className="flex justify-center items-center">
					<img
						key={theme}
						src={
							"/login-pic.png"
							// theme === "dark" ? "/wordmark_light_text.png" : "/wordmark.png"
						}
						alt="MIIT SPMS Logo"
						className="max-h-36 w-full md:max-w-3xl object-contain"
					/>
				</CardHeader>
				<Separator />
				<CardContent className="">
					<form
						autoComplete="off"
						onSubmit={handleSubmit(onSubmit)}>
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor="email">Email</FieldLabel>
								<div className="relative">
									<Input
										{...register("email")}
										id="email"
										type="email"
										className="py-5.5 focus:ring-primary-900 border[1.5px] rounded-xl"
										placeholder="example@miit.edu.mm"
									/>
									<Tooltip>
										<TooltipTrigger asChild>
											<IconMail
												color="gray"
												className="absolute right-5 bottom-3 hover:cursor-pointer"
												size={20}
											/>
										</TooltipTrigger>
										<TooltipContent>
											<p>Enter MIIT email</p>
										</TooltipContent>
									</Tooltip>
								</div>
								{errors.email && (
									<FieldError>{errors.email.message}</FieldError>
								)}
							</Field>
							<Field>
								<FieldLabel htmlFor="password">Password</FieldLabel>
								<div className="relative">
									<Input
										{...register("password")}
										placeholder="********"
										id="password"
										className="py-5.5 focus:ring-primary-900 pr-12 border[1.5px] rounded-xl"
										type={showPwd ? "text" : "password"}
									/>
									{showPwd ? (
										<Tooltip>
											<TooltipTrigger asChild>
												<IconEye
													color="gray"
													className="absolute right-5 bottom-3 hover:cursor-pointer"
													onClick={() => setShowPwd(false)}
													size={20}
												/>
											</TooltipTrigger>
											<TooltipContent>
												<p>Show Password</p>
											</TooltipContent>
										</Tooltip>
									) : (
										<Tooltip>
											<TooltipTrigger asChild>
												<IconEyeOff
													color="gray"
													className="absolute right-5 bottom-3 hover:cursor-pointer"
													onClick={() => setShowPwd(true)}
													size={20}
												/>
											</TooltipTrigger>
											<TooltipContent>
												<p>Hide Password</p>
											</TooltipContent>
										</Tooltip>
									)}
								</div>
								{errors.password && (
									<FieldError>{errors.password.message}</FieldError>
								)}
							</Field>

							{/* todo */}
							<div className="hidden flex-col items-start sm:flex-row sm:items-center sm:justify-between gap-2">
								<Field
									orientation="horizontal"
									className="flex-1">
									<Checkbox
										id="checkBox"
										className="size-4 border-2 border-primary-500 data-[state=checked]:bg-primary-700 data-[state=checked]:border-primary-700 transition-all duration-200"
									/>
									<FieldLabel
										htmlFor="checkBox"
										className="font-medium">
										Remember Me
									</FieldLabel>
								</Field>
								<Link
									to="#"
									onClick={() => alert("Still working on!!!")}
									className="md:ml-auto text-blue-900 dark:text-blue-400 text-sm underline-offset-3 hover:text-blue-900/90 dark:hover:text-blue-400/90 font-medium hover:underline">
									Forgot your password?
								</Link>
							</div>
							<Button
								className="bg-primary-900 hover:cursor-pointer rounded-xl py-5.5 hover:bg-primary-800 mt-3 text-[15px] text-white dark:text-neutral-100"
								type="submit"
								disabled={isSubmitting}>
								<IconLogin2 />
								{isSubmitting ? (
									<span className="animate-pulse">Logging in...</span>
								) : (
									<span>Log in</span>
								)}
							</Button>
						</FieldGroup>
					</form>
				</CardContent>
			</Card>
			{/* </GradientWrapper> */}
		</div>
	);
}
