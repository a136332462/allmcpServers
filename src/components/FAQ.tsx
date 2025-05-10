'use client'

import {useState, lazy, Suspense} from 'react'
const JsonLd = lazy(() => import("@/components/JsonLd"));

export default function FAQ({faqs}: { faqs: Array<{ question: string; answer: string }> }) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null)

    const halfLength = Math.ceil(faqs.length / 2)
    const firstColumn = faqs.slice(0, halfLength)
    const secondColumn = faqs.slice(halfLength)

    const toggleFAQ = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index)
    }

    const faqStructuredData = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer.replace(/<[^>]+>/g, ''),
                "keywords": extractKeywordsFromQuestion(faq.question) // 自定义函数提取关键词
            }
        }))
    };

    // 添加辅助函数
    function extractKeywordsFromQuestion(question: string): string {
        const keywords = ['MCP', 'Model Context Protocol', 'Anthropic Claude'];
        const found = keywords.filter(kw => question.includes(kw));
        return found.length > 0 ? found.join(', ') : 'MCP Protocol';
    }

    return (
        <section className="bg-[#1e1b16] rounded-lg p-6 mt-12">
            <Suspense fallback={null}>
                <JsonLd data={faqStructuredData} />
            </Suspense>

            <h2 className="text-2xl font-bold mb-6 text-center text-[#ffa94d]">
                MCP FAQs
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Column */}
                <div className="space-y-4">
                    {firstColumn.map((faq, index) => (
                        <div key={index} className="transition-all duration-200">
                            <div
                                className="flex items-start justify-between cursor-pointer p-4 rounded-lg bg-[#2e2a23] hover:bg-[#3c352e] transition-colors"
                                onClick={() => toggleFAQ(index)}
                            >
                                <h3 className="font-medium text-lg">{faq.question}</h3>
                                <svg
                                    className={`w-5 h-5 text-[#ffa94d] transition-transform duration-200 ${activeIndex === index ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                                </svg>
                            </div>
                            <div
                                className={`px-4 text-[#d1cfcf] bg-[#25221d] rounded-b-lg overflow-hidden transition-all duration-200 ${activeIndex === index ? 'py-3 max-h-[500px]' : 'max-h-0 py-0'}`}
                            >
                                <div dangerouslySetInnerHTML={{__html: faq.answer}}/>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Second Column */}
                <div className="space-y-4">
                    {secondColumn.map((faq, index) => {
                        const adjustedIndex = index + halfLength
                        return (
                            <div key={adjustedIndex} className="transition-all duration-200">
                                <div
                                    className="flex items-start justify-between cursor-pointer p-4 rounded-lg bg-[#2e2a23] hover:bg-[#3c352e] transition-colors"
                                    onClick={() => toggleFAQ(adjustedIndex)}
                                >
                                    <h3 className="font-medium text-lg">{faq.question}</h3>
                                    <svg
                                        className={`w-5 h-5 text-[#ffa94d] transition-transform duration-200 ${activeIndex === adjustedIndex ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                                    </svg>
                                </div>
                                <div
                                    className={`px-4 text-[#d1cfcf] bg-[#25221d] rounded-b-lg overflow-hidden transition-all duration-200 ${activeIndex === adjustedIndex ? 'py-3 max-h-[500px]' : 'max-h-0 py-0'}`}
                                >
                                    <div dangerouslySetInnerHTML={{__html: faq.answer}}/>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}