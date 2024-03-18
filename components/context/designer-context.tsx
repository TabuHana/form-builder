'use client';

import { Dispatch, SetStateAction, createContext, useState } from 'react';
import { FormElementInstance } from '../form-elements';

type DesignerContextType = {
    elements: FormElementInstance[];
    setElements: Dispatch<SetStateAction<FormElementInstance[]>>;
    addElement: (index: number, element: FormElementInstance) => void;
    removeElement: (id: string) => void;
    updateElement: (id: string, element: FormElementInstance) => void;

    selectedElement: FormElementInstance | null;
    setSelectedElement: Dispatch<SetStateAction<FormElementInstance | null>>;
};

export const DesignerContext = createContext<DesignerContextType | null>(null);

export default function DesignerContextProvider({ children }: { children: React.ReactNode }) {
    const [elements, setElements] = useState<FormElementInstance[]>([]);
    const [selectedElement, setSelectedElement] = useState<FormElementInstance | null>(null);

    const addElement = (index: number, element: FormElementInstance) => {
        setElements(prev => {
            const oldElements = [...prev];
            oldElements.splice(index, 0, element);
            return oldElements;
        });
    };

    const removeElement = (id: string) => {
        setElements(prev => prev.filter(element => element.id !== id));
    };

    const updateElement = (id: string, element: FormElementInstance) => {
        setElements(prev => {
            const newElements = [...prev];
            const index = newElements.findIndex(el => el.id === id);
            newElements[index] = element;
            return newElements;
        });
    };

    return (
        <DesignerContext.Provider
            value={{
                elements,
                addElement,
                removeElement,
                selectedElement,
                setSelectedElement,
                updateElement,
                setElements,
            }}
        >
            {children}
        </DesignerContext.Provider>
    );
}
