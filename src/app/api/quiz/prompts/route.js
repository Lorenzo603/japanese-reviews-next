import { getDictionary } from '@/app/components/backend/DictionaryLoaderComponent';
import { NextResponse } from 'next/server'
import { getPendingReviews } from '@/app/components/backend/reviews/ReviewService';
import { withSession } from 'supertokens-node/nextjs';
import { ensureSuperTokensInit } from '@/app/(auth)/sign-in/config/backend';

ensureSuperTokensInit();

export async function POST(request) {
    console.log("Calculating PromptSet...");
    const reqJson = await request.json();
    // console.log("PromptSet request body:", reqJson);

    const fullKanjiDictionary = await getDictionary('kanji_full_reduced');
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
            return withSession(request, async (err, session) => {
                if (err) {
                    console.error(err);
                    return NextResponse.json(err, { status: 500 });
                }
                if (!session) {
                    return new NextResponse("Authentication required", { status: 401 });
                }
                const userId = session.getUserId();
                const pendingReviews = await getPendingReviews(userId);
                const elementIds = pendingReviews.map(review => review.elementId);
                const selectedKanji = fullKanjiDictionary.filter(kanji => elementIds.includes(kanji['id']));
                const selectedVocabulary = fullVocabularyDictionary.filter(vocab => elementIds.includes(vocab['id']));
                selectedSet = selectedKanji.concat(selectedVocabulary);
                
                const promptSet = expandPromptSet(reqJson, dataOption, selectedSet, pendingReviews);
                return NextResponse.json(promptSet);

            });
        default:
            selectedSet = fullKanjiDictionary
                .filter(kanji => kanji['data'].hasOwnProperty('categories'))
                .filter(kanji => kanji['data']['categories'].includes(dataOption));
            break;
    }

    const promptSet = expandPromptSet(reqJson, dataOption, selectedSet, null);
    return NextResponse.json(promptSet);
}

function expandPromptSet(reqJson, dataOption, selectedSet, pendingReviews) {
    const promptSet = []
    if (reqJson.guessMeaningSelected === true || dataOption === "review") {
        let cloneSet = structuredClone(selectedSet);
        if (dataOption === "review" && pendingReviews !== null) {
            const meaningPromptsIds = pendingReviews.filter(review => review.prompts.filter(prompt => prompt["mode"] === "meaning")[0]["answered"] === false)
                .map(review => review.elementId);
            cloneSet = cloneSet.filter(prompt => meaningPromptsIds.includes(prompt["id"]));
        }
        cloneSet.forEach(prompt => { prompt.promptMode = "meaning" });
        promptSet.push(...cloneSet);
    }

    if (reqJson.guessReadingSelected === true || dataOption === "review") {
        let cloneSet = structuredClone(selectedSet);
        if (dataOption === "review" && pendingReviews !== null) {
            const readingPromptsIds = pendingReviews.filter(review => review.prompts.filter(prompt => prompt["mode"] === "reading")[0]["answered"] === false)
                .map(review => review.elementId);
            cloneSet = cloneSet.filter(prompt => readingPromptsIds.includes(prompt["id"]));
        }
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
    return promptSet;
}