'use server'

import { promises as fs } from 'fs';
import path from 'path';
import { caching } from 'cache-manager';

const memoryCache = await caching('memory', {
  max: 5,
  ttl: 0 * 1000 /*milliseconds*/,
});

export async function getDictionary(dictionaryId) {

    const cachedDictionary = await memoryCache.get(dictionaryId);
    if (cachedDictionary !== undefined) {
        console.log("Returning dictionary from cache:", dictionaryId);
        return cachedDictionary;
    }

    const jsonDirectory = path.join(process.cwd(), 'src', 'resources');
    const fileContents = await fs.readFile(path.join(jsonDirectory, dictionaryId) + '.json');
    const fullDictionary = JSON.parse(fileContents);
    const filteredDictionary = fullDictionary['data']
        .filter(item => item['data']['hidden_at'] === null);
    
    await memoryCache.set(dictionaryId, filteredDictionary, 0);

    console.log("Loaded dictionary from file:", dictionaryId);
    return filteredDictionary;
}
