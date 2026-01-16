import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Comment } from "@/types";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { IconX } from "@tabler/icons-react";
import { SendIcon, TrashIcon } from "lucide-react";

interface CommentItemProp {
	comment: Comment;
	isPendingProposal: boolean;
	editId: number;
	setEditId: (id: number) => void;
	handleDelete: (id: number) => void;
	authUser: any;
	roleColor: (role: string) => string;
}

export default function CommentItem({
	comment,
	isPendingProposal,
	editId,
	setEditId,
	handleDelete,
	roleColor,
	authUser,
}: CommentItemProp) {
	return (
		<div
			key={comment.id}
			className="group rounded-lg border border-gray-100 p-4 bg-white hover:border-gray-300 transition-colors">
			<form onSubmit={() => console.log("Hello World")}>
				<div className="flex items-center justify-between mb-2">
					<div className="flex items-center gap-2">
						<p className="font-bold text-sm text-gray-900">
							{comment.author.name}
						</p>
						<Badge
							variant="outline"
							className={`${roleColor(
								comment.author.role,
							)} text-[10px] capitalize px-1`}>
							{comment.author.role === "IC"
								? "Instructor In-Charge"
								: comment.author.role}
						</Badge>
					</div>
					<span className="text-[10px] text-gray-400 font-mono">
						{comment.updatedAt}
					</span>
				</div>
				<p className="text-sm text-gray-700 leading-relaxed">
					{comment.description}
				</p>
			</form>

			{/* Show actions only if it's the user's own comment */}
			{authUser.id === comment.author.id && isPendingProposal && (
				<div className="flex gap-x-2 justify-end items-center mt-2">
					{!(editId === comment.id) ? (
						<>
							<Button
								size={"sm"}
								onClick={() => setEditId(comment.id)}
								className="text-xs gap-2 bg-yellow-300 font-semibold text-yellow-900 hover:bg-yellow-500 hover:text-white ">
								<PencilSquareIcon className="h-2 w-2" /> Edit
							</Button>
							<Button
								size={"sm"}
								onClick={() => handleDelete(comment.id)}
								className="text-xs gap-2 bg-red-300 font-semibold text-red-900 hover:bg-red-500 hover:text-white">
								<TrashIcon className="h-2 w-2" /> Delete
							</Button>
						</>
					) : (
						<>
							<Button
								size={"sm"}
								onClick={() => setEditId(0)}
								className="text-xs gap-2 bg-white font-semibold text-gray-900 hover:bg-gray-200 hover:text-gray-500 ">
								<IconX className="h-2 w-2" /> Cancel
							</Button>
							<Button
								size={"sm"}
								onClick={() => handleDelete(comment.id)}
								className="text-xs gap-2 bg-blue-300 font-semibold text-blue-900 hover:bg-blue-500 hover:text-white">
								<SendIcon className="h-2 w-2" /> Update
							</Button>
						</>
					)}
				</div>
			)}
		</div>
	);
}
