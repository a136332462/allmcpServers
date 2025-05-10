'use client'

import { useEffect, useState } from 'react'
import { CheckCircle } from 'lucide-react'

export function Toast({ message, duration = 3000, onClose }) {
    const [visible, setVisible] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false)
            onClose?.()
        }, duration)

        return () => clearTimeout(timer)
    }, [duration, onClose])

    if (!visible) return null

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <div className="flex items-center gap-2 bg-[#273e2a] text-[#baffc9] px-4 py-3 rounded-md shadow-lg border border-[#3c4d3e]">
                <CheckCircle size={20} />
                <span>{message}</span>
            </div>
        </div>
    )
}