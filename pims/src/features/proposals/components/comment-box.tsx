import {
	getComments,
	createComment,
	editComment,
	deleteComment,
} from "../services/proposal.service";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/stores/use-auth-store";
import type { Comment } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ROLE_COLORS, ROLE_LABELS } from "@/constants/badge-colors";
import {
	MessageSquareIcon,
	PencilIcon,
	SendIcon,
	Trash2Icon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const CommentSchema = z.object({
	proposal_id: z.number(),
	description: z
		.string()
		.min(3, "Comment must be at least 3 characters")
		.max(1000, "Comment cannot exceed 1000 characters"),
});

function getInitials(name: string) {
	const parts = name.trim().split(" ");
	if (parts.length === 1) return parts[0][0].toUpperCase();
	return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}


export default function CommentBox({
	proposalId,
	proposalStatus,
	canComment = false,
}: {
	proposalId: number;
	proposalStatus: "approved" | "rejected" | "pending";
	canComment?: boolean;
}) {
	const authUser = useAuthStore((state) => state.authUser);
	const queryClient = useQueryClient();
	const [editingComment, setEditingComment] = useState<Comment | null>(null);
	const [editText, setEditText] = useState("");
	const isPendingProposal = proposalStatus === "pending";
	const queryKey = ["comments", proposalId];

	const { data: comments = [] } = useQuery({
		queryKey,
		queryFn: () => getComments(proposalId),
	});

	const invalidate = () => queryClient.invalidateQueries({ queryKey });

	const deleteMutation = useMutation({
		mutationFn: (commentId: number) => deleteComment(commentId),
		onSuccess: invalidate,
	});

	const editMutation = useMutation({
		mutationFn: ({ commentId, description }: { commentId: number; description: string }) =>
			editComment(proposalId, commentId, description),
		onSuccess: () => {
			setEditingComment(null);
			setEditText("");
			invalidate();
		},
	});

	const addMutation = useMutation({
		mutationFn: (data: z.infer<typeof CommentSchema>) => createComment(data),
		onSuccess: () => { reset(); invalidate(); },
	});

	const openEdit = (comment: Comment) => {
		setEditingComment(comment);
		setEditText(comment.description);
	};

	const { register, reset, handleSubmit } = useForm<
		z.infer<typeof CommentSchema>
	>({
		resolver: zodResolver(CommentSchema),
		defaultValues: { proposal_id: proposalId, description: "" },
	});

	return (
		<>
			{/* Edit dialog */}
			<Dialog
				open={!!editingComment}
				onOpenChange={(open) => {
					if (!open) {
						setEditingComment(null);
						setEditText("");
					}
				}}
			>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Edit Comment</DialogTitle>
					</DialogHeader>
					<Textarea
						value={editText}
						onChange={(e) => setEditText(e.target.value)}
						className="min-h-32 resize-none focus-visible:ring-primary-600"
						placeholder="Edit your commentâ€¦"
					/>
					<DialogFooter>
						<DialogClose asChild>
							<Button type="button" variant="outline">
								Cancel
							</Button>
						</DialogClose>
						<Button
							type="button"
							onClick={() => editingComment && editMutation.mutate({ commentId: editingComment.id, description: editText.trim() })}
							disabled={editMutation.isPending || !editText.trim()}
							className="bg-primary-600 hover:bg-primary-700 text-white"
						>
							{editMutation.isPending ? "Saving…" : "Update"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Section */}
			<div>
				{/* Heading */}
				<div className="flex items-center gap-2 mb-4">
					<MessageSquareIcon className="h-4 w-4 text-primary-600" />
					<h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
						Comments & Feedback
					</h2>
					{comments.length > 0 && (
						<span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary-100 px-1 text-[10px] font-mono text-primary-700">
							{comments.length}
						</span>
					)}
				</div>

				{/* Comments list */}
				<div className="space-y-3">
					<AnimatePresence>
						{comments.length === 0 ? (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								className="flex flex-col items-center justify-center rounded-xl border border-dashed py-10 text-center"
							>
								<MessageSquareIcon className="mb-2 h-8 w-8 text-muted-foreground/30" />
								<p className="text-sm text-muted-foreground">
									No comments or feedback yet.
								</p>
							</motion.div>
						) : (
							comments.map((c) => (
								<motion.div
									key={c.id}
									layout
									initial={{ opacity: 0, y: 6 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -6 }}
									transition={{ duration: 0.15 }}
									className="flex gap-3 rounded-xl border bg-card p-4"
								>
									{/* Avatar */}
									<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
										{getInitials(c.author.name)}
									</div>

									<div className="flex-1 min-w-0">
										{/* Author row */}
										<div className="flex items-center justify-between gap-2 mb-2">
											<div className="flex items-center gap-2 min-w-0">
												<p className="text-sm font-semibold truncate">
													{c.author.name}
												</p>
												<span
													className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium ${
														ROLE_COLORS[
															c.author.role
														] ??
														"bg-gray-100 text-gray-700"
													}`}
												>
													{ROLE_LABELS[
														c.author.role
													] ?? c.author.role}
												</span>
											</div>
											<span className="shrink-0 font-mono text-[10px] text-muted-foreground">
												{c.updatedAt}
											</span>
										</div>

										{/* Text */}
										<p className="text-sm leading-relaxed text-foreground">
											{c.description}
										</p>

										{/* Own comment actions */}
										{isPendingProposal &&
											authUser.id === c.author.id && (
												<div className="mt-2 flex justify-end gap-1.5">
													<Button
														size="sm"
														variant="ghost"
														onClick={() =>
															openEdit(c)
														}
														className="h-7 gap-1 px-2 text-xs text-muted-foreground hover:text-foreground"
													>
														<PencilIcon className="size-3" />
														Edit
													</Button>
													<Button
														size="sm"
														variant="ghost"
														onClick={() =>
															deleteMutation.mutate(c.id)
														}
														className="h-7 gap-1 px-2 text-xs text-red-500 hover:bg-red-50 hover:text-red-700"
													>
														<Trash2Icon className="size-3" />
														Delete
													</Button>
												</div>
											)}
									</div>
								</motion.div>
							))
						)}
					</AnimatePresence>
				</div>

				{/* New comment form */}
				{isPendingProposal && canComment && (
					<motion.form
						initial={{ opacity: 0, y: 6 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.15 }}
						onSubmit={handleSubmit((data) => addMutation.mutate(data))}
						className="mt-4 border-t pt-4"
					>
						<Textarea
							{...register("description")}
							placeholder="Write your feedbackâ€¦"
							className="min-h-24 resize-none focus-visible:ring-primary-600"
						/>
						<div className="mt-3 flex justify-end">
							<Button
								type="submit"
								className="gap-2 bg-primary-600 hover:bg-primary-700 text-white"
							>
								<SendIcon className="h-3.5 w-3.5" />
								Send
							</Button>
						</div>
					</motion.form>
				)}
			</div>
		</>
	);
}


