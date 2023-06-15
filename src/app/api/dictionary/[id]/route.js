import { NextResponse } from 'next/server'
import { promises as fs } from 'fs';
import path from 'path';

const dictionaryCacheMap = new Map();

export async function GET(request, { params }) {
    const dictionaryId = params.id;

    if (dictionaryCacheMap.has(dictionaryId)) {
        console.log("Returning dictionary from cache:", dictionaryId);
        return NextResponse.json(dictionaryCacheMap.get(dictionaryId));
    }

    const jsonDirectory = path.join(process.cwd(), 'src', 'resources');
    const fileContents = await fs.readFile(path.join(jsonDirectory, dictionaryId) + '.json');
    const fullDictionary = JSON.parse(fileContents);
    const filteredDictionary = fullDictionary['data']
        .filter(item => item['data']['hidden_at'] === null);
    const dictionaryString = JSON.stringify(filteredDictionary);
    dictionaryCacheMap.set(dictionaryId, dictionaryString);

    return NextResponse.json(dictionaryString);
}
