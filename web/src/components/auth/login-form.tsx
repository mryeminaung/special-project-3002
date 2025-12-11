import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { IconEye, IconEyeOff, IconLogin2 } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router";

import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

export function LoginForm() {
	const navigate = useNavigate();
	const [showPwd, setShowPwd] = useState(false);

	useHeaderInitializer("MIIT | Log In to the site", "");

	return (
		<div className="max-w-[580px] drop-shadow-2xl drop-shadow-cherry-pie-50/20 backdrop-blur-3xl w-full">
			<div className="bg-linear-to-b from-cherry-pie-900 via-white/10 to-white/5 p-1 rounded-2xl">
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
							onSubmit={(e) => {
								e.preventDefault();
								navigate("/dashboard");
							}}>
							<FieldGroup>
								<Field>
									<FieldLabel htmlFor="email">Email</FieldLabel>
									<Input
										id="email"
										type="email"
										className="py-5.5 border[1.5px]"
										placeholder="example@miit.edu.mm"
									/>
								</Field>
								<Field>
									<FieldLabel htmlFor="password">Password</FieldLabel>
									<div className="relative">
										<Input
											placeholder="********"
											id="password"
											className="py-5.5 pr-12 border[1.5px]"
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
								</Field>
								<div className="flex flex-col items-start sm:flex-row sm:items-center sm:justify-between gap-2">
									<FieldLabel>
										<input
											type="checkbox"
											id="checkBox"
											className="accent-cherry-pie-900 w-4 h-4"
										/>
										<FieldLabel
											htmlFor="checkBox"
											className="font-medium">
											Remember Me
										</FieldLabel>
									</FieldLabel>
									<a
										href="#"
										className="md:ml-auto text-blue-900 text-sm underline-offset-3 hover:text-blue-900/90 font-medium hover:underline">
										Forgot your password?
									</a>
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
			</div>
		</div>
	);
}
