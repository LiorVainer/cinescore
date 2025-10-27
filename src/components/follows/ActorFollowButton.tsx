'use client';

import React from 'react';
import { useCreateFollow, useDeleteFollow, useUserFollows } from '@/lib/query/follow';
import { useRouter } from '@/i18n/navigation';
import { FollowType } from '@prisma/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { UserCheck, UserPlus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { authClient } from '@/lib/auth-client';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

interface ActorFollowButtonProps {
    type: FollowType;
    value: string;
    variant?: 'default' | 'outline' | 'secondary';
    size?: 'default' | 'sm' | 'lg';
    fullWidth?: boolean;
}

export function ActorFollowButton({
    type,
    value,
    variant = 'default',
    size = 'default',
    fullWidth = true,
}: ActorFollowButtonProps) {
    // Use actor namespace for follow-related translations; fall back to general where appropriate
    const t = useTranslations('actor');
    const tGeneral = useTranslations('general');

    const { data: session } = authClient.useSession();
    const userId = session?.user.id;
    const { mutate: createFollow, isPending: isCreating } = useCreateFollow(userId);
    const { mutate: deleteFollow, isPending: isDeleting } = useDeleteFollow(userId);
    const { data: follows } = useUserFollows(userId);

    const existingFollow = follows?.find((f) => f.type === type && f.value === value);
    const isFollowing = !!existingFollow;
    const isPending = isCreating || isDeleting;
    const router = useRouter();

    const handleToggle = () => {
        // Only proceed if we have a signed-in user
        if (!userId) {
            // no-op here; UI will open dialog via DialogTrigger when unauthenticated
            return;
        }

        if (isFollowing && existingFollow) {
            deleteFollow(existingFollow.id, {
                onSuccess: () => toast.success(t('unfollowedToast', { name: value })),
                onError: (error: any) => toast.error(error.message),
            });
        } else {
            createFollow(
                { type, value },
                {
                    onSuccess: () => toast.success(t('followingToast', { name: value })),
                    onError: (error: any) => toast.error(error.message),
                },
            );
        }
    };

    // Button content
    const content = isPending ? (
        tGeneral('loading')
    ) : isFollowing ? (
        <>
            <UserCheck className='mr-2 h-4 w-4' />
            {tGeneral('following')}
        </>
    ) : (
        <>
            <UserPlus className='mr-2 h-4 w-4' />
            {tGeneral('follow')}
        </>
    );

    // If user is signed in render the button directly
    if (session?.user) {
        return (
            <Button
                onClick={handleToggle}
                disabled={isPending}
                variant={isFollowing ? 'outline' : variant}
                size={size}
                className={fullWidth ? 'w-full' : ''}
            >
                {content}
            </Button>
        );
    }

    // If user is not signed in, render a DialogTrigger that shows a sign-in prompt
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    onClick={() => {
                        /* DialogTrigger will open dialog */
                    }}
                    disabled={isPending}
                    variant={variant}
                    size={size}
                    className={fullWidth ? 'w-full' : ''}
                >
                    {content}
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('signInToFollow.title', { actorName: value })}</DialogTitle>
                    <DialogDescription>{t('signInToFollow.description', { actorName: value })}</DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <div className='flex gap-2 w-full'>
                        <DialogClose asChild>
                            <Button variant='outline' className='flex-1'>
                                {t('cancel')}
                            </Button>
                        </DialogClose>

                        {/* Use authClient's sign-in action if available, otherwise open auth redirect */}
                        <Button
                            className='flex-1'
                            onClick={() => router.push('/auth/sign-in')} // Adjust as needed for your auth flow
                        >
                            {t('signInToFollow.action')}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
