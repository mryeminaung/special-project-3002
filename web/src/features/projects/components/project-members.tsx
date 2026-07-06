import Heading from "@/components/heading";

export default function ProjectMembers({
	members,
}: {
	members: { id: number; name: string; email: string }[];
}) {
	return (
		<div className="my-3 space-y-3">
			<Heading
				variant="sm"
				title="Project Members"
				description="Students working on this project."
			/>
			<div className="flex flex-wrap gap-3">
				{members &&
					members.map((member, idx) => (
						<div
							key={idx}
							className="flex items-center gap-4 p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
							<div className="space-y-1">
								<p className="text-sm font-semibold leading-none">
									{member.name}
								</p>
								<p className="text-xs text-muted-foreground truncate">
									{member.email}
								</p>
							</div>
						</div>
					))}
			</div>
		</div>
	);
}
