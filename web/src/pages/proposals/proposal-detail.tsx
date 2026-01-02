import { useLocation, useNavigate } from 'react-router';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { HasRole } from '@/lib/utils';
import type { ProjectProposal } from '@/types';

import {
  ArrowLeftIcon,
  CalendarIcon,
  CheckBadgeIcon,
  CodeBracketIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  HandThumbDownIcon,
  HandThumbUpIcon,
  UserIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';

import { Download } from 'lucide-react';

import CommentBox from './components/comment-box';

export default function ProposalDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const proposal = (location.state as { proposal: ProjectProposal } | null)?.proposal ?? null;
  const isIC = HasRole('IC');

  const handleBack = () => navigate(-1);
  const handleApprove = () => console.log('Proposal Approved!');
  const handleReject = () => console.log('Proposal Rejected!');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  if (!proposal) {
    return (
      <div className='min-h-screen'>
        <div className='mx-auto max-w-7xl px-4 py-6'>
          <Button
            onClick={handleBack}
            variant='ghost'
            className='mb-4 flex items-center gap-2'
          >
            <ArrowLeftIcon className='h-4 w-4' />
            Back to Proposals
          </Button>
          <Card className='border-gray-200 shadow-sm'>
            <CardContent className='py-12 text-center'>
              <p className='text-gray-500'>No proposal data found. Please go back and select a proposal.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen'>
      <div className='mx-auto max-w-7xl px-4 py-6'>
        <Button
          onClick={handleBack}
          variant='ghost'
          className='mb-4 flex items-center gap-2'
        >
          <ArrowLeftIcon className='h-4 w-4' />
          Back to Proposals
        </Button>

        <Card className='mb-6 border-gray-200 shadow-sm'>
          <CardContent className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
            <div>
              <h1 className='text-2xl font-bold text-gray-900'>
                {proposal.title}
              </h1>
              <div className='mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-500'>
                <Badge className={getStatusColor(proposal.status)}>
                  <span className='font-mono'>
                    {proposal.status.toUpperCase()}
                  </span>
                </Badge>
                <span className='flex items-center gap-1.5'>
                  <CalendarIcon className='h-4 w-4' />
                  Submitted on {proposal.submitted_at}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          <div className='space-y-6 lg:col-span-2'>
            <Card className='border-gray-200 shadow-sm'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-lg'>
                  <CodeBracketIcon className='size-5 stroke-2 text-primary-600' />
                  Project Description
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-3 text-gray-700'>
                {proposal.description.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </CardContent>
            </Card>

            <Card className='border-gray-200 shadow-sm'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-lg'>
                  <DocumentTextIcon className='size-5 stroke-2 text-primary-600' />
                  Proposal Document
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex flex-col gap-4 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between'>
                  <div className='flex items-center gap-4'>
                    <div className='rounded-lg bg-primary-100 p-3'>
                      <DocumentTextIcon className='size-7 text-primary-600' />
                    </div>
                    <div>
                      <p className='font-medium text-gray-900'>Proposal.pdf</p>
                      <p className='text-sm text-gray-500'>
                        Submitted on {proposal.submitted_at}
                      </p>
                    </div>
                  </div>

                  <Button
                    asChild
                    className='gap-2 bg-primary-600 font-semibold text-white hover:bg-primary-500'
                  >
                    <a
                      href={proposal.file}
                      target='_blank'
                      rel='noopener noreferrer'
                      download
                    >
                      <Download className='h-4 w-4' />
                      Download
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
            <CommentBox />
          </div>

          <div className='space-y-6'>
            <Card className='border-gray-200 shadow-sm'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-sm font-bold text-slate-600 uppercase tracking-widest'>
                  <UserIcon className='size-5 stroke-2 text-primary-600' />
                  Submitted by
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-1'>
                <p className='font-semibold'>{proposal.submittedBy.name}</p>
                <p className='flex items-center gap-1.5 text-sm text-gray-600'>
                  <EnvelopeIcon className='h-3.5 w-3.5' />
                  {proposal.submittedBy.email}
                </p>
              </CardContent>
            </Card>

            <Card className='border-gray-200 shadow-sm'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-sm font-bold text-slate-600 uppercase tracking-widest'>
                  <UsersIcon className='size-5 stroke-2 text-primary-600' />
                  Project Team
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                {proposal.students.map((student) => (
                  <div key={student.id}>
                    <p className='font-medium'>{student.name}</p>
                    <p className='flex items-center gap-1.5 truncate text-sm text-gray-500'>
                      <EnvelopeIcon className='h-3.5 w-3.5' />
                      {student.email}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className='border-gray-200 shadow-sm'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-sm font-bold text-slate-600 uppercase tracking-widest'>
                  <UserIcon className='size-5 stroke-2 text-primary-600' />
                  Supervisor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='font-semibold'>{proposal.supervisor.name}</p>
                <p className='flex items-center gap-1.5 text-sm text-gray-600'>
                  <EnvelopeIcon className='h-3.5 w-3.5' />
                  {proposal.supervisor.email}
                </p>
              </CardContent>
            </Card>

            {isIC && (
              <Card className='border-gray-200 shadow-sm'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2 text-sm font-bold text-slate-600 uppercase tracking-widest'>
                    <CheckBadgeIcon className='size-5 stroke-2 text-primary-600' />
                    Project Approval
                  </CardTitle>
                </CardHeader>
                <CardContent className='flex gap-2'>
                  <Button
                    onClick={handleReject}
                    className='flex-1 gap-2 bg-red-300 font-semibold text-red-900 hover:bg-red-500 hover:text-white'
                  >
                    <HandThumbDownIcon className='size-4 stroke-2' />
                    Reject
                  </Button>
                  <Button
                    onClick={handleApprove}
                    className='flex-1 gap-2 bg-green-300 font-semibold text-green-900 hover:bg-green-500 hover:text-white'
                  >
                    <HandThumbUpIcon className='size-4 stroke-2' />
                    Approve
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
