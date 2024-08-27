import { getDictionary } from '@/app/components/backend/DictionaryLoaderComponent';
import { NextResponse } from 'next/server'

export async function POST(request) {
    console.log("Calculating Visually Similar PromptSet...");
    const reqJson = await request.json();
    const selectedLevel = reqJson.selectedLevel;

    const fullKanjiDictionary = await getDictionary('kanji_full_reduced');

    return NextResponse.json(fullKanjiDictionary
        .filter(kanji => kanji['data']['level'] === selectedLevel));
}
