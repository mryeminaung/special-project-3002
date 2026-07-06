import api from "@/api/api";
import PageWrapper from "@/components/common/page-wrapper";
import Heading from "@/components/heading";
import { useCurrentPage } from "@/hooks/use-current-page";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { useRoleChecker } from "@/hooks/use-role-checker";
import { useQuery } from "@tanstack/react-query";
import UnAuthorized from "../../components/auth/un-authorized";
import Pagination from "./components/pagination";
import ProposalsTable from "./components/proposals-table";

export default function ProjectsProposalPage() {
	useHeaderInitializer("MIIT| Proposals", "Submitted Proposals");
	const currentPage = useCurrentPage();

	const getProposalsData = async () => {
		const endpoint =
			currentPage > 1 ? `/proposals?page=${currentPage}` : "/proposals";
		const res = await api.get(endpoint);
		return res.data;
	};

	const { data: proposals, isFetching } = useQuery({
		queryKey: ["proposals", currentPage],
		queryFn: getProposalsData,
		refetchOnWindowFocus: false,
		staleTime: 30_000,
	});

	const { isIC } = useRoleChecker();
	if (!isIC) return <UnAuthorized />;

	return (
		<PageWrapper>
			<Heading
				title="Proposals"
				description="Browse and manage project proposals with team assignments and
				supervisors."
			/>
			<div className="space-y-4 mt-5">
				<ProposalsTable
					proposals={proposals?.data?.data ?? []}
					isLoading={isFetching}
				/>
				{proposals?.data?.meta && <Pagination meta={proposals.data.meta} />}
			</div>
		</PageWrapper>
	);
}
