import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import RootLayout from "@/layouts/RootLayout";
import type { UsersData } from "@/types";
import { HasRole } from "@/lib/utils";
import { useState } from "react";
import UnAuthorized from "../UnAuthorized";
import UsersTable from "./components/users-table";

// Demo data for supervisors
const demoSupervisorData: UsersData[] = [
	{
		id: 1,
		name: "Dr. John Smith",
		email: "john.smith@miit.edu.mm",
		role: "Supervisor",
		status: "Active",
		rank: "Professor",
		departmentName: "Computer Science",
		phoneNumber: "+95 9 123 456 789",
	},
	{
		id: 2,
		name: "Dr. Sarah Johnson",
		email: "sarah.johnson@miit.edu.mm",
		role: "Supervisor",
		status: "Active",
		rank: "Associate Professor",
		departmentName: "Information Technology",
		phoneNumber: "+95 9 234 567 890",
	},
	{
		id: 3,
		name: "Dr. Michael Chen",
		email: "michael.chen@miit.edu.mm",
		role: "Supervisor",
		status: "Active",
		rank: "Professor",
		departmentName: "Software Engineering",
		phoneNumber: "+95 9 345 678 901",
	},
	{
		id: 4,
		name: "Dr. Emily Davis",
		email: "emily.davis@miit.edu.mm",
		role: "Supervisor",
		status: "Active",
		rank: "Lecturer",
		departmentName: "Computer Science",
		phoneNumber: "+95 9 456 789 012",
	},
	{
		id: 5,
		name: "Dr. Robert Wilson",
		email: "robert.wilson@miit.edu.mm",
		role: "Supervisor",
		status: "Active",
		rank: "Associate Professor",
		departmentName: "Information Technology",
		phoneNumber: "+95 9 567 890 123",
	},
	{
		id: 6,
		name: "Dr. Lisa Anderson",
		email: "lisa.anderson@miit.edu.mm",
		role: "Supervisor",
		status: "Active",
		rank: "Assistant Lecturer",
		departmentName: "Software Engineering",
		phoneNumber: "+95 9 678 901 234",
	},
	{
		id: 7,
		name: "Dr. David Brown",
		email: "david.brown@miit.edu.mm",
		role: "Supervisor",
		status: "Active",
		rank: "Professor",
		departmentName: "Computer Science",
		phoneNumber: "+95 9 789 012 345",
	},
	{
		id: 8,
		name: "Dr. Jennifer Martinez",
		email: "jennifer.martinez@miit.edu.mm",
		role: "Supervisor",
		status: "Active",
		rank: "Lecturer",
		departmentName: "Information Technology",
		phoneNumber: "+95 9 890 123 456",
	},
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
		id: 11,
		name: "Dr. William Lee",
		email: "william.lee@miit.edu.mm",
		role: "Supervisor",
		status: "Active",
		rank: "Professor",
		departmentName: "Information Technology",
		phoneNumber: "+95 9 123 456 789",
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

	if (HasRole("Student")) return <UnAuthorized />;

	const [supervisorData] = useState<UsersData[]>(demoSupervisorData);

	return (
		<RootLayout>
			<div className="px-4 lg:px-6">
				<h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
					Supervisors List
				</h1>
				<p className="text-sm text-neutral-500">
					Browse and manage project supervisors with their assignments and
					departments.
				</p>
				{supervisorData && <UsersTable supervisorData={supervisorData} />}
			</div>
		</RootLayout>
	);
}
