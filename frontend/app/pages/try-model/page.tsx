import Link from 'next/link';

export default function ModelPage() {
    return (
        <div className="flex min-h-screen bg-gradient-to-b from-indigo-900 via-black to-yellow-600 text-white">
            {/* LEFT PANEL */}
            <div className="w-[350px] h-screen flex flex-col border-r border-yellow-400 bg-black/40">
                <div className="flex-1 overflow-y-auto p-4">
                    <h1 className="text-2xl font-bold mb-6 text-yellow-300 text-center">
                        Gradio App Loader
                    </h1>
                    <p className="text-yellow-200 mb-6 text-center">
                        Python script will auto-start.
                    </p>
                </div>
                <footer className="text-center p-4 border-t border-yellow-400">
                    <Link
                        href="/"
                        className="rounded-full px-6 py-3 bg-yellow-500 text-black font-bold hover:bg-yellow-400 transition"
                    >
                        Back to Home
                    </Link>
                </footer>
            </div>

            {/* RIGHT PANEL */}
            <div className="flex-1 p-8 space-y-8">
                <div className="bg-white/5 p-4 rounded shadow-md w-full h-[900px]">
                    <h2 className="text-xl font-bold mb-4 text-yellow-400 border-b pb-1 border-yellow-500">
                        Gradio App
                    </h2>
                    <iframe
                        src="http://127.0.0.1:7860"
                        className="w-full h-full rounded border-2 border-yellow-400"
                    />
                </div>
            </div>
        </div>
    );
}
