import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import ProposalCard from "../components/proposal-card";

export default function MyProposasPage() {
	useHeaderInitializer("MIIT | My Proposals", "My Proposals");

	const mockProposals = [
		{
			id: "1",
			title: "Blockchain-Based Academic Certificate Verification System",
			slug: "blockchain-based-academic-certificate-verification-system",
			description:
				"A decentralized system for verifying academic certificates using blockchain technology to ensure authenticity and prevent fraud.",
			status: "pending",
			submitted_at: "2024-03-10",
			file: "https://example.com/proposal1.pdf",
			supervisor: {
				id: 1,
				name: "Dr. Alice Smith",
				email: "alice.smith@example.com",
			},
			submittedBy: {
				id: 101,
				name: "John Doe",
				email: "john.doe@example.com",
			},
			members: [
				{ id: 101, name: "John Doe", email: "john.doe@example.com" },
				{ id: 102, name: "Jane Roe", email: "jane.roe@example.com" },
				{ id: 103, name: "Peter Pan", email: "peter.pan@example.com" },
			],
		},
		{
			id: "2",
			title: "AI-Powered Smart Campus Navigation System",
			slug: "ai-powered-smart-campus-navigation-system",
			description:
				"An intelligent navigation system for university campuses, utilizing AI to provide real-time directions, facility information, and personalized routes.",
			status: "approved",
			submitted_at: "2024-02-20",
			file: "https://example.com/proposal2.pdf",
			supervisor: {
				id: 2,
				name: "Dr. Bob Johnson",
				email: "bob.johnson@example.com",
			},
			submittedBy: {
				id: 104,
				name: "Emily White",
				email: "emily.white@example.com",
			},
			members: [
				{ id: 104, name: "Emily White", email: "emily.white@example.com" },
			],
		},
	];

	return (
		<div className="flex flex-col mx-auto max-w-7xl gap-3 px-4">
			<div>
				<h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
					My Proposals
				</h1>
				<p className="text-sm text-neutral-500">
					View and track the status of proposals you've led or joined as a team
					member.
				</p>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{mockProposals.map((proposal) => (
					<ProposalCard
						key={proposal.id}
						proposal={proposal}
					/>
				))}
			</div>
		</div>
	);
}
