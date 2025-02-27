import Link from "next/link";

export default function SolarWindEffectsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-black to-yellow-600 text-white p-8">
            <header className="text-center py-12">
                <h1 className="text-5xl font-extrabold text-yellow-400">Effects of Solar Wind</h1>
                <p className="mt-4 text-lg max-w-3xl mx-auto opacity-75">
                    Discover how solar wind influences space weather, Earth's magnetosphere, and our technology.
                </p>
            </header>

            <section className="max-w-4xl mx-auto text-lg leading-relaxed p-6 bg-black/60 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-yellow-400">Solar Activity & The Solar Cycle</h2>
                <p className="mt-4 opacity-75">
                    The Sun is a dynamic sphere of gas undergoing continuous activity in cycles. Scientists refer to
                    this as the "solar cycle," which impacts the solar wind’s intensity and the interplanetary magnetic
                    field (IMF).
                </p>
                <div className="flex justify-center mt-6">
                    <a href="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.skyatnightmagazine.com%2Fspace-science%2Funderstanding-sun-science-solar-cycle&psig=AOvVaw0fGz_b4JubAsUyS3aIufLo&ust=1740770183577000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCNCT0LXI5IsDFQAAAAAdAAAAABAE"
                       target="_blank" rel="noopener noreferrer">
                        <img
                            src="https://c02.purpledshub.com/uploads/sites/48/2020/02/Screenshot-2020-02-25-at-08.39.36-7d4423e.png"
                            alt="Solar Cycle"
                            className="rounded-lg shadow-md hover:shadow-yellow-500/50 transition-transform transform hover:scale-105"
                        />
                    </a>
                </div>
            </section>

            <section className="max-w-4xl mx-auto text-lg leading-relaxed p-6 bg-black/60 rounded-lg shadow-lg mt-8">
                <h2 className="text-3xl font-bold text-yellow-400">Geomagnetic Storms & Auroras</h2>
                <p className="mt-4 opacity-75">
                    When solar wind particles interact with Earth's magnetosphere, they can create stunning auroras or
                    cause geomagnetic storms. These storms can disrupt power grids, satellites, and communication
                    systems.
                </p>
                <div className="flex justify-center mt-6">
                    <a href="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.autumnschrock.com%2Fblog%2Faurora-photography-guide&psig=AOvVaw0WZB-ujXqBI5QrjZZbAszO&ust=1740770276594000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCKCtluPI5IsDFQAAAAAdAAAAABAE"
                       target="_blank" rel="noopener noreferrer">
                        <img
                            src="https://images.squarespace-cdn.com/content/v1/58eab551db29d654dc57277a/1579387823204-L58YC0NL20C82S3WR7PN/autumnschrock_aurora4.jpg"
                            alt="Aurora Image"
                            className="rounded-lg shadow-md hover:shadow-yellow-500/50 transition-transform transform hover:scale-105"
                        />
                    </a>
                </div>
            </section>

            <section className="max-w-4xl mx-auto text-lg leading-relaxed p-6 bg-black/60 rounded-lg shadow-lg mt-8">
                <h2 className="text-3xl font-bold text-yellow-400">Predicting Space Weather</h2>
                <p className="mt-4 opacity-75">
                    Space weather forecasting is crucial for mitigating the adverse effects of solar activity. Organizations like NASA, NOAA, and the Department of Defense work to improve prediction models.
                </p>
                <div className="flex justify-center mt-6">
                    <a href="https://www.google.com/url?sa=i&url=https%3A%2F%2Ftestbed.swpc.noaa.gov%2Fproducts%2Fsolar-cycle-progression-updated-prediction-experimental&psig=AOvVaw13CCcsXlHNOV5vIQkj9ueo&ust=1740770393770000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCNCd7pnJ5IsDFQAAAAAdAAAAABAE"
                       target="_blank" rel="noopener noreferrer">
                        <img
                            src="https://testbed.swpc.noaa.gov/sites/default/files/styles/max_2600x2600/public/2025-02/cycle_update.png?itok=H7nP4Vun"
                            alt="Space Weather Prediction Chart"
                            className="rounded-lg shadow-md hover:shadow-yellow-500/50 transition-transform transform hover:scale-105"
                        />
                    </a>
                </div>
            </section>

            <section className="max-w-4xl mx-auto text-lg leading-relaxed p-6 bg-black/60 rounded-lg shadow-lg mt-8">
                <h2 className="text-3xl font-bold text-yellow-400">The Future of Space Weather Forecasting</h2>
                <p className="mt-4 opacity-75">
                    Scientists are working on advanced models for space weather forecasting, ensuring better protection
                    for satellites, astronauts, and critical infrastructure. Programs like NASA’s Living With a Star
                    (LWS)
                    and the Community Coordinated Modeling Center (CCMC) bridge the gap between research and real-time
                    operations.
                </p>

                <div
                    className="flex flex-col sm:flex-row justify-center items-center mt-6 space-y-4 sm:space-y-0 sm:space-x-8">
                    <a href="https://science.nasa.gov/heliophysics/programs/living-with-a-star/" target="_blank"
                       rel="noopener noreferrer">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/1/12/Living_with_a_star_LWS_Logo.png"
                            alt="Living With a Star (LWS) Logo"
                            className="w-32 sm:w-40 rounded-lg shadow-md hover:shadow-yellow-500/50 transition-transform transform hover:scale-105"
                        />
                    </a>

                    <a href="https://ccmc.gsfc.nasa.gov/" target="_blank" rel="noopener noreferrer">
                        <img
                            src="https://avatars.githubusercontent.com/u/13787977?s=200&v=4"
                            alt="Community Coordinated Modeling Center (CCMC) Logo"
                            className="w-32 sm:w-40 rounded-lg shadow-md hover:shadow-yellow-500/50 transition-transform transform hover:scale-105"
                        />
                    </a>
                </div>

                <p className="text-sm opacity-75 text-center mt-4">
                    Click the logos to learn more about their space weather forecasting efforts.
                </p>
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
