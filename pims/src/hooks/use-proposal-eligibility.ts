import { useQuery } from "@tanstack/react-query";
import { useRoleChecker } from "./use-role-checker";
import { getProposalEligibility } from "@/features/proposals/services/proposal.service";

export type ProposalEligibility = {
	canCreate: boolean;     // create a student/faculty-type proposal
	canJoin: boolean;       // join a faculty proposal (students only)
	eligible: boolean;      // faculty: not at cap; student: canCreate && canJoin
	isAccepted: boolean;    // student already accepted into a proposal
	pendingCount: number;   // student: pending apps; faculty: active supervised
	pendingLimit: number;   // student: 3; faculty: 5
	reason: string | null;
	isLoading: boolean;
};

export function useProposalEligibility(): ProposalEligibility {
	const { isStudent, isFaculty, isIC } = useRoleChecker();
	const enabled = isStudent || (isFaculty && !isIC);

	const { data, isLoading } = useQuery({
		queryKey: ["proposalEligibility"],
		queryFn: getProposalEligibility,
		enabled,
		staleTime: 30_000,
	});

	const d = data?.data;

	if (isStudent) {
		return {
			canCreate:    d?.canCreate    ?? true,
			canJoin:      d?.canJoin      ?? true,
			eligible:     (d?.canCreate ?? true) && (d?.canJoin ?? true),
			isAccepted:   d?.isAccepted   ?? false,
			pendingCount: d?.pendingCount ?? 0,
			pendingLimit: d?.pendingLimit ?? 3,
			reason:       d?.reason       ?? null,
			isLoading,
		};
	}

	// Faculty
	return {
		canCreate:    d?.eligible     ?? true,
		canJoin:      true,
		eligible:     d?.eligible     ?? true,
		isAccepted:   false,
		pendingCount: d?.current      ?? 0,
		pendingLimit: d?.limit        ?? 5,
		reason:       d?.reason       ?? null,
		isLoading,
	};
}
