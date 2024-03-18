'use client';

import { useState } from 'react';
import { Active, DragOverlay, useDndMonitor } from '@dnd-kit/core';

import { ElementsType, FormElements } from '@/components/form-elements';
import { SidebarButtonElementDragOverlay } from '@/components/sidebar-button-element';
import { useDesigner } from '@/hooks/use-designer';

export const DragOverlayWrapper = () => {
    const [draggedItem, setDraggedItem] = useState<Active | null>(null);
    const { elements } = useDesigner();

    useDndMonitor({
        onDragStart: event => {
            setDraggedItem(event.active);
        },
        onDragCancel: () => {
            setDraggedItem(null);
        },
        onDragEnd: () => {
            setDraggedItem(null);
        },
    });

    if (!draggedItem) return null;

    let node = <div>No drag overlay</div>;
    const isSidebarButtonElement = draggedItem.data?.current?.isDesignerButtonElement;

    if (isSidebarButtonElement) {
        const type = draggedItem.data?.current?.type as ElementsType;
        node = <SidebarButtonElementDragOverlay formElement={FormElements[type]} />;
    }

    const isDesignerElement = draggedItem.data?.current?.isDesignerElement;
    if (isDesignerElement) {
        const elementId = draggedItem.data?.current?.elementId;
        const element = elements.find(el => el.id === elementId);
        if (!element) {
            node = <div>Element Not Found! Error!</div>;
        } else {
            const DesignerElementComponent = FormElements[element.type].designerComponent;

            node = (
                <div className='flex bg-accent border rounded-md h-[120px] w-full py-2 px-4 opacity-80 pointer pointer-events-none'>
                    <DesignerElementComponent elementInstance={element} />
                </div>
            );
        }
    }

    return <DragOverlay>{node}</DragOverlay>;
};
