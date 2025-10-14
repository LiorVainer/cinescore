'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { authClient } from '@/lib/auth-client';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { LogOut, Settings } from 'lucide-react';

export const UserButton = () => {
    const { data: session, isPending } = authClient.useSession();
    const t = useTranslations('userButton');

    const handleSignOut = async () => {
        await authClient.signOut();
    };

    if (isPending) {
        return (
            <Button variant='ghost' size='icon' className='rounded-full' disabled>
                <Avatar className='size-8'>
                    <AvatarFallback>...</AvatarFallback>
                </Avatar>
            </Button>
        );
    }

    if (!session) {
        return null;
    }

    const user = session.user;
    const userInitials = getUserInitials(user.name || user.email);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='ghost' size='icon' className='rounded-full'>
                    <Avatar className='size-8'>
                        <AvatarImage src={user.image || undefined} alt={user.name || user.email} />
                        <AvatarFallback>{userInitials}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-56'>
                <DropdownMenuLabel>
                    <div className='flex items-center gap-3'>
                        <Avatar className='size-10'>
                            <AvatarImage src={user.image || undefined} alt={user.name || user.email} />
                            <AvatarFallback>{userInitials}</AvatarFallback>
                        </Avatar>
                        <div className='flex flex-col space-y-1 overflow-hidden'>
                            {user.name && <p className='text-sm font-medium leading-none truncate'>{user.name}</p>}
                            <p className='text-xs leading-none text-muted-foreground truncate'>{user.email}</p>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href='/account/settings' className='cursor-pointer'>
                        <Settings className='size-4' />
                        <span>{t('settings')}</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut} className='cursor-pointer'>
                    <LogOut className='size-4' />
                    <span>{t('signOut')}</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

function getUserInitials(name: string): string {
    if (!name) return '?';

    const parts = name.trim().split(/\s+/);

    if (parts.length === 1) {
        return parts[0].substring(0, 2).toUpperCase();
    }

    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
