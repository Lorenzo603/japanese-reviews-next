'use client'

import { useCallback, useEffect, useState } from 'react';
import { HeaderMenu } from './HeaderMenuComponent';
import Confetti from 'react-dom-confetti';
import Link from 'next/link';
import { useQuizContext } from '@/app/context/quizContext';
var wanakana = require('wanakana');

export const FlashcardAnswerComponent = (props) => {

    const AnswerState = {
        WAITING_RESPONSE: 0,
        ANSWERED: 1,
        FINISHED: 2,
    };

    const [answerState, setAnswerState] = useState(AnswerState.WAITING_RESPONSE);
    const [kanjiPrompt, setKanjiPrompt] = useState(null);
    const [totalAnswers, setTotalAnswers] = useState(0);
    const [totalCorrect, setTotalCorrect] = useState(0);
    const [remainingPrompts] = useState([]);
    const [wrongAnswers] = useState([]);
    const [isExploding, setIsExploding] = useState(false);

    const { promptSet } = useQuizContext();

    const handleKeyDownCallback = useCallback(handleKeyDown, [answerState]);

    function handleKeyDown(e) {
        e.preventDefault();

        if ((e.key === ' ' || e.key === 'ArrowRight') && answerState === AnswerState.WAITING_RESPONSE) {
            flipFlashcard();
            return;
        }

        if (answerState === AnswerState.ANSWERED) {
            if (e.key === ' ' || e.key === 'ArrowRight' || e.key === 'c') {
                markAnswerCorrect();
                return;
            }
            if (e.key === 'w' || e.key === 'ArrowLeft') {
                markAnswerWrong();
                return;
            }
        }
    }

    const FLIP_BUTTON_ID = 'flip-button';
    const CORRECT_ANSWER_BUTTON_ID = 'correct-answer-button';
    const WRONG_ANSWER_BUTTON_ID = 'wrong-answer-button';

    function getNextKanjiPrompt() {
        return remainingPrompts.pop();
    };

    const updatePrompt = () => {
        console.log("Prompts pool length:", remainingPrompts.length);

        if (remainingPrompts.length === 0) {
            setAnswerState(AnswerState.FINISHED);
            if (totalCorrect === totalAnswers) {
                setIsExploding(true);
            }

        } else {
            setKanjiPrompt(getNextKanjiPrompt());
        }
    };

    function shuffle(unshuffled) {
        return unshuffled
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value)
    }

    useEffect(() => {
        if (remainingPrompts.length === 0) {
            remainingPrompts.push(...shuffle(promptSet));
            updatePrompt();
        }


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDownCallback);

        return function cleanup() {
            window.removeEventListener('keydown', handleKeyDownCallback);
        }

    }, [handleKeyDownCallback]);

    function endSession() {
        setAnswerState(AnswerState.FINISHED);
    }

    function moveToNextPrompt() {
        setAnswerState(AnswerState.WAITING_RESPONSE);
        updatePrompt();
    }

    function KanjiPrompt() {
        return <KanjiPromptStyled promptText={kanjiPrompt['data']['slug']} cssClass="p-3 text-8xl" />;
    }

    function KanjiPromptStyled(props) {
        return <div className={props.cssClass}>{props.promptText}</div>;
    }

    function AnswerResult() {
        const whitelistedMeanings = getWhitelistedMeanings(kanjiPrompt);
        const readings = getReadings(kanjiPrompt);
        const readingsKun = readings.filter(reading => !reading.hasOwnProperty('type') || reading['type'] === 'kunyomi');
        const readingsOn = readings.filter(reading => reading['type'] === 'onyomi');
        const readingsNames = readings.filter(reading => reading['type'] === 'nanori');

        return <div className="max-w-lg text-2xl p-2 text-left">
            <div className='border-t-2 last:border-b-2 p-2'>
                {getMeanings(kanjiPrompt).map(meaning => meaning['meaning']).join(', ')}
            </div>
            {whitelistedMeanings.length > 0 &&
                <div className='border-t-2 last:border-b-2 p-2'>
                    {whitelistedMeanings.map(meaning => meaning['meaning']).join(', ')}
                </div>
            }
            {readingsKun.length > 0 &&
                <div className='border-t-2 last:border-b-2 p-2'>
                    {readingsKun.map(reading => reading['reading']).join(', ')}
                </div>
            }
            {readingsOn.length > 0 &&
                <div className='border-t-2 last:border-b-2 p-2'>
                    {readingsOn.map(reading => wanakana.toKatakana(reading['reading'])).join(', ')}
                </div>
            }
            {readingsNames.length > 0 &&
                <div className='border-t-2 last:border-b-2 p-2'>
                    Nanori: {readingsNames.map(reading => reading['reading']).join(', ')}
                </div>
            }
        </div>
    }

    function getMeanings(prompt) {
        return prompt['data']['meanings'];
    }

    function getWhitelistedMeanings(prompt) {
        return prompt['data']['auxiliary_meanings']
            .filter(auxiliaryMeaning => auxiliaryMeaning['type'] === 'whitelist');
    }

    function getReadings(prompt) {
        return prompt['data']['readings'];
    }

    function WrongAnswersRecap() {
        return (
            <ul className='wrongAnswerRecap'>
                {wrongAnswers.map(wrongAnswer =>
                    <li key={wrongAnswer['id'] + '-' + wrongAnswer['promptMode']}>{wrongAnswer['data']['slug']}</li>
                )}
            </ul>
        );
    }

    function flipFlashcard() {
        setAnswerState(AnswerState.ANSWERED);
    }

    function markAnswerCorrect() {
        setTotalAnswers(totalAnswers + 1);
        setTotalCorrect(totalCorrect + 1);
        moveToNextPrompt();
    }

    function markAnswerWrong() {
        setTotalAnswers(totalAnswers + 1);
        wrongAnswers.push(kanjiPrompt);

        // if (reviewMode === false && practiceMode === false) {
        //     updateSrsWrongAnswer(kanjiPrompt["id"]);
        // }

        moveToNextPrompt();
    }

    const confettiConfig = {
        angle: '280',
        spread: '360',
        startVelocity: 30,
        elementCount: 70,
        dragFriction: 0.12,
        duration: 4000,
        stagger: 3,
        width: '12px',
        height: '12px',
        perspective: '500px',
        colors: ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a'],
    };

    function FinalResult() {
        return (
            <div>
                <div className='mb-4'>
                    {wrongAnswers.length === 0 ? "Congratulations!" : <WrongAnswersRecap />}
                </div>
                <Link className='p-2 bg-blue-600 no-underline text-white' href="/dashboard">Go back</Link>
            </div>
        );
    }

    return (
        <div>
            <HeaderMenu endSessionHandler={endSession}
                totalAnswers={totalAnswers} totalCorrect={totalCorrect}
                totalReviews={promptSet.length} />
            <div className='min-h-screen'>
                <div className='flex justify-center mb-10'>
                    {kanjiPrompt && <KanjiPrompt />}
                </div>
                {answerState === AnswerState.WAITING_RESPONSE && (
                    <div>
                        <button className='bg-blue-600 text-3xl p-10 rounded-lg'
                            id={FLIP_BUTTON_ID} onClick={flipFlashcard}>Flip</button>
                    </div>
                )}
                {answerState === AnswerState.ANSWERED && (
                    <div className='flex flex-col gap-y-12 justify-center'>
                        <div className='flex justify-center'>
                            <AnswerResult />
                        </div>
                        <div className='flex flex-row justify-center gap-x-36'>
                            <button className='bg-red-600 text-3xl p-10 rounded-lg'
                                id={WRONG_ANSWER_BUTTON_ID} onClick={markAnswerWrong}>Wrong</button>
                            <button className='bg-green-500 text-3xl p-10 rounded-lg'
                                id={CORRECT_ANSWER_BUTTON_ID} onClick={markAnswerCorrect}>Correct</button>
                        </div>
                    </div>
                )}
                {answerState === AnswerState.FINISHED && <FinalResult />}
                <div>
                    <Confetti active={isExploding} config={confettiConfig} />
                </div>
            </div>
        </div>
    );
};

export default FlashcardAnswerComponent;