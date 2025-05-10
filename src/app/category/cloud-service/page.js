// app/category/[category]/page.js
import {notFound} from 'next/navigation'
import Link from 'next/link'
import {loadResources, getCategoryName} from '../../../lib/resourceUtils'
import ResourceList from '../../../components/ResourceList'
import Pagination from '../../../components/Pagination'

export const metadata = {
    title: 'Cloud Service MCP Servers - Comprehensive Cloud API Integrations',
    description: 'Explore the best MCP servers for cloud services including AWS, Azure, Kubernetes, Cloudflare, Stripe, Grafana and more. Connect AI models to powerful cloud capabilities across infrastructure, payments, monitoring and analytics.',
    keywords: [
        'Cloud MCP',
        'AWS MCP',
        'Azure MCP',
        'Kubernetes MCP',
        'Cloudflare MCP',
        'Stripe MCP',
        'Grafana MCP',
        'DevOps MCP',
        'Infrastructure MCP',
        'Payment MCP'
    ],
    openGraph: {
        type: 'website',
        url: 'https://allmcp.org/category/cloud-service',
        title: 'Cloud Service MCP Servers - Comprehensive Cloud API Integrations',
        description: 'Collection of MCP servers for cloud services including AWS, Azure, Kubernetes and more',
        siteName: 'AllMCP',
        images: [{
            url: 'https://allmcp.org/favicon.webp',
            width: 1242,
            height: 1242,
            alt: 'Cloud Service MCP Servers Overview',
        }],
    },
    alternates: {
        canonical: 'https://allmcp.org/category/cloud-service',
        languages: {en: 'https://allmcp.org/category/cloud-service'},
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Cloud Service MCP Servers - Comprehensive Cloud API Integrations',
        description: 'Connect AI models to powerful cloud capabilities with these MCP servers',
        images: ['https://allmcp.org/favicon.webp'],
    },
    icons: {
        icon: '/favicon.ico',
    },
};

export default async function CategoryPage({searchParams}) {
    const category = 'cloud-service';
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