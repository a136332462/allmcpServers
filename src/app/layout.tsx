import './globals.css'
import { Inter } from 'next/font/google'
import { Metadata } from 'next'
import { GoogleAnalytics } from '@next/third-parties/google';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
    weight: ['400', '500', '600', '700'],
    fallback: ['system-ui', 'arial']
})

export const metadata: Metadata = {
    title: {
        default: 'All MCP Servers | Model Context Protocol Resources',
        template: '%s | All MCP Servers'
    },
    description: 'The most comprehensive open-source documentation for Model Context Protocol (MCP). Connect Anthropic Claude to databases, APIs with free MCP server implementations.',
    metadataBase: new URL('https://allmcp.org'),
    alternates: {
        canonical: '/',
        languages: {
            'en': '/',
        },
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon.ico',
        apple: '/apple-touch-icon.png',
    },
    openGraph: {
        type: 'website',
        siteName: 'AllMCP',
        images: [{
            url: '/og-image.jpg',
            width: 1200,
            height: 630,
        }],
    },
    twitter: {
        card: 'summary_large_image',
        creator: '@allmcp',
    }
}

interface RootLayoutProps {
    children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en" className={inter.variable}>
        <body className="min-h-screen bg-background text-foreground antialiased">
        <div className="flex flex-col min-h-screen">
            <Navigation />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
        <GoogleAnalytics gaId="G-95QWBGBZLB" />
        </body>
        </html>
    );
}