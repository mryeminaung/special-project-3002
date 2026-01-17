import { Link } from "react-router";
import { IconArrowLeft } from '@tabler/icons-react';

export default function UnAuthorized() {
	return (
    <div className='bg-transparent bg-center bg-cover flex min-h-svh flex-col items-center justify-center p-6 md:p-10 relative'>
      <div className='max-w-2xl w-full p-8 md:p-12 rounded-xl bg-transparent backdrop-blur-sm text-center text-neutral-800'>
        <div className='space-y-4 flex flex-col items-center justify-center'>
          <img src='/403.svg' alt='403' className='w-100 h-100 object-cover' />
          <p className='text-lg text-neutral-600 inline-block -mt-8'>
            You don't have permission to view this page. If you believe this is
            an error, please contact your administrator.
          </p>
          <Link
            to='/'
            className='inline-flex items-center gap-2 px-4 py-2.5 bg-primary-800 text-[13px] hover:bg-primary-700 text-white font-semibold rounded-lg shadow-lg'
          >
            <IconArrowLeft />
            Back To Home
          </Link>
        </div>
      </div>
    </div>
  );
}
