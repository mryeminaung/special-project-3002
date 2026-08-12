import { useCallback, useState } from "react";

const STORAGE_KEY = "pims:announcement-read";

function loadReadIds(): Set<number> {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return new Set();
		const parsed: number[] = JSON.parse(raw);
		return new Set(parsed);
	} catch {
		return new Set();
	}
}

function saveReadIds(ids: Set<number>) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
}

export function useAnnouncements() {
	const [readIds, setReadIds] = useState<Set<number>>(() => loadReadIds());

	const markAsRead = useCallback((id: number) => {
		setReadIds((prev) => {
			const next = new Set(prev);
			next.add(id);
			saveReadIds(next);
			return next;
		});
	}, []);

	const markAsUnread = useCallback((id: number) => {
		setReadIds((prev) => {
			const next = new Set(prev);
			next.delete(id);
			saveReadIds(next);
			return next;
		});
	}, []);

	const markAllAsRead = useCallback((ids: number[]) => {
		setReadIds((prev) => {
			const next = new Set(prev);
			ids.forEach((id) => next.add(id));
			saveReadIds(next);
			return next;
		});
	}, []);

	const isRead = useCallback((id: number) => readIds.has(id), [readIds]);

	return { readIds, markAsRead, markAsUnread, markAllAsRead, isRead };
}
