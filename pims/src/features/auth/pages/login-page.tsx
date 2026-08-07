import { ThemeToggle } from "@/components/common/theme-toggle";
import GuestLayout from "@/layouts/guest-layout";
import GetHelp from "../components/get-help";
import { LoginForm } from "../components/login-form";

export default function LoginPage() {
	return (
		<GuestLayout>
			<div className=" min-h-svh p-6 md:p-10 flex flex-col items-center justify-center ">
				<ThemeToggle variant="floating" />
				<LoginForm />
				<GetHelp />
			</div>
		</GuestLayout>
	);
}
