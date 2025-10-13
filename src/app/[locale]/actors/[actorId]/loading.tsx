import {Card, CardContent, CardHeader} from '@/components/ui/card';
import {Skeleton} from '@/components/ui/skeleton';
import {Separator} from '@/components/ui/separator';

export default function ActorLoading() {
    return (
        <div className="container mx-auto py-8 px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column Skeleton */}
                <div className="lg:col-span-1">
                    <Card>
                        <CardContent className="pt-6">
                            {/* Avatar Skeleton */}
                            <div className="flex justify-center mb-6">
                                <Skeleton className="h-48 w-48 rounded-full"/>
                            </div>

                            {/* Name Skeleton */}
                            <Skeleton className="h-8 w-3/4 mx-auto mb-4"/>

                            {/* Follow Button Skeleton */}
                            <Skeleton className="h-10 w-full mb-6"/>

                            <Separator className="my-4"/>

                            {/* Details Skeleton */}
                            <div className="space-y-3">
                                <Skeleton className="h-4 w-full"/>
                                <Skeleton className="h-4 w-2/3"/>
                                <Skeleton className="h-4 w-1/2"/>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column Skeleton */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-32"/>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full"/>
                                <Skeleton className="h-4 w-full"/>
                                <Skeleton className="h-4 w-3/4"/>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-40"/>
                            <Skeleton className="h-4 w-24 mt-2"/>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="flex gap-4 p-3">
                                        <Skeleton className="h-24 w-16"/>
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-5 w-3/4"/>
                                            <Skeleton className="h-4 w-16"/>
                                            <Skeleton className="h-6 w-12"/>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

