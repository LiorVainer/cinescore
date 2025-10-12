'use client';
import {ModeToggle} from '@/components/mode-toggle';
import {LanguageToggle} from '@/components/navigation/language-toggle';
import {SignedIn, SignedOut, UserButton} from '@daveyplate/better-auth-ui';
import {MobileNav, MobileNavHeader, Navbar, NavBody} from '@/components/ui/resizable-navbar';
import {useIsMobile} from '@/hooks/use-mobile';
import {Button} from '@/components/ui/button';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation'
import {NavbarLogo} from './navbar-logo';
import {LogIn} from 'lucide-react';

export const AppNavbar = () => {
    const isMobile = useIsMobile();

    return (
        <Navbar position='fixed'>
            {!isMobile ? (
                <NavBody className='container flex h-16 items-center justify-between'>
                    <NavbarLogo/>
                    <NavbarContent/>
                </NavBody>
            ) : (
                <MobileNav>
                    <MobileNavHeader>
                        <NavbarLogo/>
                        <NavbarContent/>
                    </MobileNavHeader>
                </MobileNav>
            )}
        </Navbar>
    );
};

export const NavbarContent = () => {
    const t = useTranslations('nav');

    return (
        <nav className='flex items-center gap-6'>
            <div className='flex items-center gap-4'>
                <div className='flex items-center gap-2'>
                    <ModeToggle/>
                    <LanguageToggle/>
                </div>
                <SignedIn>
                    <UserButton
                        className='rounded-full'
                        variant='ghost'
                        classNames={{
                            content: {
                                user: {
                                    base: 'flex flex-row-reverse items-center gap-2',
                                    title: 'text-right',
                                    content: 'text-right',
                                },
                                menuItem: 'flex flex-row-reverse',
                            },
                            trigger: {
                                base: 'flex flex-row-reverse items-center gap-2 [&>*:nth-child(2)]:hidden',
                                user: {
                                    content: 'hidden',
                                },
                            },
                        }}
                    />
                </SignedIn>

                <SignedOut>
                    <Link href='/auth/sign-in'>
                        <Button size='sm' className='rounded-full font-bold'>
                            {t('signIn')}
                        </Button>
                    </Link>
                </SignedOut>
            </div>

        </nav>
    );
};
