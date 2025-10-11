'use client';
import {ModeToggle} from '@/components/mode-toggle';
import {SignedIn, SignedOut, UserButton} from '@daveyplate/better-auth-ui';
import Link from 'next/link';
import {MobileNav, MobileNavHeader, Navbar, NavbarLogo, NavBody} from '@/components/ui/resizable-navbar';
import {useIsMobile} from '@/hooks/use-mobile';
import {Button} from '@/components/ui/button';
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from '@/components/ui/dropdown-menu';
import {Globe} from 'lucide-react';
import {Language} from '@prisma/client';
import {useLanguage} from '@/contexts/LanguageContext';
import {useTranslations} from 'next-intl';

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
    const {currentLanguage, setLanguage} = useLanguage();
    // ✅ Typesafe: 'nav' namespace will be validated against your message structure
    const t = useTranslations('nav');

    const handleLanguageChange = (language: Language) => {
        setLanguage(language);
    };

    const getLanguageDisplay = (lang: Language) => {
        switch (lang) {
            case Language.he_IL:
                return {flag: '🇮🇱', name: 'עברית', short: 'עב'};
            case Language.en_US:
                return {flag: '🇺🇸', name: 'English', short: 'EN'};
            default:
                // ✅ Typesafe: 'language' key is validated against nav namespace
                return {flag: '🌐', name: t('language'), short: 'LG'};
        }
    };

    const currentLangDisplay = getLanguageDisplay(currentLanguage);

    return (
        <nav className='flex items-center gap-6'>
            <div className='flex items-center gap-2'>
                <ModeToggle/>
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
                        <Button variant='outline' className='rounded-full'>
                            {/* ✅ Typesafe: 'signIn' key is validated */}
                            {t('signIn')}
                        </Button>
                    </Link>
                </SignedOut>
            </div>

            {/* Language Toggle */}
            <div className='flex items-center gap-4'>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant='outline' size='sm' className='gap-2'>
                            <Globe className='h-4 w-4'/>
                            <span className='hidden sm:inline'>{currentLangDisplay.name}</span>
                            <span className='sm:hidden'>{currentLangDisplay.short}</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                        <DropdownMenuItem
                            onClick={() => handleLanguageChange(Language.he_IL)}
                            className={currentLanguage === Language.he_IL ? 'bg-accent' : ''}
                        >
                            <span className='mr-2'>🇮🇱</span>
                            עברית
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => handleLanguageChange(Language.en_US)}
                            className={currentLanguage === Language.en_US ? 'bg-accent' : ''}
                        >
                            <span className='mr-2'>🇺🇸</span>
                            English
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </nav>
    );
};
