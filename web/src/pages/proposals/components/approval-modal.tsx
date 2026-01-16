import { Check, Loader2 } from "lucide-react";
import { useEffect } from "react";

interface ApprovalModalProps {
	isOpen: boolean;
	isLoading: boolean;
	onComplete?: () => void;
}

export default function ApprovalModal({
	isOpen,
	isLoading,
	onComplete,
}: ApprovalModalProps) {
	useEffect(() => {
		if (!isLoading && isOpen && onComplete) {
			// Keep checkmark visible for 1.5 seconds before closing
			const timer = setTimeout(onComplete, 1500);
			return () => clearTimeout(timer);
		}
	}, [isLoading, isOpen, onComplete]);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
			<div className="relative z-10 flex flex-col items-center justify-center">
				{isLoading ? (
					<>
						<Loader2 className="h-16 w-16 animate-spin text-white" />
						<p className="mt-4 text-lg font-semibold text-white">
							Approving proposal...
						</p>
					</>
				) : (
					<>
						<div className="rounded-full bg-green-500 p-4 animate-in fade-in zoom-in-50">
							<Check className="h-16 w-16 text-white" />
						</div>
						<p className="mt-4 text-lg font-semibold text-white">
							Proposal Approved!
						</p>
					</>
				)}
			</div>
		</div>
	);
}
