import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserX } from 'lucide-react';

export default function ActorNotFound() {
    return (
        <div className='container mx-auto py-16 px-4'>
            <Card className='max-w-md mx-auto'>
                <CardHeader>
                    <div className='flex justify-center mb-4'>
                        <UserX className='h-16 w-16 text-muted-foreground' />
                    </div>
                    <CardTitle className='text-center text-2xl'>Actor Not Found</CardTitle>
                </CardHeader>
                <CardContent className='text-center space-y-4'>
                    <p className='text-muted-foreground'>
                        We couldn't find the actor you're looking for. They may have been removed or the link might be
                        incorrect.
                    </p>
                    <Button asChild>
                        <Link href='/'>Return Home</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
