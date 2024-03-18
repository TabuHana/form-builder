import { ArrowRight, Edit, Rows4Icon } from 'lucide-react';
import { Suspense } from 'react';
import { formatDistance } from 'date-fns';

import { GetFormStats, GetForms } from '@/actions/form';
import { CreateFormButton } from '@/components/create-form-button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Form } from '@prisma/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
    return (
        <div className='container pt-4'>
            <Suspense fallback={<StatsCards loading={true} />}>
                <CardStatsWrapper />
            </Suspense>
            <Separator className='my-6' />
            <h2 className='text-4xl font-bold col-span-2'>Your Forms</h2>
            <Separator className='my-6' />
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                <CreateFormButton />
                <Suspense
                    fallback={[1, 2, 3, 4].map(el => (
                        <FormCardSkeleton key={el} />
                    ))}
                >
                    <FormCards />
                </Suspense>
            </div>
        </div>
    );
}

async function CardStatsWrapper() {
    const stats = await GetFormStats();
    return (
        <StatsCards
            data={stats}
            loading={false}
        />
    );
}

type StatsCardsProps = {
    data?: Awaited<ReturnType<typeof GetFormStats>>;
    loading: boolean;
};

function StatsCards(props: StatsCardsProps) {
    const { data, loading } = props;

    return (
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            <StatCard
                title='Total Visits'
                icon={<Rows4Icon className='text-blue-600' />}
                helperText={'All time form visits'}
                value={data?.visits.toLocaleString() || ''}
                loading={loading}
                className='shadow-md shadow-blue-600'
            />
            <StatCard
                title='Total Submissions'
                icon={<Rows4Icon className='text-yellow-600' />}
                helperText={'All time form submissions'}
                value={data?.submissions.toLocaleString() || ''}
                loading={loading}
                className='shadow-md shadow-yellow-600'
            />
            <StatCard
                title='Submission Rate'
                icon={<Rows4Icon className='text-green-600' />}
                helperText={'Visits that result in a form submission'}
                value={data?.submissionRate.toLocaleString() + '%' || ''}
                loading={loading}
                className='shadow-md shadow-green-600'
            />
            <StatCard
                title='Bounce Rate'
                icon={<Rows4Icon className='text-red-600' />}
                helperText={'Visits that leaves without interacting'}
                value={data?.bounceRate.toLocaleString() + '%' || ''}
                loading={loading}
                className='shadow-md shadow-red-600'
            />
        </div>
    );
}

function StatCard({
    title,
    value,
    icon,
    helperText,
    loading,
    className,
}: {
    title: string;
    value: string;
    helperText: string;
    icon: React.ReactNode;
    loading: boolean;
    className: string;
}) {
    return (
        <Card className={className}>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
                <CardTitle className='text-sm font-medium text-muted-foreground'>{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div>
                    {loading && (
                        <Skeleton>
                            <span className='opacity-0'>0</span>
                        </Skeleton>
                    )}
                    {!loading && value}
                </div>
                <p className='text-xs text-muted-foreground pt-1'>{helperText}</p>
            </CardContent>
        </Card>
    );
}

function FormCardSkeleton() {
    return <Skeleton className='border-2 border-primary-/20 h-48 w-full' />;
}

async function FormCards() {
    const forms = await GetForms();

    return (
        <>
            {forms.map(form => (
                <FormCard
                    key={form.id}
                    form={form}
                />
            ))}
        </>
    );
}

function FormCard({ form }: { form: Form }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className='flex items-center gap-2 justify-between'>
                    <span className='truncate font-bold'>{form.name}</span>
                    {form.published && <Badge>Published</Badge>}
                    {!form.published && <Badge variant='destructive'>Draft</Badge>}
                </CardTitle>
                <CardDescription className='flex items-center justify-between text-muted-foreground text-sm'>
                    {formatDistance(form.createdAt, new Date(), {
                        addSuffix: true
                    })}
                    {!form.published && (
                        <span className='flex items-center gap-2'>
                            <Rows4Icon className='text-muted-foreground' />
                            <span>{form.visits.toLocaleString()}</span>
                            <Rows4Icon className='text-muted-foreground' />
                            <span>{form.submissions.toLocaleString()}</span>
                        </span>
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent className='h-5 truncate text-sm text-muted-foreground'>
                {form.description || 'No description'}
            </CardContent>
            <CardFooter>
                {form.published && (
                    <Button asChild className='w-full mt-2 text-md gap-4'>
                        <Link href={`/form/${form.id}`}>
                        View submissions <ArrowRight /></Link>
                    </Button>
                )}
                {!form.published && (
                    <Button asChild variant='secondary' className='w-full mt-2 text-md gap-4'>
                        <Link href={`/builder/${form.id}`}>
                        Edit Form <Edit /></Link>
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
