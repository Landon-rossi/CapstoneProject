import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';

export async function GET() {
    return new Promise((resolve) => {
        // Absolute path to the Python in your venv
        const pythonPath = path.join(process.cwd(), 'env', 'bin', 'python');
        // Absolute path to the test script
        const scriptPath = path.join(process.cwd(), 'test_python.py');

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
