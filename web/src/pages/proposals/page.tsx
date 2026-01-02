import api from '@/api/api';
import { useHeaderInitializer } from '@/hooks/use-header-initializer';
import RootLayout from '@/layouts/RootLayout';
import { HasRole } from '@/lib/utils';
import type { ProjectProposal } from '@/types';
import { useEffect, useState } from 'react';
import UnAuthorized from '../UnAuthorized';
import { ProposalsList } from './components/proposals-table';

export default function ProjectsProposalPage() {
  if (!HasRole('IC')) return <UnAuthorized />;

  useHeaderInitializer('MIIT| Proposals', 'Project Proposals');

  const [proposalsData, setProposalsData] = useState<ProjectProposal[]>([]);

  const getProposalsData = async () => {
    const res = await api.get('/proposals/lists');
    console.log(res.data);
  };

  useEffect(() => {
    getProposalsData();
  }, []);

  console.log(proposalsData);
  return (
    <RootLayout>
      <div className='flex flex-col gap-5 px-6'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-slate-900'>
            Project Proposals
          </h1>
          <p className='text-sm text-slate-500'>
            Browse and manage project proposals with team assignments and
            supervisors. 
          </p>
        </div>
        {proposalsData && <ProposalsList proposalsData={proposalsData} />}
      </div>
    </RootLayout>
  );
}
