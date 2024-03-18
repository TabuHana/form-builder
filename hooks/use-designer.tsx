'use client'

import { useContext } from "react"

import { DesignerContext } from "@/components/context/designer-context"

export function useDesigner() {
    const context = useContext(DesignerContext)

    if (!context) {
        throw new Error('useDesigner must be used within a DesignerContextProvider')
    }

    return context
}