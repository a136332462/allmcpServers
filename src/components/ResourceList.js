import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import Image from "next/image";
import * as Tooltip from '@radix-ui/react-tooltip';
import { getCategoryName } from '@/lib/resourceUtils';
import JsonLd from "@/components/JsonLd";

export default function ResourceList({
                                         resources,
                                         currentCategory,
                                         totalCount,
                                         showMoreLink = true,
                                         backToHome = false,
                                         title = null,
                                         showCategory = true,
                                         noTextTypeTitle = false
                                     }) {
    const itemListElement = resources.map((resource, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
            "@type": "WebSite",
            "name": typeof resource.name === 'string' ? resource.name : '',
            "url": resource.url,
            "description": resource.description,
            "keywords": resource.category ? `${resource.category}, MCP Server` : 'MCP Server',
            "image": resource.icon || 'https://allmcp.org/favicon.webp'
        }
    }));

    const breadcrumbData = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://allmcp.org"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": currentCategory === 'all' ? 'All Resources' : `${getCategoryName(currentCategory)} Resources`,
                "item": `https://allmcp.org${currentCategory === 'all' ? '/resources' : `/?category=${currentCategory}`}`
            }
        ]
    };

    return (
        <section aria-label="Resource list" className="resource-list">
            <JsonLd data={{
                "@context": "https://schema.org",
                "@type": "ItemList",
                "itemListElement": itemListElement,
                "name": `${getCategoryName(currentCategory)} MCP Servers`,
                "description": `Collection of ${getCategoryName(currentCategory)} Model Context Protocol (MCP) servers`
            }} />
            <JsonLd data={breadcrumbData} />

            <div className="mb-8 p-6 bg-[#1e1b16] rounded-lg border border-[#2e2a23]">
                <p className="text-[#d1cfcf] text-sm">
                    Browse our collection of <b>{getCategoryName(currentCategory)} MCP servers</b>.
                    These implementations of the <b>Model Context Protocol</b> allow AI models to connect with external data sources and tools.
                    {currentCategory === 'featured' && ' Our featured selection represents the most popular and well-maintained MCP servers.'}
                    {currentCategory === 'latest' && ' These are the newest additions to our MCP servers directory.'}
                </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tighter text-white">
                        {title || (currentCategory === 'all' ? 'All MCP Resources' : `${getCategoryName(currentCategory)} MCP Servers`)}
                    </h2>
                    {totalCount && <p className="text-sm mt-1 text-muted-foreground">{totalCount} resources available</p>}
                </div>

                <div className="flex gap-4">
                    {showMoreLink && (
                        <Link
                            href={currentCategory === 'all' ? '/category/all' : `/category/${currentCategory}`}
                            className="inline-flex items-center text-primary hover:text-primary/90 transition-colors text-sm font-medium"
                            prefetch={false}
                            aria-label={`View all ${getCategoryName(currentCategory)} MCP resources`}
                        >
                            View all →
                        </Link>
                    )}
                    {backToHome && (
                        <Link
                            href="/"
                            className="inline-flex items-center text-primary hover:text-primary/90 transition-colors text-sm font-medium"
                        >
                            ← Back to Home
                        </Link>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {resources.map((resource) => (
                    <Tooltip.Provider key={resource.id || resource.url} delayDuration={200}>
                        <Tooltip.Root>
                            <Tooltip.Trigger asChild>
                                <div className="group relative h-full">
                                    <Link
                                        href={resource.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="h-full flex flex-col card-base rounded-lg overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
                                        aria-label={`View ${resource.name} MCP server details`}
                                    >
                                        <div className="p-6 flex flex-col h-full">
                                            <div className="flex items-center gap-3 mb-3">
                                                {resource.icon && (
                                                    <div className="flex-shrink-0">
                                                        <Image
                                                            src={resource.icon}
                                                            alt={typeof resource.name === 'string' ? `${resource.name} logo` : 'MCP server icon'}
                                                            width={32}
                                                            height={32}
                                                            className="w-8 h-8 rounded-sm object-contain"
                                                            loading="lazy"
                                                        />
                                                    </div>
                                                )}
                                                <div className="min-w-0">
                                                    {noTextTypeTitle ? (
                                                        <h3 className="text-lg font-semibold leading-tight text-white group-hover:text-primary truncate">
                                                            {resource.name}
                                                        </h3>
                                                    ) : (
                                                        <h3 className="text-lg font-semibold leading-tight text-white group-hover:text-primary truncate">
                                                            {resource.name}
                                                        </h3>
                                                    )}
                                                </div>
                                                <ExternalLink
                                                    size={16}
                                                    className="ml-auto text-muted-foreground group-hover:text-primary flex-shrink-0"
                                                    aria-hidden="true"
                                                />
                                            </div>

                                            <div className="flex-1">
                                                <p
                                                    className="text-sm text-muted-foreground line-clamp-3 mb-3"
                                                    dangerouslySetInnerHTML={{ __html: resource.description }}
                                                />
                                            </div>

                                            {showCategory && resource.category && (
                                                <div className="mt-auto pt-3">
                          <span className="inline-block px-2.5 py-1 text-xs rounded-full bg-secondary text-secondary-foreground">
                            {getCategoryName(resource.category)}
                          </span>
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                </div>
                            </Tooltip.Trigger>
                            <Tooltip.Portal>
                                <Tooltip.Content
                                    className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-foreground select-none rounded-lg bg-secondary px-4 py-3 text-sm leading-none shadow-lg will-change-[transform,opacity] max-w-xs"
                                    sideOffset={5}
                                >
                                    <div className="mb-1 font-medium text-primary">
                                        {typeof resource.name === 'string' ? resource.name : ''}
                                    </div>
                                    <div className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: resource.description }} />
                                    {resource.category && (
                                        <div className="mt-2 text-xs text-accent">
                                            Category: {getCategoryName(resource.category)}
                                        </div>
                                    )}
                                    <Tooltip.Arrow className="fill-secondary" />
                                </Tooltip.Content>
                            </Tooltip.Portal>
                        </Tooltip.Root>
                    </Tooltip.Provider>
                ))}
            </div>
        </section>
    );
}