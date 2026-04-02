import { DocumentTextIcon } from "@heroicons/react/24/outline";
import DownloadFile from "./download-file";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default function ProposalDocument({
	submittedAt,
	file,
}: {
	submittedAt: string;
	file: string;
}) {
	return (
		<Card className="border-gray-200 shadow-sm">
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-lg">
					<DocumentTextIcon className="size-5 stroke-2 text-primary-600" />
					Proposal Document
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col gap-4 rounded-lg border border-dashed border-gray-300 p-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex items-center gap-4">
						<div className="rounded-lg bg-primary-100 p-3">
							<DocumentTextIcon className="size-7 text-primary-600" />
						</div>
						<div>
							<p className="font-medium ">proposal</p>
							<p className="text-sm  ">Submitted on {submittedAt}</p>
						</div>
					</div>

					<DownloadFile fileUrl={file} />
				</div>
			</CardContent>
		</Card>
	);
}
