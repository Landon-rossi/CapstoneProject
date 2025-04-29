export async function callGradio(input: string): Promise<string> {
    const res = await fetch("http://localhost:8000/run", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ input })
    });

    const data = await res.json();
    return data.output || "No output";
}
