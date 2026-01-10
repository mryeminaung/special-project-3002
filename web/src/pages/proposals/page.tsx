import api from '@/api/api';
import { useHeaderInitializer } from '@/hooks/use-header-initializer';
import RootLayout from '@/layouts/RootLayout';
import { HasRole } from '@/lib/utils';
import type { ProjectProposal } from '@/types';
import { useEffect, useState } from 'react';
import UnAuthorized from '../UnAuthorized';
import ProposalTable from './components/proposals-table';
import CommentBox from './components/comment-box';

export default function ProjectsProposalPage() {
  if (!HasRole('IC')) return <UnAuthorized />;

  useHeaderInitializer('MIIT| Proposals', 'Project Proposals');

  const [proposalsData, setProposalsData] = useState<ProjectProposal[]>([]);
  const getProposalsData = async () => {
    const res = await api.get('/proposals');
    setProposalsData(res.data);
  };

  useEffect(() => {
    getProposalsData();
  }, []);

  return (
    <RootLayout>
      <div className='flex flex-col mx-auto max-w-7xl gap-3 px-4 lg:px-6'>
        <div className=''>
          <h1 className='text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100'>
            Project Proposals
          </h1>
          <p className='text-sm text-neutral-500'>
            Browse and manage project proposals with team assignments and
            supervisors.
          </p>
        </div>
        {proposalsData && (
          <ProposalTable
            getProposalsData={getProposalsData}
            proposalData={proposalsData}
          />
        )}
      </div>
    </RootLayout>
  );
}
