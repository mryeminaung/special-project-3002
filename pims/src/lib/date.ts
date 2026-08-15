const FALLBACK = "—";
const FALLBACK_SCHEDULED = "Not scheduled";

function parse(value: string | null | undefined): Date | null {
	if (!value) return null;

	// Check if the value already has a time component (colon after the date part)
	// Handles: "2026-08-14T10:00:00" (ISO), "2026-08-14 10:00:00" (MySQL), "2024-01-25" (bare date)
	const hasTime = /\d{2}:\d{2}/.test(value);

	let iso: string;
	if (hasTime) {
		// Has time component - replace space with T for ISO format if needed
		iso = value.includes("T") ? value : value.replace(" ", "T");
	} else {
		// Bare date string - append time to avoid UTC midnight shift
		iso = `${value}T00:00:00`;
	}

	const d = new Date(iso);
	return Number.isNaN(d.getTime()) ? null : d;
}

/** "25 Jan 2024" — tables, event ranges, approved/submitted dates */
export function formatDate(value: string | null | undefined): string {
	const d = parse(value);
	if (!d) return FALLBACK;
	return d.toLocaleDateString("en-GB", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
}

/** "Jan 25" — compact list rows and deadline widgets (no year) */
export function formatShortDate(value: string | null | undefined): string {
	const d = parse(value);
	if (!d) return FALLBACK;
	return d.toLocaleDateString("en-GB", {
		day: "numeric",
		month: "short",
	});
}

/** "Jan 25, 2024, 3:45 PM" — seminar deadlines, activity feeds */
export function formatDateTime(value: string | null | undefined): string {
	const d = parse(value);
	if (!d) return FALLBACK_SCHEDULED;
	return d.toLocaleString("en-GB", {
		day: "numeric",
		month: "short",
		year: "numeric",
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
	});
}

/** "25 January 2024 at 3:45 PM" — announcement detail panels */
export function formatFullDateTime(value: string | null | undefined): string {
	const d = parse(value);
	if (!d) return FALLBACK;
	return d.toLocaleString("en-GB", {
		day: "numeric",
		month: "long",
		year: "numeric",
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
	});
}

/** "2 hours ago" / "3 days ago" — activity and notification feeds */
export function formatRelativeTime(value: string | null | undefined): string {
	const d = parse(value);
	if (!d) return FALLBACK;
	const diffMs = Date.now() - d.getTime();
	const diffMins = Math.floor(diffMs / 60_000);
	if (diffMins < 1) return "just now";
	if (diffMins < 60) return `${diffMins} min ago`;
	const diffHours = Math.floor(diffMins / 60);
	if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
	const diffDays = Math.floor(diffHours / 24);
	if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
	const diffWeeks = Math.floor(diffDays / 7);
	if (diffWeeks < 5) return `${diffWeeks} week${diffWeeks === 1 ? "" : "s"} ago`;
	return formatDate(value);
}

/** "2024-01-25T15:45" — value for <input type="datetime-local"> */
export function toInputDateTime(value: string | null | undefined): string {
	const d = parse(value);
	if (!d) return "";
	const year = d.getFullYear();
	const month = String(d.getMonth() + 1).padStart(2, "0");
	const day = String(d.getDate()).padStart(2, "0");
	const hours = String(d.getHours()).padStart(2, "0");
	const minutes = String(d.getMinutes()).padStart(2, "0");
	return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/** Days remaining until a future date (negative = past) */
export function daysUntil(value: string | null | undefined): number {
	const d = parse(value);
	if (!d) return 0;
	return Math.ceil((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}
