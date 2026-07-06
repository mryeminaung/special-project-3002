import api from "@/api/api";
import PageWrapper from "@/components/common/page-wrapper";
import Heading from "@/components/heading";
import Loading from "@/components/loading";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { useRoleChecker } from "@/hooks/use-role-checker";
import { IconInfoCircle } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import type { AnnouncementItem } from "../announcement.types";
import AnnouncementCards from "../components/announcement-cards";
import { NewAnnouncement } from "../components/new-announcement";

export default function AnnouncementsPage() {
	useHeaderInitializer("MIIT | Announcements", "Announcements");

	const { data: announcements = [], isLoading } = useQuery<AnnouncementItem[]>({
		queryKey: ["announcements"],
		queryFn: async () => {
			const res = await api.get("/announcements");
			return res.data;
		},
	});

	const hasAnnouncements = announcements.length > 0;

	const { isIC } = useRoleChecker();

	return (
		<PageWrapper>
			<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<Heading
					title="Announcements"
					description={
						isIC
							? "Create and manage announcements for students and faculties."
							: "View the latest announcements for students and faculties."
					}
				/>
				{isIC && <NewAnnouncement />}
			</div>

			{isLoading && (
				<div className="mt-5 flex justify-center">
					<Loading message="announcements" />
				</div>
			)}

			{!isLoading && hasAnnouncements && (
				<AnnouncementCards announcements={announcements} />
			)}

			{!isLoading && !hasAnnouncements && (
				<div className="mt-5 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-12 text-center">
					<div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-white text-neutral-500 shadow-sm">
						<IconInfoCircle size={24} />
					</div>
					<p className="text-base font-semibold text-neutral-800">
						No announcements yet
					</p>
					{isIC && (
						<p className="mt-1 text-sm text-neutral-600">
							Create your first announcement to notify students and faculties.
						</p>
					)}
				</div>
			)}
		</PageWrapper>
	);
}
