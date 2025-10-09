import {auth} from '@/lib/auth'; // path to your Better Auth server instance
import {headers} from 'next/headers';
import {IconLockSquareRoundedFilled} from '@tabler/icons-react';
import MovieSearch from '@/components/movie-search';
import {Constants} from "../constants/app.const";

export default async function page() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    return (
        <div className='flex h-screen w-screen flex-col px-4'>
            <section className='py-6 flex-grow w-full flex flex-col justify-center'>
                <div className='container lg:px-32'>
                    <h2 className='text-xl font-semibold mb-2'>חיפוש סרטים</h2>
                    <MovieSearch/>
                </div>
            </section>

            {/* Footer */}
            <footer className='border-t py-10 mt-auto'>
                <div className='container flex flex-col md:flex-row justify-between items-center gap-6'>
                    <div className='flex items-center gap-2'>
                        <IconLockSquareRoundedFilled size={20} className='text-primary'/>
                        <span className='font-bold'>{Constants.appName}</span>
                    </div>
                    {/*<div className='flex gap-8'>*/}
                    {/*    <a*/}
                    {/*        href='https://github.com/achour'*/}
                    {/*        target='_blank'*/}
                    {/*        className='text-sm text-muted-foreground hover:text-foreground'*/}
                    {/*    >*/}
                    {/*        Github*/}
                    {/*    </a>*/}
                    {/*    <a*/}
                    {/*        href='https://www.achour.dev'*/}
                    {/*        target='_blank'*/}
                    {/*        className='text-sm text-muted-foreground hover:text-foreground'*/}
                    {/*    >*/}
                    {/*        Portfolio*/}
                    {/*    </a>*/}
                    {/*    <a*/}
                    {/*        href='https://x.com/achourdev'*/}
                    {/*        target='_blank'*/}
                    {/*        className='text-sm text-muted-foreground hover:text-foreground'*/}
                    {/*    >*/}
                    {/*        Contact*/}
                    {/*    </a>*/}
                    {/*</div>*/}
                    <div className='text-sm text-muted-foreground'>© {new Date().getFullYear()} Lior Vainer</div>
                </div>
            </footer>
        </div>
    );
}
