import Link from "next/link";

export default function LearnMore() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-black to-yellow-600 text-white p-8">
            <header className="text-center py-16">
                <h1 className="text-4xl sm:text-5xl font-bold text-yellow-400">
                    Learn More About Solar Wind AI
                </h1>
                <p className="mt-4 text-lg sm:text-xl max-w-3xl mx-auto">
                    Discover how our AI technology is advancing space weather research, enabling precision in solar wind classification, and transforming space exploration.
                </p>
            </header>

            <main className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 px-4 sm:px-12">
                <div className="p-6 bg-white/10 rounded-lg shadow-lg hover:shadow-yellow-500/30 transition">
                    <h3 className="text-xl font-semibold text-yellow-400 mb-4">Why Solar Winds Matter</h3>
                    <p>
                        Solar winds impact satellites, power grids, and communication systems. Learn how we analyze these powerful forces from the sun.
                    </p>
                </div>

                <div className="p-6 bg-white/10 rounded-lg shadow-lg hover:shadow-yellow-500/30 transition">
                    <h3 className="text-xl font-semibold text-yellow-400 mb-4">AI in Space Weather</h3>
                    <p>
                        Artificial intelligence revolutionizes space weather predictions by analyzing complex datasets with unmatched speed and accuracy.
                    </p>
                </div>

                <div className="p-6 bg-white/10 rounded-lg shadow-lg hover:shadow-yellow-500/30 transition">
                    <h3 className="text-xl font-semibold text-yellow-400 mb-4">Our Mission</h3>
                    <p>
                        Collaborate with scientists, engineers, and organizations to advance solar wind research and promote sustainable space exploration.
                    </p>
                </div>
            </main>

            <footer className="text-center mt-16">
                <Link
                    href="/"
                    className="rounded-full px-6 py-3 bg-yellow-500 text-black font-bold hover:bg-yellow-400 transition"
                >
                    Back to Home
                </Link>
            </footer>
        </div>
    );
}
