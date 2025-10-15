'use client';
import {Suspense} from 'react';
import {ModeToggle} from '@/components/mode-toggle';
import {LanguageToggle} from '@/components/navigation/language-toggle';
import {SignedIn, SignedOut} from '@daveyplate/better-auth-ui';
import {MobileNav, MobileNavHeader, Navbar, NavBody} from '@/components/ui/resizable-navbar';
import {useIsMobile} from '@/hooks/use-mobile';
import {Button} from '@/components/ui/button';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {NavbarLogo} from './navbar-logo';
import {LucideCircleUserRound} from 'lucide-react';
import {cn} from '@/lib/utils';
import {UserButton} from '@/components/auth/user-button';

export const AppNavbar = () => {
    const isMobile = useIsMobile();

    return (
        <Navbar position='fixed'>
            {!isMobile ? (
                <NavBody className='container flex h-16 items-center justify-between'>
                    <NavbarLogo />
                    <NavbarContent />
                </NavBody>
            ) : (
                <MobileNav>
                    <MobileNavHeader>
                        <NavbarLogo />
                        <NavbarContent />
                    </MobileNavHeader>
                </MobileNav>
            )}
        </Navbar>
    );
};

export const NavbarContent = () => {
    const t = useTranslations('nav');
    const isMobile = useIsMobile();

    return (
        <nav className='flex items-center gap-6'>
            <div className='flex items-center gap-4'>
                <div className='flex items-center gap-2'>
                    <ModeToggle />
                    <LanguageToggle />
                </div>
                <Suspense fallback={
                    <div className='w-20 h-9 bg-muted rounded-full animate-pulse'></div>
                }>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>

                    <SignedOut>
                        <Link href='/auth/sign-in'>
                            <Button size={isMobile ? 'icon' : 'sm'} className={cn('rounded-full font-semibold p-0', isMobile && 'size-8')}>
                                <LucideCircleUserRound className='md:hidden size-6' />
                                <span className='hidden md:inline'>{t('signIn')}</span>
                            </Button>
                        </Link>
                    </SignedOut>
                </Suspense>
            </div>
        </nav>
    );
};
