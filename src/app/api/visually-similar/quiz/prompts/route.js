import { getDictionary } from '@/app/components/backend/DictionaryLoaderComponent';
import { NextResponse } from 'next/server'
import db from "../../../../../lib/drizzleOrmDb.js";
import { withSession } from 'supertokens-node/nextjs/index.js';
import { ensureSuperTokensInit } from '@/app/(auth)/sign-in/config/backend.js';
import { userReviewsActive } from '../../../../../../drizzle/schema.ts';

ensureSuperTokensInit();

export async function POST(request) {
    console.log("Calculating Visually Similar PromptSet...");
    const reqJson = await request.json();
    const selectedLevel = reqJson.selectedLevel;
    const guessKanji = reqJson.guessKanji;

    const fullKanjiDictionary = await getDictionary('kanji_full_reduced');
    let promptSet = fullKanjiDictionary
        .filter(kanji => kanji['data']['level'] === selectedLevel)
        .filter(kanji => kanji['data']['visually_similar_subject_ids'].length > 0)
        .map(kanji => ({
            id: kanji['id'],
            prompt: guessKanji ? getFirstMeaning(kanji) : kanji['data']['slug'],
            answers: buildAnswers(kanji, guessKanji, fullKanjiDictionary),
            correctAnswer: guessKanji ? kanji['data']['slug'] : getFirstMeaning(kanji),
        }));

    promptSet = shuffle(promptSet);

    await db.insert(userReviewsActive)
        .values(
            {
                userId: await getUserId(request),
                active: true,
                createdAt: new Date(),
                promptIds: promptSet.map(kanji => kanji['id']),
                guessKanji: guessKanji,
            }
        );

    return NextResponse.json(promptSet);
}

function buildAnswers(kanji, guessKanji, fullKanjiDictionary) {
    const visuallySimilarIds = kanji['data']['visually_similar_subject_ids']
    const answers = [guessKanji ? kanji['data']['slug'] : getFirstMeaning(kanji)]
    answers.push(
        ...visuallySimilarIds
            .map(id => fullKanjiDictionary.find(k => k['id'] === id))
            .map(k => guessKanji ? k['data']['slug'] : getFirstMeaning(k))
    )
    return shuffle(answers)
}

function shuffle(unshuffled) {
    return unshuffled
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)
}

function getFirstMeaning(kanji) {
    return kanji['data']['meanings'][0]['meaning']
}

async function getUserId(request) {
    return withSession(request, async (err, session) => {
        if (err) {
            console.error(err);
            return NextResponse.json(err, { status: 500 });
        }

        if (!session) {
            return null;
        }

        return session.getUserId();
    })
}
