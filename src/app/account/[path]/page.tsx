import { AccountView } from '@daveyplate/better-auth-ui';
import { accountViewPaths } from '@daveyplate/better-auth-ui/server';

export const dynamicParams = false;

export function generateStaticParams() {
    return Object.values(accountViewPaths).map((path) => ({ path }));
}

type AccountPageProps = {
    params: Promise<{ path: string }>;
};

export default async function AccountPage({ params }: AccountPageProps) {
    const { path } = await params;

    return (
        <main className='container h-screen p-4 md:p-12'>
            <AccountView path={path} />
        </main>
    );
}
