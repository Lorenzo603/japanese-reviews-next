'use server'

import { promises as fs } from 'fs';
import path from 'path';

const dictionaryCacheMap = new Map();

export async function getDictionary(dictionaryId) {

    if (dictionaryCacheMap.has(dictionaryId)) {
        console.log("Returning dictionary from cache:", dictionaryId);
        return dictionaryCacheMap.get(dictionaryId);
    }

    const jsonDirectory = path.join(process.cwd(), 'src', 'resources');
    const fileContents = await fs.readFile(path.join(jsonDirectory, dictionaryId) + '.json');
    const fullDictionary = JSON.parse(fileContents);
    const filteredDictionary = fullDictionary['data']
        .filter(item => item['data']['hidden_at'] === null);
    
    dictionaryCacheMap.set(dictionaryId, filteredDictionary);

    return filteredDictionary;
}
