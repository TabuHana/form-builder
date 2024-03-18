'use client';

import { useState } from 'react';
import { DragEndEvent, useDndMonitor, useDraggable, useDroppable } from '@dnd-kit/core';
import { Trash2 } from 'lucide-react';

import { DesignerSidebar } from '@/components/designer-sidebar';
import { Button } from '@/components/ui/button';
import { ElementsType, FormElementInstance, FormElements } from '@/components/form-elements';
import { useDesigner } from '@/hooks/use-designer';
import { cn, idGenerator } from '@/lib/utils';

export const Designer = () => {
    const { elements, addElement, selectedElement, setSelectedElement, removeElement } = useDesigner();

    const droppable = useDroppable({
        id: 'designer-drop-area',
        data: {
            isDesignerDropArea: true,
        },
    });

    useDndMonitor({
        onDragEnd: (event: DragEndEvent) => {
            const { active, over } = event;
            if (!active || !over) return;

            const isDesignerButtonElement = active.data?.current?.isDesignerButtonElement;
            const isDroppingOverDesignerDropArea = over.data?.current?.isDesignerDropArea;

            // First scenario: Dropping a sidebar btn element over the designer drop area
            const droppingSidebarBtnOverDesignerDropArea = isDesignerButtonElement && isDroppingOverDesignerDropArea;
            if (droppingSidebarBtnOverDesignerDropArea) {
                const type = active.data?.current?.type;
                const newElement = FormElements[type as ElementsType].construct(idGenerator());

                addElement(elements.length, newElement);
                return;
            }

            const isDroppingOverDesignerElementTopHalf = over.data?.current?.isTopHalfDesignerElement;

            const isDroppingOverDesignerElementBottomHalf = over.data?.current?.isBottomHalfDesignerElement;

            const isDroppingOverDesignerElement =
                isDroppingOverDesignerElementTopHalf || isDroppingOverDesignerElementBottomHalf;

            const droppingSidebarBtnOverDesignerElement = isDesignerButtonElement && isDroppingOverDesignerElement;

            // Second scenario: Dropping a sidebar btn element over a designer element
            if (droppingSidebarBtnOverDesignerElement) {
                const type = active.data?.current?.type;
                const newElement = FormElements[type as ElementsType].construct(idGenerator());

                const overId = over.data?.current?.elementId;

                const overElementIndex = elements.findIndex(el => el.id == overId);
                if (overElementIndex === -1) {
                    throw new Error('Element not found');
                }

                let indexForNewElement = overElementIndex; // assuming over top-half

                if (isDroppingOverDesignerElementBottomHalf) {
                    indexForNewElement = overElementIndex + 1;
                }

                addElement(indexForNewElement, newElement);
                return;
            }

            // Third scenario: Dragging a designer element over another designer element
            const isDraggingDesignerElement = active.data?.current?.isDesignerElement;

            const draggingDesignerElementOverAnotherDesignerElement =
                isDroppingOverDesignerElement && isDraggingDesignerElement;

            if (draggingDesignerElementOverAnotherDesignerElement) {
                const activeId = active.data?.current?.elementId;
                const overId = over.data?.current?.elementId;

                const activeElementIndex = elements.findIndex(el => el.id === activeId);

                const overElementIndex = elements.findIndex(el => el.id === overId);

                if (activeElementIndex === -1 || overElementIndex === -1) {
                    throw new Error('Element not found');
                }

                const activeElement = { ...elements[activeElementIndex] };
                removeElement(activeId);

                let indexForNewElement = overElementIndex; // i assume i'm on top-half
                if (isDroppingOverDesignerElementBottomHalf) {
                    indexForNewElement = overElementIndex + 1;
                }

                addElement(indexForNewElement, activeElement);
            }
        },
    });

    return (
        <div className='flex w-full h-full'>
            <div
                className='p-4 w-full'
                onClick={() => {
                    if (selectedElement) setSelectedElement(null);
                }}
            >
                <div
                    ref={droppable.setNodeRef}
                    className={cn(
                        'bg-background max-w-[920px] h-full m-auto rounded-xl flex flex-col flex-grow items-center justify-start flex-1 overflow-y-auto',
                        droppable.isOver && 'ring-4 ring-primary ring-inset'
                    )}
                >
                    {!droppable.isOver && elements.length === 0 && (
                        <p className='text-3xl  text-muted-foreground flex flex-grow items-center font-bold'>
                            Drop here
                        </p>
                    )}
                    {droppable.isOver && elements.length === 0 && (
                        <div className='p-4 w-full'>
                            <div className='h-[120px] rounded-md bg-primary/20'></div>
                        </div>
                    )}
                    {elements.length > 0 && (
                        <div className='flex flex-col  w-full gap-2 p-4'>
                            {elements.map(element => (
                                <DesignerElementWrapper
                                    key={element.id}
                                    element={element}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <DesignerSidebar />
        </div>
    );
};

function DesignerElementWrapper({ element }: { element: FormElementInstance }) {
    const [mouseIsOver, setMouseIsOver] = useState<boolean>(false);

    const { removeElement, selectedElement, setSelectedElement } = useDesigner();

    const topHalf = useDroppable({
        id: element.id + '-top',
        data: {
            type: element.type,
            elementId: element.id,
            isTopHalfDesignerElement: true,
        },
    });

    const bottomHalf = useDroppable({
        id: element.id + '-bottom',
        data: {
            type: element.type,
            elementId: element.id,
            isBottomHalfDesignerElement: true,
        },
    });

    const draggable = useDraggable({
        id: element.id + '-drag-handler',
        data: {
            type: element.type,
            elementId: element.id,
            isDesignerElement: true,
        },
    });

    if (draggable.isDragging) return null;

    const DesignerElement = FormElements[element.type].designerComponent;
    return (
        <div
            className='relative h-[120px] flex flex-col text-foreground hover:cursor-pointer rounded-md ring-1 ring-accent ring-inset'
            onMouseEnter={() => {
                setMouseIsOver(true);
            }}
            onMouseLeave={() => {
                setMouseIsOver(false);
            }}
            onClick={e => {
                e.stopPropagation();
                setSelectedElement(element);
            }}
            ref={draggable.setNodeRef}
            {...draggable.listeners}
            {...draggable.attributes}
        >
            <div
                ref={topHalf.setNodeRef}
                className='absolute w-full h-1/2 top-0 rounded-t-md'
            ></div>
            <div
                ref={bottomHalf.setNodeRef}
                className='absolute w-full h-1/2 bottom-0 rounded-b-md'
            ></div>
            {mouseIsOver && (
                <>
                    <div className='absolute right-0 h-full'>
                        <Button
                            className='flex justify-center h-full border rounded-md rounded-l-none bg-red-500'
                            variant='destructive'
                            onClick={e => {
                                e.stopPropagation();
                                removeElement(element.id);
                            }}
                        >
                            <Trash2 className='h-6 w-6' />
                        </Button>
                    </div>
                    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse'>
                        <p className='text-muted-foreground text-sm'>Click for properties or drag to move</p>
                    </div>
                </>
            )}
            {topHalf.isOver && <div className='absolute w-full h-2 top-0 bg-primary rounded-t-md'></div>}
            {bottomHalf.isOver && <div className='absolute w-full h-2 bottom-0 bg-primary rounded-b-md'></div>}
            <div
                className={cn(
                    'flex w-full h-[120px] items-center rounded-md bg-accent px-4 py-2 pointer-events-none',
                    mouseIsOver && 'opacity-30'
                )}
            >
                <DesignerElement elementInstance={element} />
            </div>
        </div>
    );
}
