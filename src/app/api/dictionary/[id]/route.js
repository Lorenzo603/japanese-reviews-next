import { NextResponse } from 'next/server'
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request, { params }) {
    const dictionaryId = params.id;
    const jsonDirectory = path.join(process.cwd(), 'src', 'app');
    const fileContents = await fs.readFile(path.join(jsonDirectory, dictionaryId) + '.json');
    const fullDictionary = JSON.parse(fileContents);
    const filteredDictionary = fullDictionary['data']
        .filter(item => item['data']['hidden_at'] === null);
    return NextResponse.json(JSON.stringify(filteredDictionary));
}
