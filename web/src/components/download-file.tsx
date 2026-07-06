import { Download } from "lucide-react";
import { Button } from "./ui/button";

export default function DownloadFile({ fileUrl }: { fileUrl: string }) {
	return (
		<Button
			asChild
			className="w-full sm:w-fit gap-2 bg-primary-600 font-semibold text-white hover:bg-primary-500 hover:cursor-pointer">
			<a
				href={fileUrl}
				target="_blank"
				rel="noopener noreferrer"
				download>
				<Download className="h-4 w-4" />
				Download
			</a>
		</Button>
	);
}
