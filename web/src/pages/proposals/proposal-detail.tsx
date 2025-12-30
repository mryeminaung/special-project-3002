import { Button } from "@/components/ui/button";
import RootLayout from "@/layouts/RootLayout";

export default function ProposalDetailPage() {
	return (
		<RootLayout>
			<Button
				onClick={() => alert("Need feedback why u reject this proposal")}
				variant={"destructive"}>
				Reject
			</Button>
			<Button
				onClick={() => console.log("Approved!")}
				variant={"default"}>
				Approve
			</Button>
		</RootLayout>
	);
}
