import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const model = searchParams.get('model');

    if (!model) {
        return NextResponse.json({ error: 'Model name is required' }, { status: 400 });
    }

    const modelDir = path.join(process.cwd(), 'app', 'models', model);
    const scriptPath = path.join(modelDir, 'run_model.py');
    const graphsDir = path.join(process.cwd(), 'public', 'graphs');

    const isWindows = os.platform() === 'win32';
    const pythonPath = isWindows
        ? path.join(modelDir, 'env', 'Scripts', 'python.exe')
        : path.join(modelDir, 'env', 'bin', 'python');

    if (!fs.existsSync(pythonPath)) {
        return NextResponse.json({ error: `Python executable not found at ${pythonPath}` }, { status: 500 });
    }

    if (!fs.existsSync(scriptPath)) {
        return NextResponse.json({ error: `Model script not found: ${scriptPath}` }, { status: 404 });
    }

    return new Promise((resolve) => {
        exec(`${pythonPath} ${scriptPath}`, (error, stdout, stderr) => {
            if (error) {
                return resolve(NextResponse.json({ error: `Execution error: ${error.message}` }, { status: 500 }));
            }
            if (stderr) {
                return resolve(NextResponse.json({ error: stderr }, { status: 500 }));
            }

            let imagePaths = stdout.trim().split(",").map((img) => img.trim());

            // Validate images exist in the public/graphs folder
            imagePaths = imagePaths.filter((img) => fs.existsSync(path.join(graphsDir, img)));

            console.log("Final validated image paths:", imagePaths);
            return resolve(NextResponse.json({ images: imagePaths }));
        });
    });
}
