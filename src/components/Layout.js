import { Navigation } from './Navigation'
import { Footer } from '@/components/Footer'
import Head from 'next/head'

export function Layout({ children }) {
    return (
        <div className="min-h-screen bg-background font-sans antialiased flex flex-col">
            <Head>
                <meta name="theme-color" content="#120c07" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
            </Head>

            <Navigation />

            <main className="flex-1">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                </div>
            </main>

            <Footer />
        </div>
    )
}