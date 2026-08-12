const FALLBACK = "bg-gray-100 text-gray-800 border-gray-200";

// ── Proposal status ────────────────────────────────────────────
export const PROPOSAL_STATUS_COLORS: Record<string, string> = {
	pending:
		"bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
	approved:
		"bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
	rejected:
		"bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
};

export const proposalStatusColor = (status: string) =>
	PROPOSAL_STATUS_COLORS[status] ?? FALLBACK;

// ── Proposal applied type (student / faculty) ──────────────────
export const PROPOSAL_APPLIED_TYPE_COLORS: Record<string, string> = {
	student:
		"bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-900/30 dark:text-sky-400 dark:border-sky-800",
	Student:
		"bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-900/30 dark:text-sky-400 dark:border-sky-800",
	faculty:
		"bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-900/30 dark:text-violet-400 dark:border-violet-800",
	Faculty:
		"bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-900/30 dark:text-violet-400 dark:border-violet-800",
};

export const proposalAppliedTypeColor = (type: string) =>
	PROPOSAL_APPLIED_TYPE_COLORS[type] ?? FALLBACK;

// ── Project type (special / capstone / master-thesis) ──────────
export const PROJECT_TYPE_COLORS: Record<string, string> = {
	special:
		"bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/30 dark:text-teal-400 dark:border-teal-800",
	Special:
		"bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/30 dark:text-teal-400 dark:border-teal-800",
	capstone:
		"bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800",
	Capstone:
		"bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800",
	"master-thesis":
		"bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800",
	master:
		"bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800",
	Master:
		"bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800",
	"master/thesis":
		"bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800",
};

export const projectTypeColor = (type: string) =>
	PROJECT_TYPE_COLORS[type] ?? FALLBACK;

// ── Project status ─────────────────────────────────────────────
export const PROJECT_STATUS_COLORS: Record<string, string> = {
	active:
		"bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
	completed:
		"bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
	pending:
		"bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
	under_review:
		"bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
};

export const projectStatusColor = (status: string) =>
	PROJECT_STATUS_COLORS[status] ?? FALLBACK;

// ── User roles ─────────────────────────────────────────────────
export const ROLE_COLORS: Record<string, string> = {
	ic: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
	supervisor:
		"bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
	faculty:
		"bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
	admin:
		"bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
	student:
		"bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
	"student-affairs":
		"bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-400 dark:border-cyan-800",
	// comment-box variants (capitalised)
	IC: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
	Supervisor:
		"bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
	Student:
		"bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
};

export const ROLE_LABELS: Record<string, string> = {
	ic: "IC",
	IC: "Instructor In-Charge",
	supervisor: "Supervisor",
	Supervisor: "Supervisor",
	faculty: "Faculty",
	admin: "Admin",
	student: "Student",
	Student: "Student",
	"student-affairs": "Student Affairs",
};
