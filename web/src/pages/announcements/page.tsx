import api from "@/api/api";
import Heading from "@/components/heading";
import Loading from "@/components/loading";
import PageWrapper from "@/components/page-wrapper";
import { Badge } from "@/components/ui/badge";
import {
	IconCalendarEvent,
	IconInfoCircle,
	IconSpeakerphone,
	IconUser,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { NewAnnouncement } from "./components/new-announcement";

type AnnouncementAudience = "students" | "faculties" | "both";

type AnnouncementItem = {
	id: number;
	title: string;
	description: string;
	audience: AnnouncementAudience;
	createdAt: string;
	announcer: string;
};

function formatAnnouncementDate(value: string) {
	const parsed = new Date(value);
	if (Number.isNaN(parsed.getTime())) {
		return value;
	}

	return parsed.toLocaleString();
}

function getAudienceBadgeClass(audience: AnnouncementAudience) {
	switch (audience) {
		case "students":
			return "bg-blue-100 text-blue-700 border-blue-200";
		case "faculties":
			return "bg-amber-100 text-amber-700 border-amber-200";
		default:
			return "bg-emerald-100 text-emerald-700 border-emerald-200";
	}
}

export default function AnnouncementsPage() {
	const { data: announcements = [], isLoading } = useQuery<AnnouncementItem[]>({
		queryKey: ["announcements"],
		queryFn: async () => {
			const res = await api.get("/announcements");
			return res.data;
		},
	});

	const hasAnnouncements = announcements.length > 0;

	return (
		<PageWrapper>
			<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<Heading
					title="Announcements"
					description="Create and manage announcements for Special Project, Capstone, and Thesis events, including important updates and deadlines."
				/>
				<NewAnnouncement />
			</div>

			{isLoading && (
				<div className="mt-12 flex justify-center">
					<Loading message="announcements" />
				</div>
			)}

			{!isLoading && hasAnnouncements && (
				<div className="mt-6 grid gap-4">
					{announcements.map((announcement) => (
						<article
							key={announcement.id}
							className="relative overflow-hidden rounded-xl border border-neutral-200 bg-white p-5 shadow-xs transition-all duration-300 hover:shadow-sm">
							<div className="absolute left-0 top-0 h-full w-1 bg-linear-to-b from-primary-400 to-primary-600" />

							<div className="flex flex-wrap items-start justify-between gap-3 pl-3">
								<div>
									<div className="flex items-center gap-2 text-primary-700">
										<IconSpeakerphone size={16} />
										<span className="text-sm font-semibold">
											{announcement.title}
										</span>
									</div>
								</div>

								<Badge
									className={`capitalize border ${getAudienceBadgeClass(announcement.audience)}`}>
									{announcement.audience}
								</Badge>
							</div>

							<div className="mt-4 flex flex-col gap-1.5 pl-3 text-xs text-neutral-600">
								<div className="inline-flex items-center gap-1.5">
									<IconCalendarEvent size={14} />
									<span>{formatAnnouncementDate(announcement.createdAt)}</span>
								</div>
								<div className="inline-flex items-center gap-1.5">
									<IconUser size={14} />
									<span>By {announcement.announcer}</span>
								</div>
							</div>

							<p className="mt-4 pl-3 text-sm leading-6 text-neutral-700">
								{announcement.description}
							</p>
						</article>
					))}
				</div>
			)}

			{!isLoading && !hasAnnouncements && (
				<div className="mt-10 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-12 text-center">
					<div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-white text-neutral-500 shadow-sm">
						<IconInfoCircle size={24} />
					</div>
					<p className="text-base font-semibold text-neutral-800">
						No announcements yet
					</p>
					<p className="mt-1 text-sm text-neutral-600">
						Create your first announcement to notify students and faculties.
					</p>
				</div>
			)}
		</PageWrapper>
	);
}
