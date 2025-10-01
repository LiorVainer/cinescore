import { auth } from '@/lib/auth'; // path to your Better Auth server instance
import { headers } from 'next/headers';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { IconLockSquareRoundedFilled } from '@tabler/icons-react';
import MovieSearch from '@/components/movie-search';
import { UserButton } from '@daveyplate/better-auth-ui';

export default async function page() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    return (
        <div className='flex h-screen flex-col'>
            {/* Navigation */}
            <header className='border-b'>
                <div className='container  flex h-16 items-center justify-between'>
                    <div className='flex items-center '>
                        {/* <Lock size={24} className="text-primary" /> */}
                        <span className='font-bold text-xl'>סינמדד</span>
                    </div>
                    <nav className='flex items-center gap-6'>
                        <div className='flex items-center gap-2'>
                            <ModeToggle />
                            {session?.user ? (
                                <UserButton
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
                            ) : (
                                <>
                                    <Link href='/auth/sign-in'>
                                        <Button variant='outline' size='sm'>
                                            התחבר
                                        </Button>
                                    </Link>
                                    <Link href='/signup'>
                                        <Button size='sm'>הירשם</Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </div>
            </header>

            {/* Search section */}
            <section className='py-6 flex-grow'>
                <div className='container'>
                    <h2 className='text-xl font-semibold mb-2'>חיפוש סרטים (TMDB + IMDb)</h2>
                    <MovieSearch />
                </div>
            </section>

            {/* Footer */}
            <footer className='border-t py-10 mt-auto'>
                <div className='container flex flex-col md:flex-row justify-between items-center gap-6'>
                    <div className='flex items-center gap-2'>
                        <IconLockSquareRoundedFilled size={20} className='text-primary' />
                        <span className='font-bold'>סינמדד</span>
                    </div>
                    <div className='flex gap-8'>
                        <a
                            href='https://github.com/achour'
                            target='_blank'
                            className='text-sm text-muted-foreground hover:text-foreground'
                        >
                            Github
                        </a>
                        <a
                            href='https://www.achour.dev'
                            target='_blank'
                            className='text-sm text-muted-foreground hover:text-foreground'
                        >
                            Portfolio
                        </a>
                        <a
                            href='https://x.com/achourdev'
                            target='_blank'
                            className='text-sm text-muted-foreground hover:text-foreground'
                        >
                            Contact
                        </a>
                    </div>
                    <div className='text-sm text-muted-foreground'>© {new Date().getFullYear()} Lior Vainer</div>
                </div>
            </footer>
        </div>
    );
}
