'use client';
import { ModeToggle } from '@/components/mode-toggle';
import { SignedIn, SignedOut, UserButton } from '@daveyplate/better-auth-ui';
import Link from 'next/link';
import {
    MobileNav,
    MobileNavHeader,
    Navbar,
    NavbarButton,
    NavbarLogo,
    NavBody,
} from '@/components/ui/resizable-navbar';
import { useIsMobile } from '@/hooks/use-mobile';

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
    return (
        <nav className='flex items-center gap-6'>
            <div className='flex items-center gap-2'>
                <ModeToggle />
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
                        <NavbarButton>התחבר</NavbarButton>
                    </Link>
                    <Link href='/auth/sign-up'>
                        <NavbarButton>הירשם</NavbarButton>
                    </Link>
                </SignedOut>
            </div>
        </nav>
    );
};
