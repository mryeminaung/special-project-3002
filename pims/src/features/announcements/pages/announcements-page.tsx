import Heading from "@/components/heading";
import Loading from "@/components/loading";
import TablePagination from "@/components/table-pagination";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { HEADINGS, PAGE_META } from "@/constants/navigation";
import { useCan } from "@/hooks/use-can";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { useRoleChecker } from "@/hooks/use-role-checker";
import { IconInfoCircle } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import type { AnnouncementItem } from "../announcement.types";
import AnnouncementDetail from "../components/announcement-detail";
import AnnouncementRow from "../components/announcement-row";
import AnnouncementToolbar from "../components/announcement-toolbar";
import { NewAnnouncement } from "../components/new-announcement";
import { useAnnouncements } from "../hooks/use-announcements";
import { getAnnouncements } from "../services/announcement.service";

const ITEMS_PER_PAGE = 10;

type TabValue = "all" | "unread" | "students" | "faculties" | "both";

const TABS: { value: TabValue; label: string }[] = [
	{ value: "all", label: "All" },
	{ value: "unread", label: "Unread" },
	{ value: "students", label: "Students" },
	{ value: "faculties", label: "Faculty" },
	{ value: "both", label: "Both" },
];

export default function AnnouncementsPage() {
	useHeaderInitializer(
		PAGE_META.announcements.title,
		PAGE_META.announcements.subtitle,
	);

	const { isIC, isStudent, isFaculty, isSupervisor } = useRoleChecker();
	const { can } = useCan();
	const isFacultyRole = isFaculty || isSupervisor;

	const [search, setSearch] = useState("");
	const [activeTab, setActiveTab] = useState<TabValue>("all");
	const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
	const [currentPage, setCurrentPage] = useState(1);
	const [detailAnnouncement, setDetailAnnouncement] =
		useState<AnnouncementItem | null>(null);
	const [detailOpen, setDetailOpen] = useState(false);

	const { markAsRead, markAsUnread, markAllAsRead, isRead } =
		useAnnouncements();

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

	// Role-based filtering
	const roleFiltered = useMemo(() => {
		if (isIC) return announcements;
		return announcements.filter((item) => {
			if (item.audience === "both") return true;
			if (isStudent) return item.audience === "students";
			if (isFacultyRole) return item.audience === "faculties";
			return false;
		});
	}, [announcements, isIC, isStudent, isFacultyRole]);

	// Apply all filters
	const filteredAnnouncements = useMemo(() => {
		return roleFiltered.filter((item) => {
			// Search filter
			const matchesSearch =
				search === "" ||
				item.title.toLowerCase().includes(search.toLowerCase()) ||
				item.description.toLowerCase().includes(search.toLowerCase());

			// Tab filter
			let matchesTab = true;
			if (activeTab === "unread") {
				matchesTab = !isRead(item.id);
			} else if (activeTab !== "all") {
				matchesTab = item.audience === activeTab;
			}

			return matchesSearch && matchesTab;
		});
	}, [roleFiltered, search, activeTab, isRead]);

	// Pagination
	const totalPages = Math.ceil(filteredAnnouncements.length / ITEMS_PER_PAGE);
	const paginatedAnnouncements = useMemo(() => {
		const start = (currentPage - 1) * ITEMS_PER_PAGE;
		return filteredAnnouncements.slice(start, start + ITEMS_PER_PAGE);
	}, [filteredAnnouncements, currentPage]);

	// Selection
	const allOnPageSelected =
		paginatedAnnouncements.length > 0 &&
		paginatedAnnouncements.every((item) => selectedIds.has(item.id));

	const handleToggleSelectAll = useCallback(() => {
		if (allOnPageSelected) {
			setSelectedIds((prev) => {
				const next = new Set(prev);
				paginatedAnnouncements.forEach((item) => next.delete(item.id));
				return next;
			});
		} else {
			setSelectedIds((prev) => {
				const next = new Set(prev);
				paginatedAnnouncements.forEach((item) => next.add(item.id));
				return next;
			});
		}
	}, [allOnPageSelected, paginatedAnnouncements]);

	const handleToggleSelect = useCallback((id: number) => {
		setSelectedIds((prev) => {
			const next = new Set(prev);
			if (next.has(id)) {
				next.delete(id);
			} else {
				next.add(id);
			}
			return next;
		});
	}, []);

	const handleClearSelection = useCallback(() => {
		setSelectedIds(new Set());
	}, []);

	const handleMarkSelectedAsRead = useCallback(() => {
		markAllAsRead([...selectedIds]);
		handleClearSelection();
		toast.success("Marked as read");
	}, [selectedIds, markAllAsRead, handleClearSelection]);

	const handleMarkSelectedAsUnread = useCallback(() => {
		selectedIds.forEach((id) => markAsUnread(id));
		handleClearSelection();
		toast.success("Marked as unread");
	}, [selectedIds, markAsUnread, handleClearSelection]);

	// Detail view
	const handleRowClick = useCallback(
		(announcement: AnnouncementItem) => {
			setDetailAnnouncement(announcement);
			setDetailOpen(true);
			if (!isRead(announcement.id)) {
				markAsRead(announcement.id);
			}
		},
		[isRead, markAsRead],
	);

	const handleCloseDetail = useCallback(() => {
		setDetailOpen(false);
		setDetailAnnouncement(null);
	}, []);

	// Filter state
	const hasActiveFilters = search !== "" || activeTab !== "all";

	const clearFilters = () => {
		setSearch("");
		setActiveTab("all");
		setCurrentPage(1);
	};

	// Reset page when filters change
	const handleSearchChange = (value: string) => {
		setSearch(value);
		setCurrentPage(1);
	};

	const handleTabChange = (tab: TabValue) => {
		setActiveTab(tab);
		setCurrentPage(1);
	};

	return (
		<>
			{/* Header */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<Heading
					title={HEADINGS.announcements.title}
					description={
						isIC
							? HEADINGS.announcements.descriptionIC
							: HEADINGS.announcements.descriptionDefault
					}
				/>
				{can("manage-announcements") && <NewAnnouncement />}
			</div>

			{/* Toolbar */}
			<div className="mt-5">
				<AnnouncementToolbar
					search={search}
					onSearchChange={handleSearchChange}
					selectedCount={selectedIds.size}
					onMarkSelectedAsRead={handleMarkSelectedAsRead}
					onMarkSelectedAsUnread={handleMarkSelectedAsUnread}
					onClearSelection={handleClearSelection}
					onClearFilters={clearFilters}
					hasActiveFilters={hasActiveFilters}
				/>
			</div>

			{/* Filter Tabs */}
			<div className="flex items-center gap-1 mt-4 border-b border-border">
				{/* Select all checkbox */}
				<div className="pr-2 shrink-0">
					<Checkbox
						checked={allOnPageSelected}
						onCheckedChange={handleToggleSelectAll}
					/>
				</div>
				{TABS.map((tab) => (
					<button
						key={tab.value}
						onClick={() => handleTabChange(tab.value)}
						className={`px-3 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
							activeTab === tab.value
								? "border-primary text-primary"
								: "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
						}`}
					>
						{tab.label}
					</button>
				))}
			</div>

			{/* Loading */}
			{isLoading && (
				<div className="mt-5 flex justify-center">
					<Loading message="announcements" />
				</div>
			)}

			{/* Announcement List */}
			{!isLoading && paginatedAnnouncements.length > 0 && (
				<div className="mt-4 border rounded-lg bg-card overflow-hidden">
					{paginatedAnnouncements.map((announcement) => (
						<AnnouncementRow
							key={announcement.id}
							announcement={announcement}
							isSelected={selectedIds.has(announcement.id)}
							isRead={isRead(announcement.id)}
							onToggleSelect={handleToggleSelect}
							onClick={handleRowClick}
						/>
					))}
				</div>
			)}

			{/* Pagination */}
			{!isLoading && (
				<TablePagination
					currentPage={currentPage}
					lastPage={totalPages}
					total={filteredAnnouncements.length}
					perPage={ITEMS_PER_PAGE}
					onPageChange={setCurrentPage}
				/>
			)}

			{/* Empty State */}
			{!isLoading && filteredAnnouncements.length === 0 && (
				<div className="mt-5 rounded-lg border border-dashed border-border bg-muted/30 px-6 py-12 text-center">
					<div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-background text-muted-foreground shadow-sm">
						<IconInfoCircle size={24} />
					</div>
					<p className="text-base font-semibold text-foreground">
						{hasActiveFilters
							? "No announcements match your filters"
							: "No announcements yet"}
					</p>
					{hasActiveFilters ? (
						<Button
							variant="link"
							onClick={clearFilters}
							className="mt-1"
						>
							Clear filters
						</Button>
					) : isIC ? (
						<p className="mt-1 text-sm text-muted-foreground">
							Create your first announcement to notify students
							and faculties.
						</p>
					) : (
						<p className="mt-1 text-sm text-muted-foreground">
							There are no announcements at this time. Check back
							later.
						</p>
					)}
				</div>
			)}

			{/* Detail Sheet */}
			<AnnouncementDetail
				announcement={detailAnnouncement}
				isOpen={detailOpen}
				onClose={handleCloseDetail}
				onMarkAsRead={markAsRead}
				onMarkAsUnread={markAsUnread}
				isRead={isRead}
			/>
		</>
	);
}
