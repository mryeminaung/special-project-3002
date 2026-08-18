import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IconCircleCheckFilled, IconArrowRight } from "@tabler/icons-react";
import { useEffect } from "react";
import { useNavigate } from "react-router";

interface ApprovalModalProps {
	isOpen: boolean;
	proposalTitle?: string;
	onComplete?: () => void;
}

export default function ApprovalModal({
	isOpen,
	proposalTitle,
	onComplete,
}: ApprovalModalProps) {
	const navigate = useNavigate();

	useEffect(() => {
		if (!isOpen) return;
		const timer = setTimeout(() => onComplete?.(), 3000);
		return () => clearTimeout(timer);
	}, [isOpen, onComplete]);

	return (
		<Dialog open={isOpen} onOpenChange={(v) => !v && onComplete?.()}>
			<DialogContent className="sm:max-w-sm text-center p-8 gap-0 [&>button:first-of-type]:hidden">
				{/* Icon */}
				<div className="flex justify-center mb-5">
					<div className="relative flex items-center justify-center">
						<div className="absolute h-20 w-20 rounded-full bg-emerald-100 dark:bg-emerald-950 animate-ping opacity-30" />
						<div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950">
							<IconCircleCheckFilled size={40} className="text-emerald-600 dark:text-emerald-400" />
						</div>
					</div>
				</div>

				{/* Text */}
				<h2 className="text-lg font-bold text-foreground">Proposal Approved!</h2>
				{proposalTitle && (
					<p className="mt-1 text-sm text-muted-foreground font-medium line-clamp-2">
						"{proposalTitle}"
					</p>
				)}
				<p className="mt-2 text-sm text-muted-foreground">
					This proposal has been approved and converted to an active project.
				</p>

				{/* Progress bar */}
				<div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-muted">
					<div
						className="h-full bg-emerald-500 rounded-full"
						style={{ animation: "progress 3s linear forwards" }}
					/>
				</div>
				<p className="mt-1.5 text-[10px] text-muted-foreground">Closing automatically…</p>

				{/* Actions */}
				<div className="mt-5 flex gap-2">
					<Button
						variant="outline"
						size="sm"
						className="flex-1"
						onClick={onComplete}>
						Done
					</Button>
					<Button
						size="sm"
						className="flex-1 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
						onClick={() => { onComplete?.(); navigate("/projects"); }}>
						View Projects
						<IconArrowRight size={14} />
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
