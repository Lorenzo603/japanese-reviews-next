'use client'

import { useEffect, useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { HeaderMenu } from './HeaderMenuComponent';
import Confetti from 'react-dom-confetti';
import { updateSrsWrongAnswer, updateSrsAfterReview } from '../services/SrsService';
import styles from '../app/page.module.css'
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
    const [kanjiPrompt, setKanjiPrompt] = useState();
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
            if (kanjiPrompt["promptMode"] === "reading" || kanjiPrompt["promptMode"] === "kanji") {
                const element = getAnswerInputElement();
                if (!element.hasAttribute("data-wanakana-id")) {
                    wanakana.bind(element);
                }
            } else {
                const element = getAnswerInputElement();
                if (element.hasAttribute("data-wanakana-id")) {
                    wanakana.unbind(element);
                }
            }
        }

    }, [kanjiPrompt]);

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
        const acceptedAnswers = getAcceptedAnswers(kanjiPrompt).map(answer => answer[getCurrentModeSingle(kanjiPrompt)].toLowerCase());
        let userAnswer = getAnswerInputElement().value.toLowerCase();

        userAnswer = convertLastNCharacter(userAnswer);

        if (acceptedAnswers.includes(userAnswer)) {
            handleCorrectAnswer();
            return;
        }

        const answerContainsRomaji = (kanjiPrompt["promptMode"] === "reading" || kanjiPrompt["promptMode"] === "kanji")
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
        if ((kanjiPrompt["promptMode"] === "reading" || kanjiPrompt["promptMode"] === "kanji")
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
        const currentScore = scoreMap.has(kanjiPrompt["id"]) ? scoreMap.get(kanjiPrompt["id"]) : 0;
        setScoreMap(scoreMap.set(kanjiPrompt["id"], result === Result.CORRECT ? currentScore + 1 : currentScore - 2));
    }

    function shakeInputField() {
        const element = getAnswerInputElement();
        element.classList.remove('shake-animation'); // reset animation
        void element.offsetWidth; // trigger reflow
        element.classList.add('shake-animation'); // start animation
    }

    function GuessModeInstructions() {
        return (
            <Row className='justify-content-center align-items-center'>
                <Col className={'col-1 p-2 ' + (kanjiPrompt["object"] === "kanji" ? 'guess-mode-instructions-kanji' : 'guess-mode-instructions-vocabulary')}>
                    <GuessModeText />
                </Col>
            </Row>
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
            return <KanjiPromptStyled promptText={acceptedMeaningPrompt} cssClass="kanjiPrompt-guessKanji" />;
        }
        return <KanjiPromptStyled promptText={kanjiPrompt['data']['slug']} cssClass="kanjiPrompt" />;
    }

    function KanjiPromptStyled(props) {
        return <div className={props.cssClass}>{props.promptText}</div>;
    }

    function AnswerResult(props) {
        return <div className={(kanjiPrompt && kanjiPrompt["promptMode"] === "kanji") ? 'answer-result-guessKanji' : 'answer-result'}>
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
            : "Correct!";
    }

    function getIncorrectText() {
        return kanjiPrompt["promptMode"] === "kanji"
            ? getAcceptedAnswers(kanjiPrompt).filter(answer => answer.primary)[0][getCurrentModeSingle(kanjiPrompt)] + " - " + kanjiPrompt['data']['slug']
            : getAcceptedAnswers(kanjiPrompt).map(answer => answer[getCurrentModeSingle(kanjiPrompt)]).join(', ')
    }

    function WrongAnswersRecap() {
        return (
            <ul className='wrongAnswerRecap'>
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
            <Row>
                <Col>
                    <Row>
                        <Col>
                            {wrongAnswers.length === 0 ? "Congratulations!" : <WrongAnswersRecap />}
                        </Col>
                    </Row>
                    <Row className="justify-content-center m-3">
                        <Col className='col-1 p-2 position-relative linkButton'>
                            <Link className='stretched-link linkButton' href="/">Go back</Link>
                        </Col>
                    </Row>
                </Col>
            </Row>
        );
    }

    return (
        <Row>
            <Col>
                <HeaderMenu endSessionHandler={endSession}
                    totalAnswers={totalAnswers} totalCorrect={totalCorrect}
                    totalReviews={promptSet.length} />
                <Row>
                    <Col className='AppBody'>
                        <Row>
                            <Col>
                                {kanjiPrompt && <GuessModeInstructions />}
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                {kanjiPrompt && <KanjiPrompt />}
                            </Col>
                        </Row>
                        {kanjiPrompt && kanjiPrompt["promptMode"] === "kanji" && kanjiPrompt["data"].hasOwnProperty("parts_of_speech") && (
                            <Row>
                                <Col className='mb-3'>
                                    {kanjiPrompt["data"]["parts_of_speech"].join(', ')}
                                </Col>
                            </Row>
                        )}
                        {answerState !== AnswerState.FINISHED && (
                            <>
                                <Row>
                                    <Col>
                                        <Form onSubmit={handleSubmit} autoComplete="off">
                                            <input type="text" id={ANSWER_INPUT_ID}
                                                className={answerState === AnswerState.ANSWERED ? answerResult === Result.CORRECT ? 'correct' : 'wrong' : ''}
                                                onKeyDown={handleKeyDown} />
                                        </Form>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <AnswerResult currentState={answerState} result={answerResult} />
                                    </Col>
                                </Row>
                            </>
                        )}
                        {answerState === AnswerState.FINISHED && <FinalResult />}
                        <Row className="justify-content-center">
                            <Col className="col-1">
                                <Confetti active={isExploding} config={confettiConfig} />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};

export default QuestionAnswerComponent;