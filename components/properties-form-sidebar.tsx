import { X } from 'lucide-react';

import { FormElements } from '@/components/form-elements';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useDesigner } from '@/hooks/use-designer';

export const PropertiesFormSidebar = () => {
    const { selectedElement, setSelectedElement } = useDesigner();

    if (!selectedElement) return null;

    const PropertiesForm = FormElements[selectedElement?.type].propertiesComponent;

    return (
        <div className='flex flex-col p-2'>
            <div className='flex justify-between items-center'>
                <p className='text-sm text-foreground/70'>Element Properties</p>
                <Button
                    size='icon'
                    variant='ghost'
                    onClick={() => {
                        setSelectedElement(null);
                    }}
                >
                    <X />
                </Button>
            </div>
            <Separator className='mb-4' />
            <PropertiesForm elementInstance={selectedElement} />
        </div>
    );
};
