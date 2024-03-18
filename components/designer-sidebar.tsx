import { FormElementsSidebar } from '@/components/form-elements-sidebar';
import { PropertiesFormSidebar } from '@/components/properties-form-sidebar';
import { useDesigner } from '@/hooks/use-designer';

export const DesignerSidebar = () => {
    const { selectedElement } = useDesigner();
    return (
        <aside className='w-[400px] max-w-[400px] flex flex-col flex-grow gap-2 border-l-2 border-muted p-4 bg-background overflow-y-auto h-full'>
            {!selectedElement && <FormElementsSidebar />}
            {selectedElement && <PropertiesFormSidebar />}
        </aside>
    );
};
