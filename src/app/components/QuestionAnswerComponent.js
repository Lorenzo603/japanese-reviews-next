'use client'

import { useEffect, useState } from 'react';
import { HeaderMenu } from './HeaderMenuComponent';
import Confetti from 'react-dom-confetti';
import { updateSrsWrongAnswer, updateSrsAfterReview, updateSingleSrsAfterReview } from '../services/SrsService';
import Link from 'next/link';
import { useQuizContext } from '@/app/context/quizContext';
var wanakana = require('wanakana');
var stringSimilarity = require("string-similarity");

export const QuestionAnswerComponent = (props) => {
    const Result = {
        CORRECT: 0,
        WRONG: 1,
        NA: 2,
    };

    const AnswerState = {
        WAITING_RESPONSE: 0,
        ANSWERED: 1,
        FINISHED: 2,
    };

    const [answerState, setAnswerState] = useState(AnswerState.WAITING_RESPONSE);
    const [kanjiPrompt, setKanjiPrompt] = useState(null);
    const [answerResult, setAnswerResult] = useState(Result.NA);
    const [totalAnswers, setTotalAnswers] = useState(0);
    const [totalCorrect, setTotalCorrect] = useState(0);
    const [remainingPrompts] = useState([]);
    const [wrongAnswers] = useState([]);
    const [isExploding, setIsExploding] = useState(false);
    const [scoreMap, setScoreMap] = useState(new Map());

    const { promptSet, reviewMode, practiceMode, reviewSet } = useQuizContext();

    const ANSWER_INPUT_ID = 'answer-input';

    function getNextKanjiPrompt() {
        return remainingPrompts.pop();
    };

    const updatePrompt = () => {
        console.log("Prompts pool length:", remainingPrompts.length);

        if (reviewMode === true && kanjiPrompt !== null) {
            const kanjiId = kanjiPrompt["id"];
            if (scoreMap.has(kanjiId)) {
                if (scoreMap.get(kanjiId).numPromptsAlreadyAnswered == 2) {
                    updateSingleSrsAfterReview(scoreMap.get(kanjiId).score, kanjiId, reviewSet);
                    scoreMap.delete(kanjiId);
                }
            }
        }

        if (remainingPrompts.length === 0) {
            setAnswerState(AnswerState.FINISHED);
            if (totalCorrect === totalAnswers) {
                setIsExploding(true);
            }

            if (reviewMode === true) {
                updateSrsAfterReview(scoreMap, reviewSet);
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

    function getAnswerInputElement() {
        return document.getElementById(ANSWER_INPUT_ID);
    }

    useEffect(() => {
        if (remainingPrompts.length === 0) {
            remainingPrompts.push(...shuffle(promptSet));
            updatePrompt();
            getAnswerInputElement().focus();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (kanjiPrompt) {
            if (isKanaInput()) {
                enableKanaInput();
            } else {
                disableKanaInput();
            }
        }

    }, [kanjiPrompt]);

    function isKanaInput() {
        return kanjiPrompt["promptMode"] === "reading" || kanjiPrompt["promptMode"] === "kanji";
    }

    function enableKanaInput() {
        const element = getAnswerInputElement();
        if (!element.hasAttribute("data-wanakana-id")) {
            wanakana.bind(element);
        }
    }

    function disableKanaInput() {
        const element = getAnswerInputElement();
        if (element.hasAttribute("data-wanakana-id")) {
            wanakana.unbind(element);
        }
    }

    function endSession() {
        setAnswerState(AnswerState.FINISHED);
    }

    function getCurrentMode(prompt) {
        return prompt["promptMode"] === "meaning" ? 'meanings' : 'readings';
    }

    function getCurrentModeSingle(prompt) {
        return prompt["promptMode"] === "meaning" ? 'meaning' : 'reading'
    }

    function getAcceptedAnswers(prompt) {
        const currentMode = getCurrentMode(prompt);
        const acceptedAnswers = prompt['data'][currentMode]
            .filter(potentialAnswer => potentialAnswer.accepted_answer);
        if (currentMode === 'meanings') {
            const whitelistedAnswers = prompt['data']['auxiliary_meanings']
                .filter(auxiliaryMeaning => auxiliaryMeaning['type'] === 'whitelist');
            acceptedAnswers.push(...whitelistedAnswers);
        }
        return acceptedAnswers;
    }

    function handleSubmit(event) {
        event.preventDefault();
        if (answerState === AnswerState.WAITING_RESPONSE) {
            validateAnswer();
        } else {
            moveToNextPrompt();
        }
    }

    function validateAnswer() {
        const currentModeSingle = getCurrentModeSingle(kanjiPrompt);
        const acceptedAnswers = getAcceptedAnswers(kanjiPrompt)
            .map(answer => answer[currentModeSingle].trim().toLowerCase());
        let userAnswer = getAnswerInputElement().value.toLowerCase();

        userAnswer = convertLastNCharacter(userAnswer);

        if (acceptedAnswers.includes(userAnswer)) {
            handleCorrectAnswer();
            return;
        }

        const answerContainsRomaji = isKanaInput()
            && userAnswer.length > 0
            && !wanakana.isKana(userAnswer);
        const similarAnswerExists = acceptedAnswers.some((element) => {
            return stringSimilarity.compareTwoStrings(userAnswer, element) >= 0.75;
        });
        if (userAnswer.length === 0 || answerContainsRomaji || similarAnswerExists) {
            shakeInputField();
            return;
        }

        const unexpectedReading = kanjiPrompt["promptMode"] === "reading" && isReadingNotAccepted(userAnswer);
        if (unexpectedReading) {
            getAnswerInputElement().classList.add('unexected-reading');
            shakeInputField();
            return;
        }

        handleWrongAnswer();

    }

    function isReadingNotAccepted(userAnswer) {
        return kanjiPrompt['data']['readings']
            .filter(reading => !reading.accepted_answer)
            .map(reading => reading['reading'].toLowerCase())
            .includes(userAnswer);
    }

    function convertLastNCharacter(userAnswer) {
        if (isKanaInput()
            && userAnswer.length > 0
            && userAnswer.slice(-1) === 'n') {
            userAnswer = userAnswer.substring(0, userAnswer.length - 1) + 'ん';
            getAnswerInputElement().value = userAnswer;
        }
        return userAnswer;
    }

    function handleCorrectAnswer() {
        setAnswerResult(Result.CORRECT);
        setTotalCorrect(totalCorrect + 1);
        updateAnswerCount();
        updateScoreMap(Result.CORRECT);
    }

    function handleWrongAnswer() {
        setAnswerResult(Result.WRONG);
        wrongAnswers.push(kanjiPrompt);
        updateAnswerCount();
        updateScoreMap(Result.WRONG);

        if (reviewMode === false && practiceMode === false) {
            updateSrsWrongAnswer(kanjiPrompt["id"]);
        }
    }

    function moveToNextPrompt() {
        setAnswerState(AnswerState.WAITING_RESPONSE);
        getAnswerInputElement().value = "";
        updatePrompt();
    }

    function handleKeyDown(e) {
        if (e.key === 'Tab') {
            handleSubmit(e);
        }
    }

    function updateAnswerCount() {
        setAnswerState(AnswerState.ANSWERED);
        setTotalAnswers(totalAnswers + 1);
    }

    function updateScoreMap(result) {
        const isElementAlreadyInMap = scoreMap.has(kanjiPrompt["id"]);
        const currentScore = isElementAlreadyInMap ? scoreMap.get(kanjiPrompt["id"]).score : 0;
        const numPromptsAlreadyAnswered = isElementAlreadyInMap ? scoreMap.get(kanjiPrompt["id"]).numPromptsAlreadyAnswered : 0;
        setScoreMap(scoreMap.set(
            kanjiPrompt["id"], {
            score: result === Result.CORRECT ? currentScore + 1 : currentScore - 2,
            numPromptsAlreadyAnswered: numPromptsAlreadyAnswered + 1
        }
        ));
    }

    function shakeInputField() {
        const element = getAnswerInputElement();
        element.classList.remove('shake-animation'); // reset animation
        void element.offsetWidth; // trigger reflow
        element.classList.add('shake-animation'); // start animation
    }

    function GuessModeInstructions() {
        return (
            <div className={`min-w-24 col-1 p-2 border-2 ${kanjiPrompt["object"] === "kanji" ? 'border-[#a135bb]' : 'border-[#f500a3]'}`}>
                <GuessModeText />
            </div>
        );
    }

    function GuessModeText() {
        if (kanjiPrompt["promptMode"] === "meaning") {
            return <span>Guess <b>Meaning</b></span>;
        }
        if (kanjiPrompt["promptMode"] === "reading") {
            return <span>Guess <b>Reading</b></span>;
        }
        if (kanjiPrompt["promptMode"] === "kanji") {
            return <span>Guess <b>Kanji</b></span>;
        }
        return "Error";
    }

    function KanjiPrompt() {
        if (kanjiPrompt["promptMode"] === "kanji") {
            const acceptedMeaningPrompt = kanjiPrompt['data']['meanings']
                .filter(acceptedMeaning => acceptedMeaning.accepted_answer)
                .map(acceptedMeaning => acceptedMeaning["meaning"])
                .join(', ');
            return <KanjiPromptStyled promptText={acceptedMeaningPrompt} cssClass="p-4 text-3xl" />;
        }
        return <KanjiPromptStyled promptText={kanjiPrompt['data']['slug']} cssClass="font-japanese p-4 text-8xl" />;
    }

    function KanjiPromptStyled(props) {
        return <div className={props.cssClass}>{props.promptText}</div>;
    }

    function AnswerResult(props) {
        return <div className={(kanjiPrompt && kanjiPrompt["promptMode"] === "kanji") ? 'text-2xl' : 'py-2 text-2xl'}>
            {props.currentState === AnswerState.ANSWERED ?
                props.result === Result.CORRECT
                    ? getSuccessText()
                    : getIncorrectText()
                : ""}
        </div>
    }

    function getSuccessText() {
        return kanjiPrompt["promptMode"] === "kanji"
            ? kanjiPrompt['data']['slug']
            : concatenateAcceptedAnswers();
    }

    function getIncorrectText() {
        const currentModeSingle = getCurrentModeSingle(kanjiPrompt);
        return kanjiPrompt["promptMode"] === "kanji"
            ? getAcceptedAnswers(kanjiPrompt).filter(answer => answer.primary)[0][currentModeSingle] + " - " + kanjiPrompt['data']['slug']
            : concatenateAcceptedAnswers();
    }

    function concatenateAcceptedAnswers() {
        const currentModeSingle = getCurrentModeSingle(kanjiPrompt);
        return getAcceptedAnswers(kanjiPrompt).map(answer => answer[currentModeSingle]).join(', ');
    }

    function WrongAnswersRecap() {
        return (
            <ul className='list-none'>
                {wrongAnswers.map(wrongAnswer =>
                    <li key={wrongAnswer['id'] + '-' + wrongAnswer['promptMode']}>{wrongAnswer['data']['slug']}&nbsp;:&nbsp;
                        {getAcceptedAnswers(wrongAnswer).map(answer => answer[getCurrentModeSingle(wrongAnswer)]).join(', ')}</li>
                )}
            </ul>
        );
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
                <div className='flex justify-center'>
                    {kanjiPrompt && <GuessModeInstructions />}
                </div>
                <div>
                    {kanjiPrompt && <KanjiPrompt />}
                </div>
                {kanjiPrompt && kanjiPrompt["promptMode"] === "kanji" && kanjiPrompt["data"].hasOwnProperty("parts_of_speech") && (
                    <div className='mb-3'>
                        {kanjiPrompt["data"]["parts_of_speech"].join(', ')}
                    </div>
                )}
                {answerState !== AnswerState.FINISHED && (
                    <>
                        <div>
                            <form onSubmit={handleSubmit} autoComplete="off">
                                <input type="text" id={ANSWER_INPUT_ID}
                                    className={answerState === AnswerState.ANSWERED ? answerResult === Result.CORRECT ? 'correct' : 'wrong' : ''}
                                    onKeyDown={handleKeyDown} />
                            </form>
                        </div>
                        <div>
                            <AnswerResult currentState={answerState} result={answerResult} />
                        </div>
                    </>
                )}
                {answerState === AnswerState.FINISHED && <FinalResult />}
                <div>
                    <Confetti active={isExploding} config={confettiConfig} />
                </div>
            </div>
        </div>
    );
};

export default QuestionAnswerComponent;