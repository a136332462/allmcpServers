'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from "next/image"
import { ExternalLink, X, Loader2 } from 'lucide-react'

export function Navigation() {
    const [isOpen, setIsOpen] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        url: '',
        icon: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [showSuccessToast, setShowSuccessToast] = useState(false)
    const [urlChecking, setUrlChecking] = useState(false)

    // Auto-dismiss messages
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(''), 3000)
            return () => clearTimeout(timer)
        }
    }, [error])

    useEffect(() => {
        if (showSuccessToast) {
            const timer = setTimeout(() => setShowSuccessToast(false), 3000)
            return () => clearTimeout(timer)
        }
    }, [showSuccessToast])

    const handleInputChange = async (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))

        if (name === 'url' && value) {
            if (!value.startsWith('https://github.com/')) {
                setError('Only GitHub resources are allowed (https://github.com/)')
                return
            }

            setUrlChecking(true)
            try {
                const res = await fetch(`/api/check-resource-exists?url=${encodeURIComponent(value)}`)
                if (!res.ok) throw new Error('URL check failed')

                const data = await res.json()
                if (data.exists) {
                    setError('This URL already exists, please do not submit duplicates')
                } else {
                    setError('')
                }
            } catch (err) {
                console.error('URL check failed:', err)
                setError('Error checking URL, please try again')
            } finally {
                setUrlChecking(false)
            }
        }

        if (name === 'icon' && value) {
            if (!value.startsWith('https://')) {
                setError('Icon URL must use HTTPS protocol')
                return
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.name || !formData.description || !formData.url) {
            setError('Please fill in all required fields')
            return
        }

        if (!formData.url.startsWith('https://github.com/')) {
            setError('Only GitHub resources are allowed (https://github.com/)')
            return
        }

        if (formData.icon && !formData.icon.startsWith('https://')) {
            setError('Icon URL must use HTTPS protocol')
            return
        }

        setIsSubmitting(true)
        try {
            const res = await fetch('/api/submit-resource', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Submission failed')
            }

            // Success handling
            setShowSuccessToast(true)
            setIsOpen(false)
            setFormData({
                name: '',
                description: '',
                url: '',
                icon: ''
            })
        } catch (err) {
            setError(err.message || 'Submission failed, please try again later')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <header className="sticky top-0 z-40 w-full ">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex gap-6 md:gap-10">
                    <Link href="/" className="flex items-center space-x-2">
                        <Image
                            src="/favicon.webp"
                            alt="All MCP"
                            width={32}
                            height={32}
                            className="w-8 h-8" // 添加 h-8 保持宽高比
                            priority
                        />
                        <span className="text-white text-xl text-primary font-bold">All</span>
                        <span className="text-[#ffa94d] text-xl font-bold">MCP Servers</span>
                    </Link>
                    {/* 添加FAQ按钮 */}
                    <Link
                        href="#faq-section"
                        className="flex items-center text-sm font-medium text-[#d1cfcf] hover:text-[#ffa94d] transition-colors"
                    >
                        FAQ
                    </Link>
                </div>

                <button
                    onClick={() => setIsOpen(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ffa94d] px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-[#ffd97d]"
                >
                    Submit
                </button>

                {/* Modal Component */}
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <div className="relative w-full max-w-md rounded-lg bg-[#1e1b16] border border-[#2e2a23] p-6">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-4 right-4 text-[#d1cfcf] hover:text-[#ffa94d]"
                            >
                                <X size={20} />
                            </button>

                            <h3 className="text-2xl font-bold text-[#ffa94d] mb-4">Submit New Resource</h3>

                            {error && (
                                <div className="mb-4 p-3 bg-[#312a39] text-[#ff6b6b] rounded-md text-sm">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#d1cfcf] mb-1">
                                        Name <span className="text-[#ff6b6b]">*</span>
                                    </label>
                                    <input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full rounded-md bg-[#2e2a23] border border-[#2e2a23] px-3 py-2 text-white focus:border-[#ffa94d] focus:outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#d1cfcf] mb-1">
                                        Description <span className="text-[#ff6b6b]">*</span>
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full rounded-md bg-[#2e2a23] border border-[#2e2a23] px-3 py-2 text-white focus:border-[#ffa94d] focus:outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#d1cfcf] mb-1">
                                        URL <span className="text-[#ff6b6b]">*</span>
                                    </label>
                                    <input
                                        name="url"
                                        type="url"
                                        value={formData.url}
                                        onChange={handleInputChange}
                                        className="w-full rounded-md bg-[#2e2a23] border border-[#2e2a23] px-3 py-2 text-white focus:border-[#ffa94d] focus:outline-none"
                                        placeholder="Must start with https://github.com/"
                                        required
                                    />
                                    {urlChecking && (
                                        <p className="mt-1 text-sm text-[#ffd97d] flex items-center gap-1">
                                            <Loader2 className="h-3 w-3 animate-spin" />
                                            Checking URL...
                                        </p>
                                    )}
                                    {formData.url && !formData.url.startsWith('https://github.com/') && (
                                        <p className="mt-1 text-sm text-[#ff6b6b]">
                                            ⚠️ Only GitHub resources are accepted (https://github.com/)
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#d1cfcf] mb-1">
                                        Icon URL (Optional)
                                    </label>
                                    <input
                                        name="icon"
                                        type="url"
                                        value={formData.icon}
                                        onChange={handleInputChange}
                                        className="w-full rounded-md bg-[#2e2a23] border border-[#2e2a23] px-3 py-2 text-white focus:border-[#ffa94d] focus:outline-none"
                                        placeholder="Must start with https://"
                                    />
                                    {formData.icon && !formData.icon.startsWith('https://') && (
                                        <p className="mt-1 text-sm text-[#ff6b6b]">
                                            ⚠️ Icon URL must use HTTPS protocol
                                        </p>
                                    )}
                                </div>

                                <div className="flex justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsOpen(false)}
                                        className="inline-flex items-center justify-center rounded-md border border-[#2e2a23] px-4 py-2 text-sm font-medium text-[#d1cfcf] hover:border-[#ffa94d] transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || urlChecking}
                                        className="inline-flex items-center justify-center rounded-md bg-[#ffa94d] px-4 py-2 text-sm font-medium text-black hover:bg-[#ffd97d] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Submitting...
                                            </>
                                        ) : 'Submit'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Success Toast */}
                {showSuccessToast && (
                    <div className="fixed top-4 left-1/2 z-50 transform -translate-x-1/2">
                        <div className="px-6 py-3 bg-[#1e1b16] border border-[#ffa94d] rounded-lg shadow-lg animate-fade-in flex items-center gap-2 text-[#ffd97d]">
                            <span>Submission successful! Will be displayed after approval</span>
                        </div>
                    </div>
                )}
            </div>
        </header>
    )
}