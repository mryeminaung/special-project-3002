import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type {
	AnnouncementAudience,
	AnnouncementItem,
} from "../announcement.types";

function formatShortDate(value: string) {
	const parsed = new Date(value);
	if (Number.isNaN(parsed.getTime())) return value;
	return parsed.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
	});
}

function getAudienceBadgeClasses(audience: AnnouncementAudience) {
	switch (audience) {
		case "students":
			return "bg-blue-50 text-blue-700 border-blue-200";
		case "faculties":
			return "bg-amber-50 text-amber-700 border-amber-200";
		default:
			return "bg-emerald-50 text-emerald-700 border-emerald-200";
	}
}

interface AnnouncementRowProps {
	announcement: AnnouncementItem;
	isSelected: boolean;
	isRead: boolean;
	onToggleSelect: (id: number) => void;
	onClick: (announcement: AnnouncementItem) => void;
}

export default function AnnouncementRow({
	announcement,
	isSelected,
	isRead,
	onToggleSelect,
	onClick,
}: AnnouncementRowProps) {
	return (
		<div
			onClick={() => onClick(announcement)}
			className={cn(
				"flex items-center gap-3 px-4 py-3 border-b border-border last:border-b-0 cursor-pointer transition-colors",
				"hover:bg-muted/50",
				!isRead && "bg-primary/5",
				isSelected && "bg-accent/50",
			)}>
			{/* Checkbox */}
			<div
				className="shrink-0"
				onClick={(e) => e.stopPropagation()}>
				<Checkbox
					checked={isSelected}
					onCheckedChange={() => onToggleSelect(announcement.id)}
				/>
			</div>

			{/* Unread dot */}
			<div className="shrink-0 w-2 flex justify-center">
				{!isRead && (
					<span className="block w-2 h-2 rounded-full bg-primary" />
				)}
			</div>

			{/* Announcer */}
			<span
				className={cn(
					"shrink-0 text-sm w-36 truncate hidden sm:block",
					!isRead ? "font-semibold text-foreground" : "text-muted-foreground",
				)}>
				{announcement.announcer}
			</span>

			{/* Title + Preview */}
			<div className="flex-1 min-w-0">
				<div className="flex items-center gap-2 sm:hidden mb-0.5">
					<span
						className={cn(
							"text-sm truncate",
							!isRead ? "font-semibold text-foreground" : "font-medium text-foreground",
						)}>
						{announcement.announcer}
					</span>
					<span className="text-xs text-muted-foreground shrink-0">
						{formatShortDate(announcement.createdAt)}
					</span>
				</div>
				<p
					className={cn(
						"text-sm truncate",
						!isRead ? "font-semibold text-foreground" : "font-normal text-foreground",
					)}>
					{announcement.title}
				</p>
				<p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
					{announcement.description}
				</p>
			</div>

			{/* Audience badge */}
			<Badge
				variant="outline"
				className={cn(
					"shrink-0 capitalize text-xs hidden md:inline-flex",
					getAudienceBadgeClasses(announcement.audience),
				)}>
				{announcement.audience}
			</Badge>

			{/* Date */}
			<span className="shrink-0 text-xs text-muted-foreground whitespace-nowrap hidden sm:block">
				{formatShortDate(announcement.createdAt)}
			</span>
		</div>
	);
}
