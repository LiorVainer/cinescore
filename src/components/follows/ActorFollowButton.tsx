'use client';

import React from 'react';
import {useCreateFollow, useDeleteFollow, useUserFollows} from '@/lib/query/follow';
import {FollowType} from '@prisma/client';
import {toast} from 'sonner';
import {Button} from '@/components/ui/button';
import {UserCheck, UserPlus} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {authClient} from '@/lib/auth-client';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';

interface ActorFollowButtonProps {
    userId: string;
    type: FollowType;
    value: string;
    variant?: 'default' | 'outline' | 'secondary';
    size?: 'default' | 'sm' | 'lg';
    fullWidth?: boolean;
}

export function ActorFollowButton({
    userId,
    type,
    value,
    variant = 'default',
    size = 'default',
    fullWidth = true,
}: ActorFollowButtonProps) {
    const { data: follows } = useUserFollows(userId);
    const { mutate: createFollow, isPending: isCreating } = useCreateFollow(userId);
    const { mutate: deleteFollow, isPending: isDeleting } = useDeleteFollow(userId);
    // Use actor namespace for follow-related translations; fall back to general where appropriate
    const t = useTranslations('actor');
    const tGeneral = useTranslations('general');

    const existingFollow = follows?.find((f) => f.type === type && f.value === value);
    const isFollowing = !!existingFollow;
    const isPending = isCreating || isDeleting;

    const { data: session } = authClient.useSession();

    const handleToggle = () => {
        if (!session?.user) {
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
                    onClick={() => { /* DialogTrigger will open dialog */ }}
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
                    <DialogTitle>{t('signInToFollow.title')}</DialogTitle>
                    <DialogDescription>{t('signInToFollow.description')}</DialogDescription>
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
                            onClick={() => {
                                // prefer client-side `authClient.signIn()` if available
                                // better-auth's client exposes `openSignIn()` or redirect; attempt generic signIn
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-ignore
                                if (typeof authClient.openSignIn === 'function') {
                                    // @ts-ignore
                                    authClient.openSignIn();
                                } else if (typeof authClient.signIn === 'function') {
                                    // @ts-ignore
                                    authClient.signIn();
                                } else {
                                    // fallback: navigate to /sign-in
                                    window.location.href = '/sign-in';
                                }
                            }}
                        >
                            {t('signInToFollow.action')}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
