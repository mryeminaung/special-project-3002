import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { HasRole } from "@/lib/utils";
import { useAuthUserStore } from "@/stores/useAuthUserStore";
import { MessageSquareIcon, SendIcon } from "lucide-react";
import { useState } from "react";

type Comment = {
	id: number;
	author: {
		name: string;
		role: "Student" | "Supervisor" | "IC";
	};
	content: string;
	created_at: string;
};

export default function CommentBox() {
	const [comment, setComment] = useState("");
	const [comments, setComments] = useState<Comment[]>([]);

	const authUser = useAuthUserStore((state) => state.authUser);

	const handleSubmit = () => {
		if (!comment.trim()) return;

		setComments((prev) => [
			...prev,
			{
				id: Date.now(),
				author: authUser,
				content: comment,
				created_at: new Date().toLocaleDateString(),
			},
		]);

		setComment("");
	};

	const roleColor = (role: Comment["author"]["role"]) => {
		switch (role) {
			case "Supervisor":
				return "bg-blue-100 text-blue-800";
			case "IC":
				return "bg-purple-100 text-purple-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	return (
		<Card className="border-gray-200 shadow-sm">
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-lg">
					<MessageSquareIcon className="h-5 w-5 text-primary-600" />
					Comments & Feedback
					{/* {comments.length > 0 && ( */}
					<Badge className="bg-primary-500 h-5 min-w-5 rounded-full px-1 font-mono tabular-nums text-xs text-center text-white">
						{/* {comments.length} */}3
					</Badge>
					{/* )} */}
				</CardTitle>
			</CardHeader>

			<CardContent className="space-y-6">
				<div className="space-y-4">
					{/* {comments.map((c) => ( */}
					<div
						// key={c.id}
						className="rounded-lg border border-gray-200 p-4 bg-gray-50">
						<div className="flex items-center justify-between mb-2">
							<div className="flex items-center gap-2">
								<p className="font-medium text-gray-900">Daw Myat Thuzar Tun</p>
								<Badge className={roleColor("IC")}>
									{authUser.role !== "Student"
										? authUser.role
										: "Instructor In-Charge"}
								</Badge>
							</div>
							<span className="text-xs text-gray-500">1/3/2025</span>
						</div>

						<p className="text-sm text-gray-700 whitespace-pre-line">
							blah blah blah...
						</p>
					</div>
					{/* ))} */}
				</div>

				{!HasRole("Student") && (
					<div className="space-y-3">
						<Textarea
							placeholder="Write your comment or feedback..."
							value={comment}
							onChange={(e) => setComment(e.target.value)}
							className="min-h-[100px]"
						/>

						<div className="flex justify-end">
							<Button
								onClick={handleSubmit}
								className="flex items-center gap-2 bg-primary-600 font-semibold text-white hover:bg-primary-500">
								<SendIcon className="h-4 w-4" />
								Send
							</Button>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
