import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { model, prompt, history } = body;

    if (!model || !prompt) {
        return NextResponse.json({ error: "Missing model or prompt" }, { status: 400 });
    }

    try {
        if (model === "openai") {
            const res = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [
                        { role: "system", content: "You are a solar wind expert AI assistant." },
                        ...history.map((m: any) => ({
                            role: m.sender === "user" ? "user" : "assistant",
                            content: m.content,
                        })),
                        { role: "user", content: prompt },
                    ],
                }),
            });

            const json = await res.json();
            const reply = json.choices?.[0]?.message?.content;
            return NextResponse.json({ reply });
        }

        if (model === "gemini") {
            const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + process.env.GEMINI_API_KEY, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [
                        ...history.map((m: any) => ({
                            role: m.sender,
                            parts: [{ text: m.content }],
                        })),
                        { role: "user", parts: [{ text: prompt }] },
                    ],
                }),
            });

            const json = await res.json();
            const reply = json.candidates?.[0]?.content?.parts?.[0]?.text;
            return NextResponse.json({ reply });
        }

        return NextResponse.json({ error: "Unsupported model" }, { status: 400 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || "Unknown error" }, { status: 500 });
    }
}
