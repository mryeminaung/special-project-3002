import { ThemeToggle } from "@/components/common/theme-toggle";
import GuestLayout from "@/layouts/guest-layout";
import { LoginForm } from "../components/login-form";

export default function LoginPage() {
	return (
		<GuestLayout>
			<div
				className="min-h-svh p-6 md:p-10 flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat relative"
				style={{ backgroundImage: "url('/main_bg.jpg')" }}
			>
				<div className="absolute inset-0 bg-black/30" />
				<div className="absolute top-6 right-6 z-20">
					<ThemeToggle variant="floating" />
				</div>
				<div className="relative z-10 w-full max-w-lg flex flex-col items-center">
					<LoginForm />
				</div>
			</div>
		</GuestLayout>
	);
}
