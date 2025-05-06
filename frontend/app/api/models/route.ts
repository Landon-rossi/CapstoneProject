import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        const modelsDir = path.join(process.cwd(), 'app', 'models');
        const models = fs.readdirSync(modelsDir).filter((file) =>
            fs.statSync(path.join(modelsDir, file)).isDirectory()
        );

        return NextResponse.json({ models });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
