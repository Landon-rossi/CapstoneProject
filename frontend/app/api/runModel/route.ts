import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const model = searchParams.get('model');
    const step = searchParams.get('step');

    if (!model) {
        return NextResponse.json({ error: 'Missing model name' }, { status: 400 });
    }

    const modelDir = path.join(process.cwd(), 'app', 'models', model);
    const scriptPath = path.join(modelDir, 'run_model.py');

    if (!fs.existsSync(scriptPath)) {
        return NextResponse.json({ error: `run_model.py not found in ${modelDir}` }, { status: 404 });
    }

    const command = `env\\Scripts\\python.exe "${scriptPath}"${step ? ` --step ${step}` : ''}`;

    return new Promise((resolve) => {
        exec(command, { cwd: modelDir }, (error, stdout, stderr) => {
            if (error) {
                return resolve(NextResponse.json({
                    error: `Execution failed: ${stderr || error.message}`
                }, { status: 500 }));
            }

            const lines = stdout.trim().split('\n').filter(l => l.length > 0);
            const images = lines.map(l => l.trim());

            resolve(NextResponse.json({ images }));
        });
    });
}
