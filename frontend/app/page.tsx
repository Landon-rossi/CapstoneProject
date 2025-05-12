import Link from "next/link";

export default function Home() {
  return (
      <div className="min-h-screen bg-gradient-to-b from-black via-indigo-900 to-yellow-600 text-white font-sans">
        {/* Hero Section */}
        <header className="flex flex-col items-center justify-center text-center py-16 gap-8">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
            AI-Powered <span className="text-yellow-400">Solar Wind Classification</span>
          </h1>
          <p className="text-lg sm:text-xl max-w-2xl">
            Leveraging artificial intelligence to predict and classify solar wind events with precision. Empowering space weather research and future technologies.
          </p>
          <div className="flex gap-4">
            <Link
                href="/learn-more"
                className="rounded-full px-6 py-3 bg-yellow-500 text-black text-sm sm:text-base shadow-lg hover:shadow-yellow-500/50 hover:bg-yellow-400 transition"
            >
              Learn More
            </Link>
            <a
                href="/try-model"
                className="rounded-full px-6 py-3 border border-yellow-400 text-yellow-400 text-sm sm:text-base hover:bg-yellow-400 hover:text-black transition"
            >
              Try the Model
            </a>
          </div>
        </header>

        {/* Information Section */}
        <main className="px-8 py-16 sm:px-20 sm:py-24 bg-black/70">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            How Our AI Model Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="p-6 bg-white/10 rounded-lg shadow-lg hover:shadow-yellow-500/30 transition">
              <h3 className="text-xl font-semibold text-yellow-400 mb-4">Data Collection</h3>
              <p>
                We analyze vast datasets from satellites and observatories, transforming raw solar wind data into meaningful insights.
              </p>
            </div>
            <div className="p-6 bg-white/10 rounded-lg shadow-lg hover:shadow-yellow-500/30 transition">
              <h3 className="text-xl font-semibold text-yellow-400 mb-4">AI-Powered Predictions</h3>
              <p>
                Using machine learning, we classify solar winds by speed, density, and magnetic properties to predict potential impacts.
              </p>
            </div>
            <div className="p-6 bg-white/10 rounded-lg shadow-lg hover:shadow-yellow-500/30 transition">
              <h3 className="text-xl font-semibold text-yellow-400 mb-4">Space Weather Applications</h3>
              <p>
                Our model supports research, satellite operations, and understanding the effects of space weather on Earth.
              </p>
            </div>
          </div>
        </main>

        {/* Call to Action */}
        <section id="get-started" className="text-center py-16 px-8 bg-yellow-500 text-black">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Collaborate with Us</h2>
          <p className="text-lg mb-8">
            Join our mission to advance space weather research and AI technology. Share your expertise, datasets, or ideas to improve our model.
          </p>
          <a
              href="/contact"
              className="inline-block rounded-full px-8 py-4 bg-black text-yellow-500 font-semibold text-sm sm:text-base hover:bg-yellow-400 hover:text-black transition"
          >
            Contact Us
          </a>
        </section>

        {/* Footer */}
        <footer className="bg-black py-8 text-center text-sm">
          <p>&copy; 2025 Solar Wind AI. All rights reserved.</p>
        </footer>
      </div>
  );
}
