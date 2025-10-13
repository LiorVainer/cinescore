'use client';

import { useUserFollows, useCreateFollow, useDeleteFollow } from '@/lib/query/follow';
import { FollowType } from '@prisma/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { UserPlus, UserCheck } from 'lucide-react';

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

    const existingFollow = follows?.find((f) => f.type === type && f.value === value);
    const isFollowing = !!existingFollow;
    const isPending = isCreating || isDeleting;

    const handleToggle = () => {
        if (isFollowing && existingFollow) {
            deleteFollow(existingFollow.id, {
                onSuccess: () => toast.success(`Unfollowed ${value}`),
                onError: (error) => toast.error(error.message),
            });
        } else {
            createFollow(
                { type, value },
                {
                    onSuccess: () => toast.success(`Following ${value}`),
                    onError: (error) => toast.error(error.message),
                },
            );
        }
    };

    return (
        <Button
            onClick={handleToggle}
            disabled={isPending}
            variant={isFollowing ? 'outline' : variant}
            size={size}
            className={fullWidth ? 'w-full' : ''}
        >
            {isPending ? (
                <>Loading...</>
            ) : isFollowing ? (
                <>
                    <UserCheck className='mr-2 h-4 w-4' />
                    Following
                </>
            ) : (
                <>
                    <UserPlus className='mr-2 h-4 w-4' />
                    Follow
                </>
            )}
        </Button>
    );
}
