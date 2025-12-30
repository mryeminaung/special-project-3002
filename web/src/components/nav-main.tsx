import { IconCirclePlusFilled, type Icon } from '@tabler/icons-react';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from '@/components/ui/sidebar';
import { useAuthUserStore } from '@/stores/useAuthUserStore';
import { NavLink } from 'react-router';

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
}) {
  const authUser = useAuthUserStore((state) => state.authUser);

  return (
    <SidebarGroup>
      <SidebarGroupContent className='flex flex-col gap-2'>
        {authUser.role === 'Student' && (
          <SidebarMenu className='mb-3'>
            <NavLink
              to='/project-proposal/create'
              className={({ isActive }) =>
                `relative overflow-hidden group
                bg-linear-to-r from-primary-900 via-primary-950 to-primary-900 
                rounded-xl transition-all duration-300 
                flex items-center px-5 gap-3 text-white py-3
                shadow-lg hover:shadow-xl
                border border-primary-800/50
                hover:from-primary-800 hover:via-primary-900 hover:to-primary-800
                ${isActive ? 'ring-2 ring-primary-400/30 ring-offset-1' : ''}`
              }
            >
              <div className='absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent translate-x-full group-hover:translate-x-full transition-transform duration-700' />
              <IconCirclePlusFilled size={24} className='relative z-10' />
              <span className='relative z-10 font-semibold text-sm tracking-wide'>
                Create Proposal
              </span>
            </NavLink>
          </SidebarMenu>
        )}

        <SidebarMenu className='gap-y-1'>
          {items.map((item) => (
            <NavLink
              key={item.title}
              to={item.url}
              className={({ isActive }) =>
                `flex items-center gap-x-3 px-6 py-2.5 rounded-md transition-all duration-200 active:scale-95 group
                ${
                  isActive
                    ? 'bg-background text-black border-l-4 border-l-primary-950 shadow-sm'
                    : 'bg-cherry-pie-50 text-slate-600 hover:bg-background hover:text-black'
                }`
              }
            >
              {item.icon && (
                <item.icon
                  size={20}
                  className='transition-colors duration-200'
                />
              )}
              <span className='text-sm font-medium'>{item.title}</span>
            </NavLink>
            // <SidebarMenuItem key={item.title}>
            // 	<SidebarMenuButton
            // 		className="border mb-2 py-5 w-[120px]"
            // 		tooltip={item.title}>
            // 		<NavLink
            // 			className="rounded-xl w-full bg-red-500 bor"
            // 			to={item.url}>
            // 			<p className="flex items-center  w-[120px]  gap-x-3 mx-auto py-5 ">
            // 				{item.icon && <item.icon />}
            // 				<span className="text-[14px]">{item.title}</span>
            // 			</p>
            // 		</NavLink>
            // 	</SidebarMenuButton>
            // </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
