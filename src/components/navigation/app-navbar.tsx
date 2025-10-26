'use client';
import {Suspense} from 'react';
import {LanguageToggle} from '@/components/navigation/language-toggle';
import {SignedIn, SignedOut} from '@daveyplate/better-auth-ui';
import {MobileNav, MobileNavHeader, Navbar, NavBody} from '@/components/ui/resizable-navbar';
import {useIsMobile} from '@/hooks/use-mobile';
import {Button} from '@/components/ui/button';
import {useTranslations} from 'next-intl';
import {Link, usePathname} from '@/i18n/navigation';
import {NavbarLogo} from './navbar-logo';
import {User} from 'lucide-react';
import {UserButton} from '@/components/auth/user-button';
import {SearchLauncher} from '@/components/movie-search/SearchLauncher';

export const AppNavbar = () => {
    const isMobile = useIsMobile();
    const pathname = usePathname();


    return (
        <Navbar position='fixed' className={pathname === '/' ? 'backdrop-blur-none' : ''}>
            {!isMobile ? (
                <NavBody className={'container flex h-16 items-center justify-between gap-8'}>
                    <NavbarLogo />
                    <NavbarContent />
                </NavBody>
            ) : (
                <MobileNav>
                    <MobileNavHeader className='flex items-center gap-4'>
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
    const pathname = usePathname(); // ✅ get the current route

    return (
        <nav className='flex items-center gap-4 md:gap-6 flex-1 justify-end'>
            {pathname === '/now-playing' && <SearchLauncher />}
            <div className='flex items-center gap-2 md:gap-6'>
                <div className='flex items-center gap-2'>
                    {/*<ModeToggle />*/}
                    <LanguageToggle />
                </div>
                <Suspense fallback={<div className='w-20 h-9 bg-muted rounded-full animate-pulse'></div>}>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>

                    <SignedOut>
                        <Link href='/auth/sign-in'>
                            <Button size='sm' className='rounded-full font-semibold'>
                                <User className='sm:hidden size-4' />
                                <span className='hidden sm:inline'>{t('signIn')}</span>
                            </Button>
                        </Link>
                    </SignedOut>
                </Suspense>
            </div>
        </nav>
    );
};
