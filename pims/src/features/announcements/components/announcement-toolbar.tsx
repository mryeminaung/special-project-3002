import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { IconSearch, IconMailOpened, IconMail, IconX } from "@tabler/icons-react";

interface AnnouncementToolbarProps {
	search: string;
	onSearchChange: (value: string) => void;
	selectedCount: number;
	onMarkSelectedAsRead: () => void;
	onMarkSelectedAsUnread: () => void;
	onClearSelection: () => void;
	onClearFilters: () => void;
	hasActiveFilters: boolean;
}

export default function AnnouncementToolbar({
	search,
	onSearchChange,
	selectedCount,
	onMarkSelectedAsRead,
	onMarkSelectedAsUnread,
	onClearSelection,
	onClearFilters,
	hasActiveFilters,
}: AnnouncementToolbarProps) {
	return (
		<div className="flex flex-col gap-3">
			{/* Search */}
			<div className="flex items-center gap-3">
				<div className="relative flex-1">
					<IconSearch
						className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
						size={16}
					/>
					<Input
						placeholder="Search announcements..."
						value={search}
						onChange={(e) => onSearchChange(e.target.value)}
						className="pl-9"
					/>
				</div>
				{hasActiveFilters && (
					<Button
						variant="ghost"
						size="sm"
						onClick={onClearFilters}
						className="gap-1 text-muted-foreground">
						<IconX size={14} />
						Clear
					</Button>
				)}
			</div>

			{/* Bulk Action Bar */}
			{selectedCount > 0 && (
				<div className="flex items-center gap-3 rounded-lg bg-primary/5 border border-primary/20 px-4 py-2">
					<span className="text-sm font-medium text-primary">
						{selectedCount} selected
					</span>
					<Separator orientation="vertical" className="h-4" />
					<Button
						variant="ghost"
						size="sm"
						onClick={onMarkSelectedAsRead}
						className="gap-1.5 text-sm">
						<IconMailOpened size={14} />
						Mark as read
					</Button>
					<Button
						variant="ghost"
						size="sm"
						onClick={onMarkSelectedAsUnread}
						className="gap-1.5 text-sm">
						<IconMail size={14} />
						Mark as unread
					</Button>
					<Button
						variant="ghost"
						size="sm"
						onClick={onClearSelection}
						className="gap-1.5 text-sm text-muted-foreground ml-auto">
						<IconX size={14} />
						Clear
					</Button>
				</div>
			)}
		</div>
	);
}
