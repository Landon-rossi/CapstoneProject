import Link from "next/link";

export default function SolarWindExplainedPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-black to-yellow-600 text-white p-8">
            <header className="text-center py-12">
                <h1 className="text-5xl font-extrabold text-yellow-400">Solar Wind Explained</h1>
                <p className="mt-4 text-lg max-w-3xl mx-auto opacity-75">
                    Learn about the origins, characteristics, and impact of solar wind on our solar system.
                </p>
            </header>

            <section className="max-w-4xl mx-auto text-lg leading-relaxed p-6 bg-black/60 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-yellow-400">The Sun's Corona</h2>
                <p className="mt-4 opacity-75">
                    The solar wind originates from the Sun's outermost atmosphere, the corona. Plasma in the corona is
                    heated to such high temperatures that it escapes the Sun's gravity and moves outward along magnetic
                    field lines.
                </p>
                <div className="text-center mt-6">
                    <a href="https://www.businessinsider.com/coronal-holes-definition-causes-sun-earth-cme-storm-winds-2023-3" target="_blank" rel="noopener noreferrer">
                        <img
                            src="https://i.insider.com/64258f70ed593e00183f3ad8"
                            alt="Coronal Holes on the Sun"
                            className="rounded-lg shadow-md hover:shadow-yellow-500/50 transition-transform transform hover:scale-105"
                        />
                    </a>
                </div>

            </section>

            <section
                className="max-w-4xl mx-auto text-lg leading-relaxed p-6 bg-black/60 rounded-lg shadow-lg mt-8 flex flex-col sm:flex-row items-center">
                <div className="sm:w-2/3">
                    <h2 className="text-3xl font-bold text-yellow-400">Magnetic Fields & Solar Wind</h2>
                    <p className="mt-4 opacity-75">
                        As the Sun rotates, it twists and extends its magnetic field into a vast spiral structure,
                        shaping
                        the interplanetary magnetic field (IMF). Coronal holes, areas of open magnetic field, allow the
                        solar wind to flow outward at higher speeds.
                    </p>
                </div>
                <div className="sm:w-1/3 flex justify-center sm:ml-6 mt-6 sm:mt-0">
                    <a href="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pinterest.com%2Fpin%2Fa-loop-of-plasma-on-the-surface-of-the-sun-gif-on-imgur--551339179377139036%2F&psig=AOvVaw3d7uJ81ogh2NvDRb22ijm_&ust=1740769292812000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCOiSvYzF5IsDFQAAAAAdAAAAABAJ"
                       target="_blank" rel="noopener noreferrer">
                        <img
                            src="https://i.pinimg.com/originals/73/52/22/7352224b090ee65afc2e0e0cb8c67572.gif"
                            alt="interplanetary magnetic field"
                            className="rounded-lg shadow-md hover:shadow-yellow-500/50 transition-transform transform hover:scale-105 w-full sm:max-w-xs"
                        />
                    </a>
                </div>
            </section>

            <section className="max-w-4xl mx-auto text-lg leading-relaxed p-6 bg-black/60 rounded-lg shadow-lg mt-8">
                <h2 className="text-3xl font-bold text-yellow-400">The Heliosphere</h2>
                <p className="mt-4 opacity-75">
                    The solar wind creates a vast "bubble" around the Sun called the heliosphere, which protects the
                    solar system from interstellar radiation. This region extends far beyond Pluto’s orbit and
                    influences space weather.
                </p>
                <div className="text-center mt-6">
                    <a href="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.esa.int%2FESA_Multimedia%2FImages%2F2008%2F06%2FInterstellar_wind_hits_the_heliosphere&psig=AOvVaw1jNnd0J_aD5ittE_bCAhxe&ust=1740769519530000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCKiE4PjF5IsDFQAAAAAdAAAAABAJ" target="_blank" rel="noopener noreferrer">
                        <img
                            src="https://www.esa.int/var/esa/storage/images/esa_multimedia/images/2008/06/interstellar_wind_hits_the_heliosphere/10304350-2-eng-GB/Interstellar_wind_hits_the_heliosphere_pillars.jpg"
                            alt="Sun heliosphere"
                            className="rounded-lg shadow-md hover:shadow-yellow-500/50 transition-transform transform hover:scale-105"
                        />
                    </a>
                </div>
            </section>

            <section className="max-w-4xl mx-auto text-lg leading-relaxed p-6 bg-black/60 rounded-lg shadow-lg mt-8">
                <h2 className="text-3xl font-bold text-yellow-400">Earth’s Magnetosphere</h2>
                <p className="mt-4 opacity-75">
                    When the solar wind reaches Earth, it interacts with our planet’s magnetosphere, deflecting most
                    particles while causing auroras and occasionally disrupting communications and satellites.
                </p>
                <div className="flex justify-center mt-6">
                    <a href="https://www.google.com/url?sa=i&url=https%3A%2F%2Fmakeagif.com%2Fgif%2Fsun-and-earths-magnetosphere-Th3yY4&psig=AOvVaw3fkabSUlpZcwCI-wE3JBxe&ust=1740769768691000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCKjIiO_G5IsDFQAAAAAdAAAAABA6"
                       target="_blank" rel="noopener noreferrer">
                        <img
                            src="https://i.makeagif.com/media/2-06-2016/Th3yY4.gif"
                            alt="Earth's Magnetosphere"
                            className="rounded-lg shadow-md hover:shadow-yellow-500/50 transition-transform transform hover:scale-105"
                        />
                    </a>
                </div>
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