import { getDashboardData } from "../../services/dashboard.service";
import Heading from "@/components/heading";
import { PAGE_META, HEADINGS } from "@/constants/navigation";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { useQuery } from "@tanstack/react-query";
import { AdminCards } from "./components/admin-cards";
import StudentsByMajor from "./components/students-by-major";
import StudentsByBatch from "./components/students-by-batch";
import RecentStudents from "./components/recent-students";
import RecentEvents from "./components/recent-events";

export default function AdminDashboard() {
	useHeaderInitializer(PAGE_META.adminDashboard.title, PAGE_META.adminDashboard.subtitle);

	const { data, isLoading } = useQuery({
		queryKey: ["dashboardData"],
		queryFn: getDashboardData,
		retry: 1,
	});

	return (
		<div className="space-y-8">
			<Heading
				title={HEADINGS.adminDashboard.title}
				description={HEADINGS.adminDashboard.description}
			/>

			{isLoading ? (
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-pulse">
					{[...Array(6)].map((_, i) => (
						<div key={i} className="h-32 rounded-xl bg-muted" />
					))}
				</div>
			) : (
				data?.stats && <AdminCards stats={data.stats} />
			)}

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				{isLoading ? (
					<>
						<div className="h-48 rounded-xl bg-muted animate-pulse" />
						<div className="h-48 rounded-xl bg-muted animate-pulse" />
					</>
				) : (
					<>
						<StudentsByMajor data={data?.studentsByMajor ?? []} />
						<StudentsByBatch data={data?.studentsByBatch ?? []} />
					</>
				)}
			</div>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				{isLoading ? (
					<>
						<div className="h-64 rounded-xl bg-muted animate-pulse" />
						<div className="h-64 rounded-xl bg-muted animate-pulse" />
					</>
				) : (
					<>
						<RecentStudents students={data?.recentStudents ?? []} />
						<RecentEvents events={data?.recentEvents ?? []} />
					</>
				)}
			</div>
		</div>
	);
}
