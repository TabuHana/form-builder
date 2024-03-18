'use client';

import { useEffect, useId, useState } from 'react';
import { ArrowLeft, ArrowRight, LoaderCircle } from 'lucide-react';
import { Form } from '@prisma/client';
import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import Confetti from 'react-confetti';

import { PreviewDialogButton } from '@/components/preview-dialog-button';
import { SaveFormButton } from '@/components/save-form-button';
import { PublishFormButton } from '@/components/publish-form-button';
import { Designer } from '@/components/designer';
import { DragOverlayWrapper } from '@/components/drag-overlay-wrapper';
import { useDesigner } from '@/hooks/use-designer';
import { Input } from './ui/input';
import { Button } from '@/components/ui/button';
import { toast } from './ui/use-toast';
import Link from 'next/link';

export const FormBuilder = ({ form }: { form: Form }) => {
    const { setElements } = useDesigner();
    const [isReady, setIsReady] = useState(false);

    // Fix for DndContext. Generates a unique id for the DndContext
    const id = useId();

    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: {
            distance: 10,
        },
    });

    const touchSensor = useSensor(TouchSensor, {
        activationConstraint: {
            delay: 300,
            tolerance: 5,
        },
    });

    const sensors = useSensors(mouseSensor, touchSensor);

    useEffect(() => {
        if (isReady) return;
        const elements = JSON.parse(form.content);
        setElements(elements);
        const readyTimeout = setTimeout(() => setIsReady(true), 500);
        return () => clearTimeout(readyTimeout);
    }, [form, setElements]);

    if (!isReady) {
        return (
            <div className='flex flex-col items-center justify-center w-full h-full'>
                <LoaderCircle className='animate-spin h-12 w-12' />
            </div>
        );
    }

    const shareUrl = `${window.location.origin}/submit/${form.shareUrl}`;

    if (form.published) {
        return (
            <>
                <Confetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                    recycle={false}
                    numberOfPieces={1000}
                />
                <div className='flex flex-col items-center justify-center h-full w-full'>
                    <div className='max-w-md'>
                        <h1 className='text-center text-4xl font-bold text-primary border-b pb-2 mb-10'>
                            🎊🎊 Form Published 🎊🎊
                        </h1>
                        <h2 className='text-2xl'>Share this form</h2>
                        <h3 className='text-xl text-muted-foreground border-b pb-10'>
                            Anyone with the link can view and submit the form
                        </h3>
                        <div className='my-4 flex flex-col gap-2 items-center w-full border-b pb-4'>
                            <Input
                                className='w-full'
                                readOnly
                                value={shareUrl}
                            />
                            <Button
                                className='mt-2 w-full'
                                onClick={() => {
                                    navigator.clipboard.writeText(shareUrl);
                                    toast({
                                        title: 'Copied!',
                                        description: 'Link copied to clipboard',
                                    });
                                }}
                            >
                                Copy link
                            </Button>
                        </div>
                        <div className='flex justify-between'>
                            <Button
                                variant='link'
                                asChild
                            >
                                <Link
                                    href={'/'}
                                    className='gap-2'
                                >
                                    <ArrowLeft />
                                    Go back home
                                </Link>
                            </Button>
                            <Button
                                variant='link'
                                asChild
                            >
                                <Link
                                    href={`/forms/${form.id}`}
                                    className='gap-2'
                                >
                                    Form details
                                    <ArrowRight />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <DndContext
            id={id}
            sensors={sensors}
        >
            <main className='flex flex-col w-full'>
                <nav className='flex justify-between border-b-2 p-4 gap-3 items-center'>
                    <h2 className='truncate font-medium'>
                        <span className='text-muted-foreground mr-2'>Form:</span>
                        {form.name}
                    </h2>
                    <div className='flex items-center gap-2'>
                        <PreviewDialogButton />
                        {!form.published && (
                            <>
                                <SaveFormButton id={form.id} />
                                <PublishFormButton id={form.id} />
                            </>
                        )}
                    </div>
                </nav>
                <div
                    className='flex w-full flex-grow items-center justify-center
                relative overflow-y-auto h-[200px] bg-accent bg-[url(/paper.svg)] dark:bg-[url(/paper-dark.svg)]'
                >
                    <Designer />
                </div>
            </main>
            <DragOverlayWrapper />
        </DndContext>
    );
};
