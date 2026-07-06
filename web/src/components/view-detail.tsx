import { Eye } from "lucide-react";
import { Link } from "react-router";

export default function ViewDetail({ url }: { url: string }) {
	return (
		<Link
			to={url}
			className="bg-primary-800 hover:cursor-pointer hover:bg-primary-800/80 flex items-center text-white px-2 py-2 rounded-md gap-x-1 justify-center">
			<Eye className="size-4" />
			<span className="text-[12px]">View</span>
		</Link>
	);
}
