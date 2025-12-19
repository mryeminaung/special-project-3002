import api from "@/api/api";
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
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { useAuthStore } from "@/stores/useAuthStore";
import { useAuthUserStore } from "@/stores/useAuthUserStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconEye, IconEyeOff, IconLogin2, IconMail } from "@tabler/icons-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import * as z from "zod";
import GradientWrapper from "../gradient-wrapper";

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
	const setAuthToken = useAuthStore((state) => state.setAuthToken);
	const setAuthUser = useAuthUserStore((state) => state.setAuthUser);
	useHeaderInitializer("MIIT | Log In to the site", "");

	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm<z.infer<typeof LoginSchema>>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: "myat_thuzar_tun@miit.edu.mm",
			password: "admin123",
			// email: "",
			// password: "",
		},
		mode: "onTouched",
	});

	const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
		try {
			const res = await api.post("login", data);
			if (res.data) {
				setAuthUser(res.data.user);
				setAuthToken(res.data.token);
				navigate("/dashboard");
			}
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
		<div className="max-w-[580px] drop-shadow-2xl drop-shadow-cherry-pie-50/20 backdrop-blur-3xl w-full">
			<GradientWrapper>
				<Card className="overflow-hidden p-3 rounded-[14px] px-1 sm:px-3 md:px-8 py-8">
					<CardHeader className="flex justify-center items-center">
						<img
							src="/logo_bg_rm.png"
							alt="Image"
							className="max-h-40 w-full md:max-w-3xl object-cover"
						/>
					</CardHeader>
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
											className="py-5.5 focus:ring-cherry-pie-900 border[1.5px]"
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
											className="py-5.5 focus:ring-cherry-pie-900 pr-12 border[1.5px]"
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
								<div className="flex flex-col items-start sm:flex-row sm:items-center sm:justify-between gap-2">
									<Field
										orientation="horizontal"
										className="flex-1">
										<Checkbox
											id="checkBox"
											className="accent-cherry-pie-900 w-4 h-4"
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
										className="md:ml-auto text-blue-900 text-sm underline-offset-3 hover:text-blue-900/90 font-medium hover:underline">
										Forgot your password?
									</Link>
								</div>
								<Button
									className="bg-cherry-pie-950 hover:cursor-pointer rounded-md py-[22px] hover:bg-cherry-pie-950/90 mt-3 text-[15px]"
									type="submit">
									<IconLogin2 />
									Log in
								</Button>
							</FieldGroup>
						</form>
					</CardContent>
				</Card>
			</GradientWrapper>
		</div>
	);
}
