import { updateProfile } from "../services/settings.service";
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
	FieldDescription,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/stores/use-auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconLoader2 } from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import ChangeAvatar from "./upload-avatar";

const ProfileSchema = z.object({
	phoneNo: z.string().min(8, "Invalid phone number"),
	address: z.string().min(5, "Address is too short"),
});

export default function ChangeProfile() {
	const authUser = useAuthStore((state) => state.authUser);
	const setAuth = useAuthStore((state) => state.setAuth);

	const {
		register,
		handleSubmit,
		formState: { isSubmitting },
	} = useForm<z.infer<typeof ProfileSchema>>({
		resolver: zodResolver(ProfileSchema),
		defaultValues: {
			phoneNo: authUser?.phoneNumber ?? "",
			address: authUser?.address ?? "",
		},
	});

	// update phone number and
	const onSubmit = async (data: z.infer<typeof ProfileSchema>) => {
		try {
			const resData = await updateProfile(data);
			setAuth(resData);
			toast.success("Profile updated successfully!");
		} catch (error) {
			toast.error("Failed to update profile.");
		}
	};

	return (
		<Card className="py-5">
			<CardHeader>
				<CardTitle>Profile</CardTitle>
				<CardDescription>Update your personal information</CardDescription>
			</CardHeader>

			<CardContent className="space-y-6">
				<ChangeAvatar />

				<Separator />

				<form onSubmit={handleSubmit(onSubmit)}>
					<FieldGroup>
						<Field>
							<FieldLabel>Name</FieldLabel>
							<FieldContent className="cursor-not-allowed">
								<Input
									value={authUser?.name}
									disabled
								/>
								<FieldDescription>
									Your full name (cannot be changed)
								</FieldDescription>
							</FieldContent>
						</Field>

						<Field>
							<FieldLabel>Email</FieldLabel>
							<FieldContent className="cursor-not-allowed">
								<Input
									value={authUser?.email}
									disabled
								/>
								<FieldDescription>Primary email address</FieldDescription>
							</FieldContent>
						</Field>

						<Field>
							<FieldLabel>Phone</FieldLabel>
							<FieldContent>
								<Input
									{...register("phoneNo")}
									placeholder="09xxxxxxxxx"
								/>
								<FieldDescription>
									Used for contact and recovery
								</FieldDescription>
							</FieldContent>
						</Field>

						<Field>
							<FieldLabel>Address</FieldLabel>
							<FieldContent>
								<Input
									{...register("address")}
									placeholder="Enter your current address"
								/>
								<FieldDescription>
									Your current residential address
								</FieldDescription>
							</FieldContent>
						</Field>

						<Button
							type="submit"
							disabled={isSubmitting}
							className="bg-primary-700 max-w-fit ml-auto hover:bg-primary-800 text-white">
							{isSubmitting && (
								<IconLoader2
									className="mr-2 animate-spin"
									size={16}
								/>
							)}
							Update changes
						</Button>
					</FieldGroup>
				</form>
			</CardContent>
		</Card>
	);
}
