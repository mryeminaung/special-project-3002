import { ArrowLeftIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";

export default function NavigateTo({
	to: url,
	label,
}: {
	to: string;
	label: string;
}) {
	const navigate = useNavigate();

	return (
		<Button
			onClick={() => navigate(url)}
			variant="ghost"
			className="mb-4 flex bg-primary-600 hover:bg-primary-500 text-white hover:cursor-pointer hover:text-white items-center gap-2">
			<ArrowLeftIcon className="h-4 w-4" />
			{label}
		</Button>
	);
}
