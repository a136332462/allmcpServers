'use client';

import Link from "next/link";
import Image from "next/image"; // 替换 img 标签
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/Footer";

type TagItem = {
    text: string;
    icon: string;
    bg: string;
    color: string;
};

export default function NotFound() {
    const router = useRouter();

    // 5秒后自动跳转首页
    useEffect(() => {
        const timer = setTimeout(() => {
            router.push("/");
        }, 5000);
        return () => clearTimeout(timer);
    }, [router]);

    const tagItems: TagItem[] = [
        { text: "Most comprehensive", icon: "▲", bg: "#333129", color: "#ffa94d" },
        { text: "100% free", icon: "◇", bg: "#273e2a", color: "#baffc9" },
        { text: "No login required", icon: "◆", bg: "#312a39", color: "#e0b0ff" },
        { text: "Daily updates", icon: "⏳", bg: "#413116", color: "#ffd97d" }
    ];

    return (
        <div className="flex flex-col min-h-screen  text-white">
            <main className="flex-grow pt-12 pb-4 px-4 sm:px-6">
                <div className="max-w-3xl mx-auto text-center space-y-8">
                    {/* 品牌标识部分 */}
                    <div className="space-y-4 mb-10">
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
                                <span className="bg-gradient-to-r from-[#ffa94d] to-[#ffd97d] bg-clip-text text-transparent">
                  MCP Servers
                </span>
                            </h1>
                        </div>
                        <div className="relative flex justify-center">
                            <h2 className="inline-block  text-xl sm:text-2xl font-medium text-[#d1cfcf] px-4">
                                The world&apos;s largest MCP Servers resource library · {/* 转义单引号 */}
                                <span className="text-[#baffc9]">Always free</span>
                            </h2>
                        </div>
                        <p className="text-sm text-[#ffa94d]">* The first MCP Servers resource aggregation platform worldwide *</p>
                    </div>

                    {/* 标签部分 */}
                    <div className="flex flex-wrap justify-center gap-3 mb-12">
                        {tagItems.map((item, index) => (
                            <span
                                key={index}
                                className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold hover:scale-105 transition-transform"
                                style={{ backgroundColor: item.bg, color: item.color }}
                            >
                <span>{item.icon}</span>
                                {item.text}
              </span>
                        ))}
                    </div>

                    {/* 404内容部分 */}
                    <div className="bg-[#1e1b16] rounded-xl p-10 border border-[#2e2a23] space-y-8">
                        <div className="space-y-6">
                            <div className="text-[#ffa94d] text-9xl font-bold">404</div>
                            <h2 className="text-3xl font-bold">Lost in Protocol Space</h2>
                            <p className="text-[#d1cfcf]">
                                The MCP resource you&apos;re looking for has either been deprecated or doesn&apos;t exist in our
                                protocol documentation. {/* 转义单引号 */}
                            </p>
                            <p className="text-[#ffd97d] text-sm">
                                Auto-redirecting to homepage in 5 seconds...
                            </p>
                        </div>

                        {/* 操作按钮 */}
                        <div className="flex flex-wrap justify-center gap-4 mt-8">
                            <Link
                                href="/"
                                className="inline-flex items-center justify-center rounded-full bg-[#ffa94d] hover:bg-[#ffc078] text-black font-medium px-6 py-3 transition-colors"
                            >
                                Back to Home
                            </Link>
                        </div>

                        {/* 装饰元素 */}
                        <div className="mt-16 space-y-4">
                            <div className="flex justify-center">
                                {[1, 2, 3].map((i) => (
                                    <div
                                        key={i}
                                        className="w-2 h-2 mx-1 rounded-full bg-[#ffa94d] opacity-0 animate-pulse"
                                        style={{ animationDelay: `${i * 0.3}s` }}
                                    />
                                ))}
                            </div>
                            <p className="text-sm text-[#ffa94d]">_This page follows MCP protocol standards_</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}