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

    // Ensure we are pointing to the correct directory
    const modelDir = path.join(process.cwd(), 'app', 'models', model);
    const userAgent = req.headers.get('user-agent') || '';
    const isWindows = userAgent.includes('Windows');

    // Select the correct script
    const installerScript = isWindows
        ? path.join(modelDir, 'win_package_installer.bat')
        : path.join(modelDir, 'mac_package_installer.sh');

    console.log(`Running installer: ${installerScript} in ${modelDir}`);

    // Check if the script exists
    if (!fs.existsSync(installerScript)) {
        return NextResponse.json({ error: `Installer script not found: ${installerScript}` }, { status: 404 });
    }

    return new Promise((resolve) => {
        exec(`cd ${modelDir} && chmod +x ${installerScript} && ./${path.basename(installerScript)}`, (error, stdout, stderr) => {
            if (error) {
                return resolve(NextResponse.json({ error: `Execution error: ${error.message}` }, { status: 500 }));
            }
            if (stderr) {
                return resolve(NextResponse.json({ error: stderr }, { status: 500 }));
            }
            return resolve(NextResponse.json({ message: 'Installation Complete', output: stdout }));
        });
    });
}
