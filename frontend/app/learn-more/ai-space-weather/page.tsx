import Link from "next/link";

export default function AISpaceWeatherPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-black to-yellow-600 text-white p-8">
            <header className="text-center py-12">
                <h1 className="text-5xl font-extrabold text-yellow-400">AI & Space Weather</h1>
                <p className="mt-4 text-lg max-w-3xl mx-auto opacity-75">
                    Artificial Intelligence (AI) is transforming how we predict and understand space weather. By analyzing vast amounts of data quickly, AI helps scientists forecast solar storms and their effects on Earth, protecting satellites, power grids, and communication networks.
                </p>
            </header>

            <section className="max-w-4xl mx-auto text-lg leading-relaxed p-6 bg-black/60 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-yellow-400">How AI Predicts Solar Magnetic Fields</h2>
                <p className="mt-4 opacity-75">
                    The Sun’s magnetic field constantly changes, affecting the solar wind that travels through space. AI scans patterns in solar wind data to predict disturbances in Earth’s magnetic field before they happen, giving scientists valuable time to prepare.
                </p>
                {/*/!* Placeholder for AI Solar Prediction Visualization *!/*/}
                {/*<p className="text-center mt-6 opacity-75">[AI Solar Prediction Visualization Placeholder]</p>*/}
            </section>

            <section className="max-w-4xl mx-auto text-lg leading-relaxed p-6 bg-black/60 rounded-lg shadow-lg mt-8">
                <h2 className="text-3xl font-bold text-yellow-400">Enhancing Space Weather Forecasting</h2>
                <p className="mt-4 opacity-75">
                    Space weather models take in massive amounts of solar data. AI acts like a super-smart weather forecaster, detecting patterns and warning us about storms before they reach Earth. Organizations like NASA and NOAA use AI-powered models to improve these forecasts.
                </p>
                {/* Placeholder for AI Forecasting Model */}
                {/*<p className="text-center mt-6 opacity-75">[AI Forecasting Model Placeholder]</p>*/}
            </section>

            <section className="max-w-4xl mx-auto text-lg leading-relaxed p-6 bg-black/60 rounded-lg shadow-lg mt-8">
                <h2 className="text-3xl font-bold text-yellow-400">AI & Solar Filament Analysis</h2>
                <p className="mt-4 opacity-75">
                    Solar filaments are giant arcs of plasma that can erupt into powerful solar storms. AI helps scientists track and analyze these structures in real-time, improving our ability to predict when a storm might happen.
                </p>
                {/* Placeholder for AI Analyzing Solar Filaments */}
                {/*<p className="text-center mt-6 opacity-75">[AI Analyzing Solar Filaments Placeholder]</p>*/}
            </section>

            <section className="max-w-4xl mx-auto text-lg leading-relaxed p-6 bg-black/60 rounded-lg shadow-lg mt-8">
                <h2 className="text-3xl font-bold text-yellow-400">The Future of AI in Space Weather</h2>
                <p className="mt-4 opacity-75">
                    Scientists are developing AI models like TriQXNet, a hybrid neural network, to improve space weather predictions. These models learn from past solar activity, helping us better prepare for future solar storms.
                </p>
                {/* Placeholder for AI Future Prediction Models */}
                {/*<p className="text-center mt-6 opacity-75">[AI Future Prediction Models Placeholder]</p>*/}
            </section>

            <footer className="text-center mt-16">
                <Link
                    href="/learn-more"
                    className="rounded-full px-6 py-3 bg-yellow-500 text-black font-bold hover:bg-yellow-400 transition"
                >
                    Back to Learn More
                </Link>
            </footer>
        </div>
    );
}
