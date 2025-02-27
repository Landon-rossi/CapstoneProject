import Link from "next/link";

export default function LearnMore() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-black to-yellow-600 text-white p-8">
            <header className="text-center py-12">
                <h1 className="text-5xl font-extrabold text-yellow-400">Welcome to Learn More</h1>
                <p className="mt-4 text-lg max-w-3xl mx-auto opacity-75">
                    This page is your gateway to understanding the science behind solar wind and space weather. Here, you will learn about the fundamental principles of solar activity, its effects on Earth, and how AI plays a role in predicting and mitigating its impact. Additionally, we will introduce our project methodologies and how we use AI to enhance solar wind forecasting.
                </p>
            </header>

            <section className="text-center py-8">
                <h2 className="text-4xl font-bold text-yellow-400">Solar Wind 101</h2>
                <p className="mt-2 text-lg opacity-75">Start your journey by understanding what solar wind is and how it influences our planet.</p>
            </section>

            <main className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 px-4 sm:px-12">
                <Link href="/learn-more/solar-wind-explained" className="group block p-6 bg-yellow-500/10 rounded-xl shadow-lg transform transition duration-300 hover:scale-105 hover:bg-yellow-500/20">
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-yellow-300 group-hover:text-yellow-400">Solar Wind</h3>
                        <p className="mt-2 text-sm opacity-75 group-hover:opacity-100">What is it? Where does it come from?</p>
                    </div>
                </Link>

                <Link href="/learn-more/solar-wind-effects" className="group block p-6 bg-yellow-500/10 rounded-xl shadow-lg transform transition duration-300 hover:scale-105 hover:bg-yellow-500/20">
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-yellow-300 group-hover:text-yellow-400">Earth’s Impact</h3>
                        <p className="mt-2 text-sm opacity-75 group-hover:opacity-100">How does it affect our planet?</p>
                    </div>
                </Link>

                <Link href="/learn-more/ai-space-weather" className="group block p-6 bg-yellow-500/10 rounded-xl shadow-lg transform transition duration-300 hover:scale-105 hover:bg-yellow-500/20">
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-yellow-300 group-hover:text-yellow-400">AI & Space</h3>
                        <p className="mt-2 text-sm opacity-75 group-hover:opacity-100">How AI is predicting space weather.</p>
                    </div>
                </Link>
            </main>

            <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 px-4 sm:px-12 mt-12">
                <div className="p-6 bg-gray-800/50 rounded-xl shadow-lg">
                    <h3 className="text-xl font-semibold text-yellow-400">The Sun’s Magnetic Field</h3>
                    <p className="mt-2 text-sm opacity-75">How the sun’s magnetic forces shape the solar system.</p>
                </div>
                <div className="p-6 bg-gray-800/50 rounded-xl shadow-lg">
                    <h3 className="text-xl font-semibold text-yellow-400">Geomagnetic Storms</h3>
                    <p className="mt-2 text-sm opacity-75">Understanding solar storms and their impact on technology.</p>
                </div>
                <div className="p-6 bg-gray-800/50 rounded-xl shadow-lg">
                    <h3 className="text-xl font-semibold text-yellow-400">Space Weather Predictions</h3>
                    <p className="mt-2 text-sm opacity-75">How scientists predict solar activity and mitigate risks.</p>
                </div>
            </section>

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
