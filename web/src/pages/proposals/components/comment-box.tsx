import api from "@/api/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAuthUserStore } from "@/stores/useAuthUserStore";
import type { Comment } from "@/types";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconRefresh } from "@tabler/icons-react";
import { Loader2, MessageSquareIcon, SendIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const CommentSchema = z.object({
	proposal_id: z.number(),
	description: z
		.string()
		.min(3, "Comment must be at least 3 characters")
		.max(1000, "Comment cannot exceed 1000 characters"),
});

export default function CommentBox({
	proposalId,
	proposalStatus,
}: {
	proposalId: number;
	proposalStatus: "approved" | "rejected" | "pending";
}) {
	const authUser = useAuthUserStore((state) => state.authUser);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [comments, setComments] = useState<Comment[]>([]);
	const [editId, setEditId] = useState<number>(0);
	const isPendingProposal = proposalStatus === "pending";

	const fetchInitialCommits = async () => {
		const res = await api.get(`/comments/${proposalId}`);
		setComments(res.data);
	};

	useEffect(() => {
		fetchInitialCommits();
	}, []);

	const handleRefresh = async () => {
		setIsRefreshing(true);
		try {
			fetchInitialCommits();
		} finally {
			setTimeout(() => setIsRefreshing(false), 500);
		}
	};

	// const handleEdit = async (commentId: number, newDescription: string) => {
	// 	const res = await api.put(`/comments/${commentId}`, {
	// 		description: newDescription,
	// 	});
	// };

	const handleDelete = async (commentId: number) => {
		const res = await api.delete(`/comments/${commentId}`);
		if (res.status === 204) fetchInitialCommits();
	};

	const cardMotion = {
		initial: { opacity: 0, y: 8, scale: 0.995 },
		animate: { opacity: 1, y: 0, scale: 1 },
		exit: { opacity: 0, y: -8, scale: 0.995 },
		transition: { duration: 0.18 },
	};

	const roleColor = (role: string) => {
		switch (role) {
			case "Supervisor":
				return "bg-blue-100 text-blue-800 border-blue-200";
			case "IC":
				return "bg-purple-100 text-purple-800 border-purple-200";
			default:
				return "bg-gray-100 text-gray-800 border-gray-200";
		}
	};

	const { register, reset, handleSubmit } = useForm<
		z.infer<typeof CommentSchema>
	>({
		resolver: zodResolver(CommentSchema),
		defaultValues: { proposal_id: proposalId, description: "" },
	});

	const onSubmit = async (data: z.infer<typeof CommentSchema>) => {
		const res = await api.post("/comments/create", data);
		console.log(res.data);
		fetchInitialCommits();
		reset();
	};

	return (
		<Card className="border-gray-200 shadow-sm">
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between">
					<CardTitle className="flex items-center gap-2 text-lg font-bold">
						<MessageSquareIcon className="h-5 w-5 text-primary-600" />
						Comments & Feedback
						{comments.length > 0 && (
							<Badge
								variant="secondary"
								className="ml-2 px-2 py-0">
								{comments.length}
							</Badge>
						)}
					</CardTitle>
					{isPendingProposal && (
						<Button
							className="hover:cursor-pointer bg-primary-600 hover:bg-primary-600/80 ml-auto hover:text-white text-white"
							onClick={handleRefresh}
							variant={"outline"}>
							{isRefreshing ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								<IconRefresh className="h-4 w-4" />
							)}
							<span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
						</Button>
					)}
				</div>
			</CardHeader>

			<CardContent className="space-y-4">
				{/* Comments List */}
				<div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
					<AnimatePresence>
						{comments.length === 0 ? (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								className="flex flex-col items-center justify-center py-8 text-center">
								<MessageSquareIcon className="h-12 w-12 text-gray-300 mb-3" />
								<p className="text-gray-500 text-sm">
									No comments yet. Be the first to share your feedback!
								</p>
							</motion.div>
						) : (
							comments.map((c) => (
								<motion.div
									key={c.id}
									layout
									initial={cardMotion.initial}
									animate={cardMotion.animate}
									exit={cardMotion.exit}
									transition={cardMotion.transition}
									className="group rounded-lg border border-gray-100 p-4  hover:border-gray-300 transition-colors">
									<div className="flex items-center justify-between mb-2">
										<div className="flex items-center gap-2">
											<p className="font-bold text-sm">{c.author.name}</p>
											<Badge
												variant="outline"
												className={`${roleColor(
													c.author.role,
												)} text-[10px] capitalize px-1`}>
												{c.author.role === "IC"
													? "Instructor In-Charge"
													: c.author.role}
											</Badge>
										</div>
										<span className="text-[10px] text-gray-400 font-mono">
											{c.updatedAt}
										</span>
									</div>

									<p className="text-sm leading-relaxed">{c.description}</p>

									{/* Show actions only if it"s the user"s own comment */}
									{isPendingProposal && authUser.id === c.author.id && (
										<div className="flex gap-x-2 justify-end items-center mt-2">
											<Button
												size={"sm"}
												className="bg-yellow-300 font-semibold text-yellow-900 hover:bg-yellow-500 hover:text-white">
												<PencilSquareIcon />
											</Button>
											<Button
												size={"sm"}
												onClick={() => handleDelete(c.id)}
												className="bg-red-300 font-semibold text-red-900 hover:bg-red-500 hover:text-white">
												<TrashIcon />
											</Button>
										</div>
									)}
								</motion.div>
							))
						)}
					</AnimatePresence>
				</div>

				{/* Comment box */}
				{isPendingProposal && (
					<motion.form
						initial={{ opacity: 0, y: 6 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.18 }}
						onSubmit={handleSubmit(onSubmit)}
						className="pt-4 border-t border-gray-100 mt-4">
						<div className="space-y-3">
							<Textarea
								{...register("description")}
								placeholder="Write your feedback..."
								className="min-h-[100px] focus-visible:ring-primary-600"
							/>
							<div className="flex justify-end">
								<motion.div whileTap={{ scale: 0.98 }}>
									<Button className="bg-primary-600 hover:cursor-pointer hover:bg-primary-800 text-white gap-2">
										<SendIcon className="h-4 w-4" /> Send
									</Button>
								</motion.div>
							</div>
						</div>
					</motion.form>
				)}
			</CardContent>
		</Card>
	);
}
