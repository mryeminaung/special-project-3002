import type { ElementType } from "react";

export type DashboardCard<T = ElementType> = {
	title: string;
	cardIcon?: T;
	count: number | string;
	pageUrl: string;
};
