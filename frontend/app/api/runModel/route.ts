import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const model = searchParams.get('model') || 'modelA';

    return new Promise((resolve) => {
        // Build the absolute path to the selected model's directory.
        const modelDir = path.join(process.cwd(), 'models', model);

        // Option 1: Using a common virtual environment.
        const pythonPath = path.join(process.cwd(), 'env', 'bin', 'python');

        // Option 2: Use a separate venv for each model (if needed).
        // const pythonPath = path.join(modelDir, 'venv', 'bin', 'python');

        const scriptPath = path.join(modelDir, 'run_model.py');

        exec(`${pythonPath} ${scriptPath}`, (error, stdout, stderr) => {
            if (error) {
                return resolve(NextResponse.json({ error: error.message }, { status: 500 }));
            }
            if (stderr) {
                return resolve(NextResponse.json({ error: stderr }, { status: 500 }));
            }
            return resolve(NextResponse.json({ output: stdout }));
        });
    });
}
