import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { HasRole } from "@/lib/utils";
import type { UsersData } from "@/types";
import { useState } from "react";
import UnAuthorized from "../UnAuthorized";
import SupervisorsTable from "./components/supervisors-table";

const demoSupervisorData: UsersData[] = [
	{
		id: 9,
		name: "Dr. James Taylor",
		email: "james.taylor@miit.edu.mm",
		role: "Supervisor",
		status: "Active",
		rank: "Associate Professor",
		departmentName: "Software Engineering",
		phoneNumber: "+95 9 901 234 567",
	},
	{
		id: 10,
		name: "Dr. Maria Garcia",
		email: "maria.garcia@miit.edu.mm",
		role: "Supervisor",
		status: "Active",
		rank: "Tutor",
		departmentName: "Computer Science",
		phoneNumber: "+95 9 012 345 678",
	},
	{
		id: 12,
		name: "Dr. Patricia White",
		email: "patricia.white@miit.edu.mm",
		role: "Supervisor",
		status: "Active",
		rank: "Lecturer",
		departmentName: "Software Engineering",
		phoneNumber: "+95 9 234 567 890",
	},
];

export default function SupervisorsPage() {
	useHeaderInitializer("MIIT| Supervisors", "Project Supervisors");
	const [supervisorData] = useState<UsersData[]>(demoSupervisorData);

	if (HasRole("Student")) return <UnAuthorized />;

	return (
		<div className="mx-auto max-w-7xl">
			<h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
				Supervisors List
			</h1>
			<p className="text-sm text-neutral-500">
				Browse and manage project supervisors with their assignments and
				departments.
			</p>
			{supervisorData && <SupervisorsTable supervisorData={supervisorData} />}
		</div>
	);
}
