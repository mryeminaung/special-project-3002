import Heading from "@/components/heading";
import PageWrapper from "@/components/page-wrapper";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { ProjectCard } from "@/pages/projects/students/components/project-card";

export default function MyProjects() {
	useHeaderInitializer("MIIT | My Projects", "My Projects");

	const mockProjects = [
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
				name: "Dr. Aye Myat Tun",
				avatar: "",
				role: "Supervisor",
			},
			projectCount: 5,
			status: "under review",
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
				name: "Dr. Tun Aung",
				avatar: "",
				role: "Supervisor",
			},
			projectCount: 3,
			status: "completed",
			createdAt: "2023-11-01",
		},
		{
			id: "3",
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
				name: "U Yan Naing",
				avatar: "",
				role: "Supervisor",
			},
			projectCount: 4,
			status: "not started",
			createdAt: "2023-11-01",
		},
	];

	return (
		<PageWrapper>
			<Heading
				title="Projects Workspace"
				description="Oversee your active collaborations, track project status, and
					coordinate with supervisors."
			/>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
				{mockProjects.map((project) => (
					<ProjectCard
						key={project.id}
						project={project}
					/>
				))}
			</div>
		</PageWrapper>
	);
}
