import { getDictionary } from '@/components/backend/DictionaryLoaderComponent';
import { NextResponse } from 'next/server'

export async function POST(request) {
    console.log("Calculating PromptSet...");
    const reqJson = await request.json();
    // console.log("PromptSet request body:", reqJson);

    const fullKanjiDictionary = await getDictionary('kanji_full');
    const fullVocabularyDictionary = await getDictionary('vocabulary_full');

    const dataOption = reqJson.dataOption;
    let selectedSet = [];
    switch (dataOption) {
        case "full-vocab":
            selectedSet = fullVocabularyDictionary;
            break;
        case "full-kanji":
            selectedSet = fullKanjiDictionary;
            break;
        case "level":
            const selectedLevel = reqJson.selectedLevel;
            const kanjiSetSelected = reqJson.kanjiSetSelected;
            const vocabularySetSelected = reqJson.vocabularySetSelected;
            if (kanjiSetSelected) {
                selectedSet.push(
                    ...fullKanjiDictionary
                        .filter(kanji => kanji['data']['level'] === selectedLevel)
                );
            }
            if (vocabularySetSelected) {
                selectedSet.push(
                    ...fullVocabularyDictionary
                        .filter(vocab => vocab['data']['level'] === selectedLevel)
                );
            }
            break;
        case "review":
            const elementIds = reqJson.reviewSetElementIds;
            console.log("Review element ids:", elementIds);
            const selectedKanji = fullKanjiDictionary.filter(kanji => elementIds.includes(kanji['id']));
            const selectedVocabulary = fullVocabularyDictionary.filter(vocab => elementIds.includes(vocab['id']));
            selectedSet = selectedKanji.concat(selectedVocabulary);
            break;
        default:
            selectedSet = fullKanjiDictionary
                .filter(kanji => kanji['data'].hasOwnProperty('categories'))
                .filter(kanji => kanji['data']['categories'].includes(dataOption));
            break;
    }

    const promptSet = []
    if (reqJson.guessMeaningSelected === true || dataOption === "review") {
        const cloneSet = structuredClone(selectedSet);
        cloneSet.forEach(prompt => { prompt.promptMode = "meaning" });
        promptSet.push(...cloneSet);
    }

    if (reqJson.guessReadingSelected === true || dataOption === "review") {
        const cloneSet = structuredClone(selectedSet);
        cloneSet
            .filter(prompt => prompt.data.hasOwnProperty('readings'))
            .forEach((prompt) => { prompt.promptMode = "reading" });
        promptSet.push(...cloneSet);
    }

    if (reqJson.guessKanjiSelected === true) {
        const cloneSet = structuredClone(selectedSet);
        cloneSet.forEach((prompt) => { prompt.promptMode = "kanji" });
        promptSet.push(...cloneSet);
    }

    return NextResponse.json(promptSet);
}
