import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	updateFaculty,
	getDepartmentsForSelect,
	getRanksForSelect,
	type AdminFaculty,
} from "../services/admin.service";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface EditFacultyModalProps {
	faculty: AdminFaculty | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export default function EditFacultyModal({
	faculty,
	open,
	onOpenChange,
}: EditFacultyModalProps) {
	const queryClient = useQueryClient();

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [address, setAddress] = useState("");
	const [departmentId, setDepartmentId] = useState<string>("none");
	const [rankId, setRankId] = useState<string>("none");

	const { data: departments } = useQuery({
		queryKey: ["departments-select"],
		queryFn: getDepartmentsForSelect,
	});

	const { data: ranks } = useQuery({
		queryKey: ["ranks-select"],
		queryFn: getRanksForSelect,
	});

	useEffect(() => {
		if (faculty && open) {
			setName(faculty.name);
			setEmail(faculty.email);
			setPhone(faculty.phone ?? "");
			setAddress(faculty.address ?? "");
			setDepartmentId(faculty.department_id ? String(faculty.department_id) : "none");
			setRankId(faculty.rank_id ? String(faculty.rank_id) : "none");
		}
	}, [faculty, open]);

	const mutation = useMutation({
		mutationFn: () =>
			updateFaculty(faculty!.id, {
				name,
				email,
				phone_number: phone || null,
				address: address || null,
				department_id: departmentId !== "none" ? Number(departmentId) : null,
				rank_id: rankId !== "none" ? Number(rankId) : null,
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["faculties"] });
			toast.success("Faculty updated successfully");
			onOpenChange(false);
		},
		onError: (error: any) => {
			const msg = error?.response?.data?.message;
			const errors = error?.response?.data?.errors;
			if (errors) {
				const firstError = Object.values(errors).flat()[0];
				toast.error(firstError as string);
			} else {
				toast.error(msg || "Failed to update faculty");
			}
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		mutation.mutate();
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Edit Faculty</DialogTitle>
					<DialogDescription>
						Update faculty member details. Click save when you're done.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="name">Name</Label>
						<Input
							id="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="phone">Phone Number</Label>
						<Input
							id="phone"
							value={phone}
							onChange={(e) => setPhone(e.target.value)}
							placeholder="Optional"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="address">Address</Label>
						<Input
							id="address"
							value={address}
							onChange={(e) => setAddress(e.target.value)}
							placeholder="Optional"
						/>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label>Department</Label>
							<Select value={departmentId} onValueChange={setDepartmentId}>
								<SelectTrigger>
									<SelectValue placeholder="Select department" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="none">No Department</SelectItem>
									{departments?.map((dept) => (
										<SelectItem key={dept.id} value={String(dept.id)}>
											{dept.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label>Rank</Label>
							<Select value={rankId} onValueChange={setRankId}>
								<SelectTrigger>
									<SelectValue placeholder="Select rank" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="none">No Rank</SelectItem>
									{ranks?.map((rank) => (
										<SelectItem key={rank.id} value={String(rank.id)}>
											{rank.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
							disabled={mutation.isPending}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={mutation.isPending}>
							{mutation.isPending ? "Saving..." : "Save Changes"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
