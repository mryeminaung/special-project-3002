type HeadingProps = {
	title: string;
	description: string;
	variant?: "lg" | "sm";
};

export default function Heading({
	title,
	variant = "lg",
	description,
}: HeadingProps) {
	const titleClass =
		variant === "lg"
			? "text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100"
			: "text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100";

	return (
		<div>
			<h1 className={titleClass}>{title}</h1>
			<p className="text-sm text-neutral-500">{description}</p>
		</div>
	);
}
