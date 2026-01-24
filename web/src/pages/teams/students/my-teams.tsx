import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { TeamCard } from "../components/team-card";

export default function MyTeams() {
	useHeaderInitializer("MIIT | My Teams", "My Teams");

	const mockTeams = [
		{
			id: "1",
			name: "AuthentiChain: Blockchain-Based Academic Certificate Verifier",
			description:
				"A dynamic team focused on developing cutting-edge solutions for modern challenges.",
			members: [
				{ id: "1", name: "Alice Johnson", avatar: "", role: "Team Lead" },
				{ id: "2", name: "Bob Smith", avatar: "", role: "Developer" },
				{ id: "3", name: "Carol Davis", avatar: "", role: "Designer" },
				{ id: "4", name: "David Wilson", avatar: "", role: "QA Engineer" },
			],
			supervisor: {
				id: "5",
				name: "Dr. John Smith",
				avatar: "",
				role: "Supervisor",
			},
			projectCount: 5,
			status: "approved",
			createdAt: "2024-01-15",
		},
		{
			id: "2",
			name: "VisionPass: AI-Powered Smart Parking & Security",
			description:
				"Pushing the boundaries of technology with groundbreaking research and development.",
			members: [
				{ id: "5", name: "Eve Adams", avatar: "", role: "Team Lead" },
				{ id: "6", name: "Frank White", avatar: "", role: "Researcher" },
				{ id: "7", name: "Grace Lee", avatar: "", role: "Data Scientist" },
			],
			supervisor: {
				id: "8",
				name: "Dr. Sarah Johnson",
				avatar: "",
				role: "Supervisor",
			},
			projectCount: 3,
			status: "approved",
			createdAt: "2023-11-01",
		},
		{
			id: "3",
			name: "TrustCircle: A Peer-to-Peer Micro-Lending & Savings Platform",
			description:
				"Collaborative efforts to create robust and scalable software solutions.",
			members: [
				{ id: "8", name: "Henry Green", avatar: "", role: "Project Manager" },
				{ id: "9", name: "Ivy Black", avatar: "", role: "Backend Dev" },
				{ id: "10", name: "Jack Brown", avatar: "", role: "Frontend Dev" },
			],
			supervisor: {
				id: "11",
				name: "Dr. Michael Chen",
				avatar: "",
				role: "Supervisor",
			},
			projectCount: 7,
			status: "approved",
			createdAt: "2024-03-20",
		},
		{
			id: "4",
			name: "RescuePoint: Community-Based Emergency Response System",
			description:
				"Collaborative efforts to create robust and scalable software solutions.",
			members: [
				{ id: "8", name: "Henry Green", avatar: "", role: "Project Manager" },
				{ id: "9", name: "Ivy Black", avatar: "", role: "Backend Dev" },
				{ id: "10", name: "Jack Brown", avatar: "", role: "Frontend Dev" },
			],
			supervisor: {
				id: "11",
				name: "Dr. Michael Chen",
				avatar: "",
				role: "Supervisor",
			},
			projectCount: 7,
			status: "approved",
			createdAt: "2024-03-20",
		},
	];
	return (
		<div className="mx-auto max-w-7xl">
			<div className="">
				<h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
					Team Workspace
				</h1>
				<p className="text-sm text-neutral-500">
					Oversee your active collaborations, track project status, and
					coordinate with supervisors.
				</p>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
				{mockTeams.map((team) => (
					<TeamCard
						key={team.id}
						team={team}
					/>
				))}
			</div>
		</div>
	);
}
