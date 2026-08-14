import { Button } from "@/components/ui/button";
import { IconUser, IconArrowRight } from "@tabler/icons-react";
import { useNavigate } from "react-router";

type RecentStudent = {
	id: number;
	name: string;
	email: string;
	major: string | null;
	joinedAt: string;
};

export default function RecentStudents({
	students,
}: {
	students: RecentStudent[];
}) {
	const navigate = useNavigate();

	if (!students?.length) return null;

	return (
		<div className="rounded-xl border bg-card p-5">
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-sm font-semibold">Recent Students</h3>
				<Button
					variant="ghost"
					size="sm"
					className="gap-1 text-xs text-muted-foreground"
					onClick={() => navigate("/admin/students")}
				>
					View all <IconArrowRight size={12} />
				</Button>
			</div>
			<div className="space-y-3">
				{students.map((student) => (
					<div key={student.id} className="flex items-center gap-3">
						<div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted shrink-0">
							<IconUser size={14} className="text-muted-foreground" />
						</div>
						<div className="flex-1 min-w-0">
							<p className="text-sm font-medium truncate">{student.name}</p>
							<p className="text-xs text-muted-foreground truncate font-mono">
								{student.email}
							</p>
						</div>
						<div className="text-right shrink-0">
							{student.major && (
								<p className="text-xs font-medium text-muted-foreground">{student.major}</p>
							)}
							<p className="text-[11px] text-muted-foreground">{student.joinedAt}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
