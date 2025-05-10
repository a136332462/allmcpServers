import Link from 'next/link'

function removePageParam(url) {
    if (!url.includes('?')) return url
    const [base, query] = url.split('?')
    const params = new URLSearchParams(query)
    params.delete('page')
    const newQuery = params.toString()
    return newQuery ? `${base}?${newQuery}` : base
}

export default function Pagination({ currentPage, totalPages, basePath }) {
    const maxVisiblePages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }
    const showStartEllipsis = startPage > 2
    const showEndEllipsis = endPage < totalPages - 1

    const cleanedPath = removePageParam(basePath)
    const hasQuery = cleanedPath.includes('?') && !cleanedPath.endsWith('?') && !cleanedPath.endsWith('&')
    const getPageHref = (page) =>
        hasQuery
            ? `${cleanedPath}&page=${page}`
            : `${cleanedPath}?page=${page}`

    return (
        <div className="flex flex-col items-center mt-10 space-y-4">
            <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
            </div>

            <nav className="flex items-center gap-1">
                {currentPage > 1 && (
                    <Link
                        href={getPageHref(currentPage - 1)}
                        className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium bg-secondary text-foreground hover:bg-secondary/80 transition-colors btn-hover"
                        aria-label="Previous page"
                    >
                        Previous
                    </Link>
                )}

                {/* Always show first page */}
                <Link
                    href={getPageHref(1)}
                    className={`inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                        currentPage === 1 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground hover:bg-secondary/80'
                    } btn-hover`}
                >
                    1
                </Link>

                {showStartEllipsis && (
                    <span className="px-3 py-2 text-muted-foreground">...</span>
                )}

                {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i)
                    .filter(page => page > 1 && page < totalPages)
                    .map((page) => (
                        <Link
                            key={page}
                            href={getPageHref(page)}
                            className={`inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                                currentPage === page ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground hover:bg-secondary/80'
                            } btn-hover`}
                        >
                            {page}
                        </Link>
                    ))}

                {showEndEllipsis && (
                    <span className="px-3 py-2 text-muted-foreground">...</span>
                )}

                {totalPages > 1 && (
                    <Link
                        href={getPageHref(totalPages)}
                        className={`inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                            currentPage === totalPages ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground hover:bg-secondary/80'
                        } btn-hover`}
                    >
                        {totalPages}
                    </Link>
                )}

                {currentPage < totalPages && (
                    <Link
                        href={getPageHref(currentPage + 1)}
                        className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium bg-secondary text-foreground hover:bg-secondary/80 transition-colors btn-hover"
                        aria-label="Next page"
                    >
                        Next
                    </Link>
                )}
            </nav>
        </div>
    )
}