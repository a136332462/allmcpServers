// app/category/[category]/page.js
import {notFound} from 'next/navigation'
import Link from 'next/link'
import {loadResources, getCategoryName} from '../../../lib/resourceUtils'
import ResourceList from '../../../components/ResourceList'
import Pagination from '../../../components/Pagination'

export const metadata = {
    title: 'Search MCP Servers - Comprehensive Search API Integrations',
    description: 'Explore the best MCP servers for search functionality including web search, document retrieval, and specialized search APIs like Exa, Kagi, Brave, and more. Connect AI models to powerful search capabilities.',
    keywords: ['MCP Search', 'Search API MCP', 'Web Search MCP', 'Document Retrieval MCP', 'Exa Search', 'Kagi Search', 'Brave Search MCP', 'Tavily MCP', 'Vector Search MCP'],
    openGraph: {
        type: 'website',
        url: 'https://allmcp.org/category/search',
        title: 'Search MCP Servers - Comprehensive Search API Integrations',
        description: 'Collection of MCP servers for search functionality including web search, document retrieval and specialized search APIs',
        siteName: 'AllMCP',
        images: [{
            url: 'https://allmcp.org/favicon.webp', width: 1242, height: 1242, alt: 'MCP Search Servers Overview',
        }],
    },
    alternates: {
        canonical: 'https://allmcp.org/category/search', languages: {en: 'https://allmcp.org/category/search'},
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Search MCP Servers - Comprehensive Search API Integrations',
        description: 'Connect AI models to powerful search capabilities with these MCP servers',
        images: ['https://allmcp.org/favicon.webp'],
    },
    icons: {
        icon: '/favicon.ico',
    },
};

export default async function CategoryPage({searchParams}) {
    const category = 'search'; // 默认值为'search'
    const currentPage = Number(searchParams.page) || 1;
    const itemsPerPage = 28;

    const allResources = await loadResources(category);

    if (!allResources || allResources.length === 0) {
        return notFound();
    }

    const totalPages = Math.ceil(allResources.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedResources = allResources.slice(startIndex, startIndex + itemsPerPage);

    // 确保categoryName有值，使用category作为备选
    const categoryName = getCategoryName(category) || category.charAt(0).toUpperCase() + category.slice(1);

    return (<div className="min-h-screen text-white py-12 px-4 sm:px-6">
            <div className="rounded-xl px-3 sm:px-6 py-3 max-w-[1500px] mx-auto space-y-10">
                <section className="text-center max-w-3xl mx-auto space-y-4 mb-8">
                    <div className="flex items-center justify-center gap-3">
                        <h1 className="text-4xl sm:text-5xl font-bold">
                            <span className="text-white">{categoryName} </span>
                            <span
                                className="bg-gradient-to-r from-[#ffa94d] to-[#ffd97d] bg-clip-text text-transparent">Resources</span>
                        </h1>

                    </div>
                    <div className="relative flex justify-center">
                        <h2 className="inline-block bg-[#120c07] text-xl sm:text-2xl font-medium text-[#d1cfcf] px-4">
                            {allResources.length} resources available · <span
                            className="text-[#baffc9]"> Always free</span>
                        </h2>
                    </div>
                </section>

                <ResourceList
                    resources={paginatedResources}
                    currentCategory={category}
                    showMoreLink={false}
                    backToHome={true}
                />

                {totalPages > 1 && (<Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        basePath={`/category/${category}`} // 直接使用category，不再需要备选值
                    />)}
            </div>
        </div>);
}