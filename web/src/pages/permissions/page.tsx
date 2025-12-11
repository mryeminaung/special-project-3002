import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import permissionsMatrix from "./data.json";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import { CheckCircle, Dot, XCircle } from "lucide-react";

const MatrixWrapper = ({ children }: any) => {
	return (
		<div className="bg-card flex flex-col gap-3 rounded-md border shadow-sm overflow-hidden">
			{children}
		</div>
	);
};

export default function PermissionMatrix() {
	useHeaderInitializer("Roles and Permissions", "");

	const roles = permissionsMatrix.roles;
	const modules = Object.entries(permissionsMatrix.permissions);

	const renderPermissionValue = (value: boolean | string) => {
		if (value === true)
			return <CheckCircle className="w-5 h-5 text-green-600" />;
		if (value === false) return <XCircle className="w-5 h-5 text-red-600" />;
		if (value === "own-only")
			return (
				<div className="flex items-center gap-1 text-yellow-600">
					{/* <Dot className="w-6 h-6" /> */}
					<span className="text-sm">Own Only</span>
				</div>
			);

		return null;
	};

	return (
		<div className="h-full m-3 md:mx-10 lg:mx-20">
			<MatrixWrapper>
				<div className="text-center py-8 bg-linear-to-r from-purple-500 to-blue-600 text-white space-y-3">
					<h1 className="text-2xl md:text-3xl font-semibold">Permissions Matrix</h1>
					<p className="text-base md:text-lg">
						Special Projects Management System - Role-Based Access Control
					</p>
				</div>

				<div className="px-5 space-y-5">
					{modules.map(([moduleName, modulePermissions]) => (
						<div
							key={moduleName}
							className="space-y-3">
							<h2 className="text-base md:text-xl font-semibold capitalize">
								{moduleName.replace(/_/g, " ")}
							</h2>

							<Table className="rounded-md overflow-hidden">
								<TableHeader className="bg-linear-to-r from-purple-500 to-blue-600">
									<TableRow>
										<TableHead className="text-white font-semibold text-sm md:text-base">
											Permission
										</TableHead>
										{roles.map((role) => (
											<TableHead
												key={role}
												className="text-white font-semibold text-sm md:text-base">
												{role}
											</TableHead>
										))}
									</TableRow>
								</TableHeader>

								<TableBody>
									{Object.entries(modulePermissions).map(
										([permissionName, roleValues]: any) => (
											<TableRow key={permissionName}>
												<TableCell className="font-medium capitalize">
													{permissionName.replace(/-/g, " ")}
												</TableCell>

												{roles.map((role) => (
													<TableCell key={role}>
														{renderPermissionValue(roleValues[role])}
													</TableCell>
												))}
											</TableRow>
										),
									)}
								</TableBody>
							</Table>
						</div>
					))}
				</div>
			</MatrixWrapper>
		</div>
	);
}
