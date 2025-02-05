import './globals.css';
import { ReactNode } from 'react';
import Link from "next/link";

export const metadata = {
    title: 'Solar Wind AI',
    description: 'AI-powered solar wind classification for space weather research.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
        <body>
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="bg-black text-white py-4 px-8 flex justify-between items-center">
                <h1 className="text-xl font-bold">
                    <Link href="/" className="hover:text-yellow-400">
                        Solar Wind <span className="text-yellow-400">AI</span>
                    </Link>
                </h1>
                <nav className="flex gap-4">
                    <a href="/learn-more" className="hover:text-yellow-400">Learn More</a>
                    <a href="/model" className="hover:text-yellow-400">Get Started</a>
                    <a href="#contact" className="hover:text-yellow-400">Contact</a>
                    <a href="/minigame" className="hover:text-yellow-400">Minigame</a>
                </nav>
            </header>

            {/* Main Content */}
            <main className="flex-grow">{children}</main>

            {/* Footer */}
            <footer className="bg-black py-6 text-center text-sm text-white">
                <p>
                    &copy; 2025 Solar Wind AI. Powered by AI and Next.js.
                </p>
            </footer>
        </div>
        </body>
        </html>
    );
}
