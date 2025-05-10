// app/result/page.js
import { loadResources } from '@/lib/resourceUtils';
import { searchResources, highlightMatches } from '@/lib/resourceUtils';
import ResourceList from '@/components/ResourceList';
import { SearchBar } from '@/components/SearchBar';
import Pagination from '@/components/Pagination';
import Link from "next/link";

export const metadata = {
    title: 'MCP Servers Search Results | Find Model Context Protocol Implementations',
    description: 'Search our comprehensive directory of MCP (Model Context Protocol) servers. Find the perfect implementation for your AI integration needs.',
    keywords: [
        'MCP Servers Search',
        'Find MCP Servers',
        'MCP Protocol Search',
        'MCP Server Discovery',
        'Model Context Protocol Search',
        'AI Integration Search'
    ],
    openGraph: {
        type: 'website',
        url: 'https://allmcp.org/result',
        title: 'MCP Servers Search Results | Find Model Context Protocol Implementations',
        description: 'Search our comprehensive directory of MCP servers for AI integration',
        siteName: 'AllMCP - The Largest MCP Directory',
        images: [{
            url: 'https://allmcp.org/favicon.webp',
            width: 1242,
            height: 1242,
            alt: 'MCP Search Results',
        }],
    },
    alternates: {
        canonical: 'https://allmcp.org/result',
    },
    robots: {
        index: false, // 通常不索引搜索结果页
        follow: true,
    },
};

export default async function SearchResults({ searchParams }) {
    const query = searchParams.q || '';
    const page = Number(searchParams.page) || 1;
    const itemsPerPage = 28;
    const allResources = await loadResources('all');
    const results = searchResources(allResources, query);

    // 分页处理
    const totalPages = Math.ceil(results.length / itemsPerPage);
    const startIdx = (page - 1) * itemsPerPage;
    const paginatedResources = results.slice(startIdx, startIdx + itemsPerPage);

    return (
        <div className="min-h-screen  text-white py-12 px-4 sm:px-6">
            <div className="rounded-xl px-3 sm:px-6 py-3 max-w-[1500px] mx-auto space-y-10">
                <section className="text-center max-w-3xl mx-auto space-y-4">
                    <div className="flex items-center justify-center gap-3">
                        <h1 className="text-4xl sm:text-5xl font-bold">
                            <span className="text-white">Search </span>
                            <span className="bg-gradient-to-r from-[#ffa94d] to-[#ffd97d] bg-clip-text text-transparent">
                                Results
                            </span>
                        </h1>
                    </div>
                    <SearchBar initialQuery={query} />
                    <div className="relative flex justify-center">
                        <h2 className="inline-block text-xl sm:text-2xl font-medium text-[#d1cfcf] px-4">
                            Found {results.length} resources for &quot;{query}&quot;
                        </h2>
                    </div>

                    {/* 新增的搜索提示内容 */}
                    {results.length > 0 && (
                        <div className="text-left text-[#d1cfcf] text-sm bg-[#1e1b16] p-4 rounded-lg mt-4">
                            <p>Showing results for <b>{query}</b> in our MCP servers directory. Try these related searches:</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {['MCP protocol', 'MCP server list', 'MCP vs LangChain', 'MCP documentation'].map(term => (
                                    <Link
                                        key={term}
                                        href={`/result?q=${encodeURIComponent(term)}`}
                                        className="text-[#ffa94d] hover:text-[#ffd97d] text-sm"
                                    >
                                        {term}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </section>

                {results.length > 0 ? (
                    <>
                        <ResourceList
                            resources={paginatedResources.map(r => ({
                                ...r,
                                name: <span dangerouslySetInnerHTML={{ __html: highlightMatches(r.name, query) }} />,
                                description: highlightMatches(r.description, query)
                            }))}
                            currentCategory="search"
                            showMoreLink={false}
                            backToHome={true}
                            showCategory={true}
                            noTextTypeTitle={true}
                        />
                        {totalPages > 1 && (
                            <Pagination
                                currentPage={page}
                                totalPages={totalPages}
                                basePath={`/result?q=${encodeURIComponent(query)}`}
                            />
                        )}
                    </>
                ) : (
                    <div className="text-center py-12">
                        <h3 className="text-2xl font-bold text-[#ffa94d] mb-4">
                            No MCP resources found for &apos;{query}&apos;
                        </h3>
                        <p className="text-[#d1cfcf] mb-2">
                            Try these suggestions:
                        </p>
                        <ul className="text-[#d1cfcf] text-sm mb-6 space-y-1">
                            <li>• Check your spelling or try different keywords</li>
                            <li>• Browse our <Link href="/" className="text-[#ffa94d]">featured MCP servers</Link></li>
                            <li>• Search for broader terms like &apos;MCP protocol&apos; or &apos;MCP server&apos;</li>
                        </ul>
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center rounded-md bg-[#ffa94d] px-4 py-2 text-sm font-medium text-black hover:bg-[#ffd97d]"
                        >
                            ← Back to Home
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}