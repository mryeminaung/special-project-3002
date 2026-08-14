import { useState } from "react";
import { getAdminFaculties } from "../services/admin.service";
import Heading from "@/components/heading";
import { HEADINGS, PAGE_META } from "@/constants/navigation";
import { FacultiesTable } from "@/features/faculties";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { useQuery } from "@tanstack/react-query";
import EditFacultyModal from "../components/edit-faculty-modal";
import ResetPasswordModal from "../components/reset-password-modal";
import type { AdminFaculty } from "../services/admin.service";

export default function FacultiesListPage() {
	useHeaderInitializer(PAGE_META.faculties.title, PAGE_META.faculties.subtitle);

	const [editFaculty, setEditFaculty] = useState<AdminFaculty | null>(null);
	const [resetFaculty, setResetFaculty] = useState<AdminFaculty | null>(null);

	const { data: facultyData, isFetching } = useQuery({
		queryKey: ["faculties"],
		queryFn: getAdminFaculties,
	});

	const handleEdit = (faculty: any) => {
		setEditFaculty({
			id: faculty.id,
			name: faculty.name,
			email: faculty.email,
			rank: faculty.profile?.rank ?? null,
			rank_id: faculty.profile?.rankId ?? null,
			department: faculty.profile?.department ?? null,
			department_id: faculty.profile?.departmentId ?? null,
			phone: faculty.profile?.phoneNumber ?? null,
			address: faculty.profile?.address ?? null,
		});
	};

	const handleResetPassword = (faculty: any) => {
		setResetFaculty({
			id: faculty.id,
			name: faculty.name,
			email: faculty.email,
			rank: null,
			rank_id: null,
			department: null,
			department_id: null,
			phone: null,
			address: null,
		});
	};

	return (
		<>
			<Heading
				title={HEADINGS.faculties.title}
				description="Manage faculty members and their assigned roles."
			/>
			<FacultiesTable
				facultyData={facultyData?.data ?? []}
				isLoading={isFetching}
				onEdit={handleEdit}
				onResetPassword={handleResetPassword}
			/>

			<EditFacultyModal
				faculty={editFaculty}
				open={!!editFaculty}
				onOpenChange={(open) => !open && setEditFaculty(null)}
			/>

			<ResetPasswordModal
				faculty={resetFaculty}
				open={!!resetFaculty}
				onOpenChange={(open) => !open && setResetFaculty(null)}
			/>
		</>
	);
}
