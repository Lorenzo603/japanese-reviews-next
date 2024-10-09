import { getDictionary } from '@/app/components/backend/DictionaryLoaderComponent';
import { NextResponse } from 'next/server'
import db from "../../../../../lib/drizzleOrmDb.js";
import { withPreParsedRequestResponse, withSession } from 'supertokens-node/nextjs/index.js';
import { ensureSuperTokensInit } from '@/app/(auth)/sign-in/config/backend.js';
import { userReviewsActive } from '../../../../../../drizzle/schema.ts';
import Session from "supertokens-node/recipe/session";
import { and, eq } from 'drizzle-orm';

ensureSuperTokensInit();

export async function GET(request) {
    return withSession(request, async (err, session) => {
        if (err) {
            console.error(err);
            return NextResponse.json(err, { status: 500 });
        }

        if (!session) {
            return new NextResponse("Authentication required", { status: 401 });
        }

        const userId = session.getUserId();
        console.log(`Getting active prompsets for user: ${userId}`);

        try {
            const queryResult = await db
                .select()
                .from(userReviewsActive)
                .where(
                    and(
                        eq(userReviewsActive.userId, userId),
                        eq(userReviewsActive.active, true),
                    )
                );

            if (queryResult.length === 0) {
                console.warn('No active prompt sets found for user: ' + userId);
                return NextResponse.json({}, { status: 200 });
            }
            if (queryResult.length > 1) {
                console.warn('Multiple active prompt sets found for user: ' + userId);
            }

            const result = queryResult[0];

            const fullKanjiDictionary = await getDictionary('kanji_full_reduced');

            return NextResponse.json({
                prompts: result.promptIds
                    .map(id => fullKanjiDictionary.find(k => k['id'] === parseInt(id)))
                    .map(kanji => {
                        return {
                            id: kanji['id'],
                            prompt: result.guessKanji ? getFirstMeaning(kanji) : kanji['data']['slug'],
                            answers: buildAnswers(kanji, result.guessKanji, fullKanjiDictionary),
                            correctAnswer: result.guessKanji ? kanji['data']['slug'] : getFirstMeaning(kanji),
                        }
                    }),
                guessKanji: result.guessKanji,
                multichoiceInput: result.multichoiceInput,
                totalAnswers: result.totalAnswers,
                totalCorrect: result.totalCorrect,
                // TODO: improvement: only save prompt and correct answer
                wrongAnswers: result.wrongAnswersIds
                    .map(id => fullKanjiDictionary.find(k => k['id'] === parseInt(id)))
                    .map(kanji => {
                        return {
                            id: kanji['id'],
                            prompt: result.guessKanji ? getFirstMeaning(kanji) : kanji['data']['slug'],
                            answers: buildAnswers(kanji, result.guessKanji, fullKanjiDictionary),
                            correctAnswer: result.guessKanji ? kanji['data']['slug'] : getFirstMeaning(kanji),
                        }
                    }
                    ),
            }, { status: 200 })
        } catch (error) {
            console.error(error);
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
        }
    });
}


export async function POST(request) {
    return withPreParsedRequestResponse(request, async (baseRequest, baseResponse) => {
        console.log("Calculating Visually Similar PromptSet...");
        const session = await Session.getSession(baseRequest, baseResponse, { sessionRequired: false });
        const reqJson = await request.json();
        const selectedReviewCategories = reqJson.selectedReviewCategories;
        const guessKanji = reqJson.guessKanji;
        const multichoiceInput = reqJson.multichoiceInput;

        const fullKanjiDictionary = await getDictionary('kanji_full_reduced');
        let promptSet = fullKanjiDictionary
            .filter(kanji => kanji['data'].hasOwnProperty('categories'))
            .filter(kanji => selectedReviewCategories.some(id => kanji['data']['categories'].includes(id)))
            .filter(kanji => kanji['data']['visually_similar_subject_ids'].length > 0)
            .map(kanji => ({
                id: kanji['id'],
                prompt: guessKanji ? getFirstMeaning(kanji) : kanji['data']['slug'],
                answers: buildAnswers(kanji, guessKanji, fullKanjiDictionary),
                correctAnswer: guessKanji ? kanji['data']['slug'] : getFirstMeaning(kanji),
            }));


        promptSet = shuffle(promptSet);

        if (session !== undefined) {
            await db.insert(userReviewsActive)
                .values(
                    {
                        userId: session.getUserId(),
                        active: true,
                        createdAt: new Date(),

                        promptIds: promptSet.map(kanji => kanji['id']),
                        guessKanji: guessKanji,
                        multichoiceInput: multichoiceInput,
                        totalAnswers: 0,
                        totalCorrect: 0,
                        wrongAnswersIds: [],
                    }
                );

        }

        return NextResponse.json(promptSet);
    });
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

export async function PATCH(request) {
    return withSession(request, async (err, session) => {
        if (err) {
            console.error(err);
            return NextResponse.json(err, { status: 500 });
        }

        if (!session) {
            return new NextResponse("Authentication required", { status: 401 });
        }

        const userId = session.getUserId();
        console.log(`Updating active reviews for user: ${userId}`);

        /**
         * totalCorrect,
         * totalAnswers,
         * wrongAnswersIds,
         * 
         * or 
         * 
         * active=false
         */
        const updatedFieldsObject = await request.json();
        try {
            const result = await db.update(userReviewsActive)
                .set(updatedFieldsObject)
                .where(
                    and(
                        eq(userReviewsActive.userId, userId),
                        eq(userReviewsActive.active, true),
                    )
                );
            if (result.rowCount === 0) {
                console.warn('Record not found');
                return NextResponse.json({ error: 'Bad request' }, { status: 400 })
            }
            return NextResponse.json({ message: 'OK' }, { status: 200 })
        } catch (error) {
            console.error(error);
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
        }

    })

}