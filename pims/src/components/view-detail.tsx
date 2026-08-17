import { Eye } from "lucide-react";
import { Link } from "react-router";

export default function ViewDetail({ url }: { url: string }) {
	return (
		<Link
			to={url}
			className="inline-flex items-center gap-1 bg-primary-600 hover:bg-primary-700 transition-colors text-white px-2 py-1.5 rounded-md">
			<Eye className="size-3.5" />
			<span className="text-[11px]">View</span>
		</Link>
	);
}
