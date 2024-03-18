import { useTransition } from 'react';
import { Save, LoaderCircle } from 'lucide-react';

import { UpdateFormContent } from '@/actions/form';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useDesigner } from '@/hooks/use-designer';

export const SaveFormButton = ({ id }: { id: number }) => {
    const { elements } = useDesigner();
    const [loading, startTransition] = useTransition();

    const updateFormContent = async () => {
        try {
            const jsonElements = JSON.stringify(elements);
            await UpdateFormContent(id, jsonElements);

            toast({
                title: 'Success',
                description: 'Form saved successfully',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Something went wrong',
                variant: 'destructive',
            });
        }
    };

    return (
        <Button
            variant='outline'
            className='gap-2'
            disabled={loading}
            onClick={() => startTransition(updateFormContent)}
        >
            <Save className='h-4 w-4' />
            Save
            {loading && <LoaderCircle className='animate-spin' />}
        </Button>
    );
};
