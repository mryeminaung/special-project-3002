import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { IconBell, IconBellRinging, IconCheck } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router";
import {
	getNotifications,
	markAllNotificationsRead,
	markNotificationRead,
	type AppNotification,
} from "./notification.service";

const TYPE_ICON: Record<AppNotification["data"]["type"], string> = {
	proposal_approved: "✅",
	examiner_assigned: "🔍",
	announcement: "📢",
	project_event: "📅",
};

function NotificationItem({
	notification,
	onRead,
}: {
	notification: AppNotification;
	onRead: (id: string) => void;
}) {
	const navigate = useNavigate();

	function handleClick() {
		if (!notification.read) onRead(notification.id);
		navigate(notification.data.url);
	}

	return (
		<button
			type="button"
			onClick={handleClick}
			className={cn(
				"w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-muted/60 transition-colors",
				!notification.read && "bg-primary-50 dark:bg-primary-950/30",
			)}
		>
			<span className="text-lg leading-none mt-0.5 shrink-0">
				{TYPE_ICON[notification.data.type] ?? "🔔"}
			</span>
			<div className="flex-1 min-w-0">
				<p
					className={cn(
						"text-sm leading-snug",
						!notification.read && "font-semibold",
					)}
				>
					{notification.data.title}
				</p>
				<p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
					{notification.data.body}
				</p>
				<p className="text-[10px] text-muted-foreground mt-1">
					{formatDistanceToNow(new Date(notification.createdAt), {
						addSuffix: true,
					})}
				</p>
			</div>
			{!notification.read && (
				<span className="mt-1.5 h-2 w-2 rounded-full bg-primary-600 shrink-0" />
			)}
		</button>
	);
}

export function NotificationBell() {
	const queryClient = useQueryClient();

	const { data } = useQuery({
		queryKey: ["notifications"],
		queryFn: getNotifications,
		refetchInterval: 30_000,
	});

	const notifications = data?.notifications ?? [];
	const unreadCount = data?.unreadCount ?? 0;

	const readMutation = useMutation({
		mutationFn: markNotificationRead,
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ["notifications"] }),
	});

	const readAllMutation = useMutation({
		mutationFn: markAllNotificationsRead,
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ["notifications"] }),
	});

	return (
		<Popover>
			<PopoverTrigger asChild>
				<button
					type="button"
					className="relative rounded-full p-2 hover:bg-muted transition-colors"
				>
					{unreadCount > 0 ? (
						<IconBellRinging
							size={20}
							className="text-foreground"
						/>
					) : (
						<IconBell size={20} className="text-muted-foreground" />
					)}
					{unreadCount > 0 && (
						<span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white leading-none">
							{unreadCount > 9 ? "9+" : unreadCount}
						</span>
					)}
				</button>
			</PopoverTrigger>

			<PopoverContent
				align="end"
				className="w-80 p-0 shadow-lg rounded-xl overflow-hidden"
			>
				{/* Header */}
				<div className="flex items-center justify-between px-4 py-3 border-b">
					<p className="text-sm font-semibold">Notifications</p>
					{unreadCount > 0 && (
						<Button
							size="sm"
							variant="ghost"
							className="h-auto py-1 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground"
							onClick={() => readAllMutation.mutate()}
							disabled={readAllMutation.isPending}
						>
							<IconCheck size={12} />
							Mark all read
						</Button>
					)}
				</div>

				{/* List */}
				<div className="max-h-96 overflow-y-auto divide-y divide-border">
					{notifications.length === 0 ? (
						<div className="px-4 py-10 text-center">
							<IconBell
								size={28}
								className="mx-auto text-muted-foreground/40 mb-2"
							/>
							<p className="text-sm text-muted-foreground">
								No notifications yet.
							</p>
						</div>
					) : (
						notifications.map((n) => (
							<NotificationItem
								key={n.id}
								notification={n}
								onRead={(id) => readMutation.mutate(id)}
							/>
						))
					)}
				</div>
			</PopoverContent>
		</Popover>
	);
}
