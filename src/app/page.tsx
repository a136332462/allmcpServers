// app/page.tsx
import path from 'path';
import {Metadata} from 'next';
import dynamic from 'next/dynamic';
import Image from "next/image";
import Link from 'next/link';
import {ShieldCheck} from 'lucide-react';
import {getCategoryName, loadResources} from '@/lib/resourceUtils';
import ResourceList from '@/components/ResourceList';
import { SearchBar } from '@/components/SearchBar'

const FAQ = dynamic(() => import('@/components/FAQ'), {
    loading: () => <div className="bg-[#1e1b16] rounded-lg p-6 mt-12 min-h-[500px] animate-pulse"/>, ssr: false,
});

export const metadata: Metadata = {
    title: 'MCP Servers Directory | The Largest Collection of Model Context Protocol Implementations',
    description: 'Discover the world\'s largest directory of MCP (Model Context Protocol) servers. Connect AI models like Claude to databases, APIs and tools with our comprehensive collection of free, open-source MCP implementations. Daily updated resources.',
    keywords: [
        'MCP Servers',
        'Model Context Protocol',
        'MCP Protocol',
        'AI Integration',
        'Claude Integration',
        'MCP Server List',
        'Best MCP Servers',
        'Open Source MCP',
        'MCP vs LangChain',
        'MCP Documentation',
        'MCP Specifications'
    ],
    openGraph: {
        type: 'website',
        url: 'https://allmcp.org',
        title: 'MCP Servers Directory | The Largest Collection of Model Context Protocol Implementations',
        description: 'The most comprehensive directory of MCP servers for AI integration. Connect Claude and other AI models to external data sources and tools.',
        siteName: 'AllMCP - The Largest MCP Directory',
        images: [{
            url: 'https://allmcp.org/favicon.webp',
            width: 1242,
            height: 1242,
            alt: 'MCP Protocol Overview',
        }],
    },
    alternates: {
        canonical: 'https://allmcp.org',
        languages: {en: 'https://allmcp.org'},
    },
    twitter: {
        card: 'summary_large_image',
        title: 'MCP Servers Directory | The Largest Collection of Model Context Protocol Implementations',
        description: 'Discover the world\'s largest collection of MCP servers for AI integration',
        images: ['https://allmcp.org/favicon.webp'],
    },
    icons: {
        icon: '/favicon.ico',
    },
    metadataBase: new URL('https://allmcp.org'),
    robots: {
        index: true,
        follow: true,
        nocache: false,
        googleBot: {
            index: true,
            follow: true,
            noimageindex: false,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};

export default async function Home({searchParams}: { searchParams: { category?: string } }) {
    const currentCategory = searchParams.category || 'featured'
    const allResources = await loadResources(currentCategory)
    const filteredResources = allResources
    const displayedResources = filteredResources.slice(0, 28)

    const faqs = [{
        question: "What is Model Context Protocol (MCP)?",
        answer: "MCP (Model Context Protocol) is an <b>open-source standardized protocol</b> developed by <b>Anthropic</b> to connect large language models (like Claude) with external data sources, tools, and prompt systems. Its core mission is to <b>break down information silos between AI and data</b> through unified interfaces for secure, efficient integration."
    }, {
        question: "What problems does MCP solve?",
        answer: "<ul><li><b>Eliminates fragmented integration</b>: Traditional AI systems require custom interfaces for each data source, while MCP provides a <b>universal protocol</b> to reduce redundant development.</li><li><b>Enhanced security</b>: Servers maintain full control over resources, avoiding exposure of sensitive information like API keys.</li><li><b>Improved scalability</b>: Supports dynamic connection of new data sources or tools without modifying core model code.</li></ul>"
    }, {
        question: "What are MCP's core components?",
        answer: "<b>MCP Server</b>: Hosts actual data, tools, and prompts (e.g., enterprise document databases or API gateways).<br/><b>MCP Client</b>: Integrated into AI applications (like Claude Desktop) to establish secure connections.<br/><b>Protocol Specifications</b>: Defines communication formats, authentication methods, and access control rules (like OAuth 2.0)."
    }, {
        question: "How does an MCP server work?",
        answer: "1. <b>Exposes resources</b>: Servers provide data (files, databases) or tools (APIs) through standardized interfaces.<br/>2. <b>Secure connection</b>: Establishes encrypted one-to-one channels with clients to ensure data confidentiality.<br/>3. <b>Dynamic response</b>: Returns real-time information (database query results) or executes operations (API calls) based on AI requests."
    }, {
        question: "What are typical MCP use cases?",
        answer: "<b>AI-powered development environments</b>: Connect code repositories and documentation for context-aware programming assistance.<br/><b>Enterprise knowledge assistants</b>: Integrate internal wikis and CRM data for precise Q&A.<br/><b>Automated workflows</b>: Execute bookings, approvals, and other operations through API tools."
    }, {
        question: "How does Claude use MCP?",
        answer: "<b>Current capability</b>: Supports connection to <b>local MCP servers</b> (e.g., personal document libraries).<br/><b>Future plans</b>: Will expand to <b>enterprise remote servers</b> for cross-team collaboration."
    }, {
        question: "How does MCP ensure data security?",
        answer: "<ul><li><b>Resource isolation</b>: Servers fully control data access permissions—AI models cannot bypass restrictions.</li><li><b>Zero key sharing</b>: No need to share API keys with LLM providers like Anthropic.</li><li><b>Audit logs</b>: All access activities are traceable for compliance requirements.</li></ul>"
    }, {
        question: "What advantages does MCP offer over traditional integration methods?",
        answer: "<div class='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4'><div class='bg-[#333129] p-4 rounded-lg'><h3 class='font-bold text-[#ffa94d]'>Development Cost</h3><p>Traditional methods require custom development per data source</p><p class='text-[#baffc9]'>MCP: Connect once, reuse everywhere</p></div><div class='bg-[#273e2a] p-4 rounded-lg'><h3 class='font-bold text-[#baffc9]'>Maintenance</h3><p>Traditional version upgrades need individual adaptation</p><p class='text-[#ffa94d]'>MCP protocol ensures smooth transitions</p></div><div class='bg-[#312a39] p-4 rounded-lg'><h3 class='font-bold text-[#e0b0ff]'>Security</h3><p>Traditional methods have scattered key management</p><p class='text-[#ffd97d]'>MCP provides centralized control</p></div></div>"
    }, {
        question: "What ecosystem support does MCP have?",
        answer: "<b>Open protocol</b>: Community contributions encouraged (e.g., MySQL/Slack connectors).<br/><b>Enterprise support</b>: Anthropic plans managed MCP server services."
    }, {
        question: "How does MCP differ from tools like LangChain?",
        answer: "<b>MCP</b>: Focuses on <b>protocol standardization</b>, led by Anthropic with deep Claude integration.<br/><b>LangChain</b>: Emphasizes <b>multi-model chaining</b> with high flexibility but requires manual compatibility handling."
    }]

    return (
        <div className="min-h-screen text-white py-12 px-4 sm:px-6">
            <div className="rounded-xl px-3 sm:px-6 py-3 max-w-[1500px] mx-auto space-y-10">
                <section className="text-center max-w-3xl mx-auto space-y-4">
                    <div className="flex items-center justify-center gap-3">
                        <Image
                            alt="AllMCP Logo"
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-full border border-[#ffa94d]"
                            src="/favicon.webp"
                            priority
                        />
                        <h1 className="text-4xl sm:text-5xl font-bold">
                            <span className="text-white">All </span>
                            <span
                                className="bg-gradient-to-r from-[#ffa94d] to-[#ffd97d] bg-clip-text text-transparent">MCP Servers</span>
                        </h1>
                    </div>
                    <div className="relative flex justify-center">
                        <h2 className="inline-block text-xl sm:text-2xl font-medium text-[#d1cfcf] px-4">
                            The world&apos;s largest MCP Servers resource library · <span className="text-[#baffc9]"> Always free</span>
                        </h2>
                    </div>
                    <p className="text-sm text-[#ffa94d]">* The first and most comprehensive MCP Servers resource aggregation platform worldwide *</p>

                    {/* 新增的描述性内容 */}
                    <div className="text-left text-[#d1cfcf] text-sm bg-[#1e1b16] p-4 rounded-lg">
                        <p className="mb-2">Welcome to the largest directory of <b>Model Context Protocol (MCP)</b> servers on the internet. Our platform provides:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Daily-updated collection of all available MCP servers</li>
                            <li>Comprehensive documentation on MCP protocol specifications</li>
                            <li>Implementation guides for connecting AI models to external data sources</li>
                            <li>Comparison between MCP and other integration methods like LangChain</li>
                            <li>Free, open-source resources for developers and enterprises</li>
                        </ul>
                    </div>

                    <div className="flex flex-wrap justify-center gap-3">
                        {[{text: "Most comprehensive", icon: "▲", bg: "#333129", color: "#ffa94d"}, {
                            text: "100% free",
                            icon: "◇",
                            bg: "#273e2a",
                            color: "#baffc9"
                        }, {
                            text: "No login required",
                            icon: "◆",
                            bg: "#312a39",
                            color: "#e0b0ff"
                        }, {text: "Daily updates", icon: "⏳", bg: "#413116", color: "#ffd97d"}].map((item, index) => (
                            <span
                                key={index}
                                className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold hover:scale-105 transition-transform"
                                style={{backgroundColor: item.bg, color: item.color}}
                            >
                                <span>{item.icon}</span>
                                {item.text}
                            </span>))}
                    </div>
                    <div className="flex justify-center gap-6 text-sm text-[#ffa94d]">
                        <div className="text-center">
                            <div className="text-2xl font-bold">8,000+</div>
                            <div className="text-[#d1cfcf]">MCP Servers</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold">20+</div>
                            <div className="text-[#d1cfcf]">Domains</div>
                        </div>
                    </div>
                </section>

                <section className="w-full mb-8">
                    <SearchBar />
                </section>

                <div className="flex flex-wrap justify-center gap-3 bg-[#1e1b16] p-3 rounded-lg">
                    {['featured', 'latest', 'official', 'search', 'web-scraping', 'communication', 'productivity', 'development', 'database', 'cloud-service', 'file-system', 'cloud-storage', 'version-control', 'ai-ml', 'blockchain', 'multimedia', 'data-analysis', 'monitoring', 'integration', 'other'].map(category => (
                        <Link
                            key={category}
                            className={`inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium px-4 py-2 transition-colors ${currentCategory === category ? 'bg-[#ffa94d] text-black' : 'bg-[#2e2a23] text-white hover:bg-[#3c352e]'}`}
                            href={`/?category=${category}`}
                            prefetch={false}
                            title={`${getCategoryName(category)} MCP protocol resources`}
                        >
                            {getCategoryName(category)}
                        </Link>))}
                </div>

                <ResourceList
                    resources={displayedResources}
                    currentCategory={currentCategory}
                    totalCount={filteredResources.length}
                    showMoreLink={filteredResources.length > 28}
                />

                <div id="faq-section" className="mt-12 p-6 rounded-lg">
                    <h2 className="text-2xl font-bold text-[#ffa94d] mb-6 text-center">MCP FAQs</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {faqs.map((faq, index) => (
                            <div key={index} className="space-y-2 p-4 bg-[#2e2a23] rounded-lg">
                                <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
                                <div
                                    className="text-[#d1cfcf]"
                                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>);
}