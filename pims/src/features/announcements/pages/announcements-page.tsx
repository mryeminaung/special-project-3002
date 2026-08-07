import PageWrapper from "@/components/common/page-wrapper";
import { PAGE_META, HEADINGS } from "@/constants/navigation";
import Heading from "@/components/heading";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { useRoleChecker } from "@/hooks/use-role-checker";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { IconInfoCircle } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import type { AnnouncementItem } from "../announcement.types";
import AnnouncementCards from "../components/announcement-cards";
import { NewAnnouncement } from "../components/new-announcement";
import { getAnnouncements } from "../services/announcement.service";

export default function AnnouncementsPage() {
	useHeaderInitializer(PAGE_META.announcements.title, PAGE_META.announcements.subtitle);

	const { isIC } = useRoleChecker();
	const [search, setSearch] = useState("");
	const [audienceFilter, setAudienceFilter] = useState("all");

	const {
		data: announcements = [],
		isLoading,
		error,
	} = useQuery<AnnouncementItem[]>({
		queryKey: ["announcements"],
		queryFn: getAnnouncements,
	});

	if (error) {
		toast.error("Failed to load announcements. Please try again.");
	}

	const filteredAnnouncements = announcements.filter((item) => {
		const matchesSearch =
			search === "" ||
			item.title.toLowerCase().includes(search.toLowerCase()) ||
			item.description.toLowerCase().includes(search.toLowerCase());

		const matchesAudience =
			audienceFilter === "all" || item.audience === audienceFilter;

		return matchesSearch && matchesAudience;
	});

	const hasActiveFilters = search !== "" || audienceFilter !== "all";
	const hasAnnouncements = filteredAnnouncements.length > 0;

	const clearFilters = () => {
		setSearch("");
		setAudienceFilter("all");
	};

	return (
		<PageWrapper>
			<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<Heading
					title={HEADINGS.announcements.title}
					description={
						isIC
							? HEADINGS.announcements.descriptionIC
							: HEADINGS.announcements.descriptionDefault
					}
				/>
				{isIC && <NewAnnouncement />}
			</div>

			{/* Filters */}
			<div className="flex flex-col gap-3 mt-5 sm:flex-row sm:items-center">
				<div className="relative flex-1">
					<MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
					<Input
						placeholder="Search announcements..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="pl-9"
					/>
				</div>
				<Select value={audienceFilter} onValueChange={setAudienceFilter}>
					<SelectTrigger className="w-full sm:w-44">
						<SelectValue placeholder="Audience" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Audience</SelectItem>
						<SelectItem value="students">Students</SelectItem>
						<SelectItem value="faculties">Faculties</SelectItem>
						<SelectItem value="both">Both</SelectItem>
					</SelectContent>
				</Select>
				{hasActiveFilters && (
					<Button
						variant="ghost"
						size="sm"
						onClick={clearFilters}
						className="gap-1 text-gray-500">
						<XMarkIcon className="h-4 w-4" />
						Clear
					</Button>
				)}
			</div>

			{isLoading && (
				<div className="mt-5 flex justify-center">
					<Loading message="announcements" />
				</div>
			)}

			{!isLoading && hasAnnouncements && (
				<AnnouncementCards announcements={filteredAnnouncements} />
			)}

			{!isLoading && !hasAnnouncements && (
				<div className="mt-5 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-12 text-center">
					<div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-white text-neutral-500 shadow-sm">
						<IconInfoCircle size={24} />
					</div>
					<p className="text-base font-semibold text-neutral-800">
						{hasActiveFilters
							? "No announcements match your filters"
							: "No announcements yet"}
					</p>
					{hasActiveFilters ? (
						<Button
							variant="link"
							onClick={clearFilters}
							className="mt-1">
							Clear filters
						</Button>
					) : isIC ? (
						<p className="mt-1 text-sm text-neutral-600">
							Create your first announcement to notify students and faculties.
						</p>
					) : (
						<p className="mt-1 text-sm text-neutral-600">
							There are no announcements at this time. Check back later.
						</p>
					)}
				</div>
			)}
		</PageWrapper>
	);
}
