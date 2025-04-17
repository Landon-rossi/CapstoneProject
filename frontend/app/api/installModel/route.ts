import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const model = searchParams.get('model');

    if (!model) {
        return NextResponse.json({ error: 'Model name is required' }, { status: 400 });
    }

    const modelDir = path.join(process.cwd(), 'app', 'models', model);
    const userAgent = req.headers.get('user-agent') || '';
    const isWindows = userAgent.includes('Windows');

    const pythonPath = path.join(modelDir, 'env', 'Scripts', 'python.exe');
    if (fs.existsSync(pythonPath)) {
        console.log(`[InstallModel] Skipping install: ${pythonPath} already exists`);
        return NextResponse.json({ message: 'Model already installed. Skipping.' });
    }

    const installerScript = isWindows
        ? path.join(modelDir, 'win_package_installer.bat')
        : path.join(modelDir, 'mac_package_installer.sh');

    console.log(`Running installer: ${installerScript} in ${modelDir}`);

    if (!fs.existsSync(installerScript)) {
        return NextResponse.json({ error: `Installer script not found: ${installerScript}` }, { status: 404 });
    }

    return new Promise((resolve) => {
        const command = isWindows
            ? `"${installerScript}"`
            : `chmod +x "${installerScript}" && "${installerScript}"`;

        exec(command, { cwd: modelDir }, (error, stdout, stderr) => {
            console.log("[InstallModel] STDOUT:", stdout);
            console.error("[InstallModel] STDERR:", stderr);

            if (error) {
                return resolve(NextResponse.json({
                    error: `Execution error: ${error.message}`,
                    details: stderr || stdout || "No further output",
                }, { status: 500 }));
            }

            return resolve(NextResponse.json({
                message: "Installation Complete",
                output: stdout,
            }));
        });
    });
}
