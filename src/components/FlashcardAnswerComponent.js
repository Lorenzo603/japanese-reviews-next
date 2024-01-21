'use client'

import { useCallback, useEffect, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { HeaderMenu } from './HeaderMenuComponent';
import Confetti from 'react-dom-confetti';
import styles from '../app/page.module.css'
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

        if (e.key === ' ' && answerState === AnswerState.WAITING_RESPONSE) {
            flipFlashcard();
            return;
        }

        if (answerState === AnswerState.ANSWERED) {
            if (e.key === ' ' || e.key === 'c' || e.key === 'ArrowRight') {
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
        return <KanjiPromptStyled promptText={kanjiPrompt['data']['slug']} cssClass="kanjiPrompt" />;
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

        return <div className={'flashcard-result'}>
            <Row className='p-2'>
                <Col>
                    {getMeanings(kanjiPrompt).map(meaning => meaning['meaning']).join(', ')}
                </Col>
            </Row>
            {whitelistedMeanings.length > 0 &&
                <Row className='p-2'>
                    <Col>
                        {whitelistedMeanings.map(meaning => meaning['meaning']).join(', ')}
                    </Col>
                </Row>
            }
            {readingsKun.length > 0 &&
                <Row className='p-2'>
                    <Col>
                        {readingsKun.map(reading => reading['reading']).join(', ')}
                    </Col>
                </Row>
            }
            {readingsOn.length > 0 &&
                <Row className='p-2'>
                    <Col>
                        {readingsOn.map(reading => wanakana.toKatakana(reading['reading'])).join(', ')}
                    </Col>
                </Row>
            }
            {readingsNames.length > 0 &&
                <Row className='p-2'>
                    <Col>
                        Nanori: {readingsNames.map(reading => reading['reading']).join(', ')}
                    </Col>
                </Row>
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
                                {kanjiPrompt && <KanjiPrompt />}
                            </Col>
                        </Row>
                        {answerState === AnswerState.WAITING_RESPONSE && (
                            <Row>
                                <Col>
                                    <Button id={FLIP_BUTTON_ID} className='flip-button' onClick={flipFlashcard}>Flip</Button>
                                </Col>
                            </Row>
                        )}
                        {answerState === AnswerState.ANSWERED && (
                            <>
                                <Row className='justify-content-center'>
                                    <Col className='col-4'>
                                        <AnswerResult />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Button id={WRONG_ANSWER_BUTTON_ID} className='wrong-button' onClick={markAnswerWrong}>Wrong</Button>
                                    </Col>
                                    <Col>
                                        <Button id={CORRECT_ANSWER_BUTTON_ID} className='correct-button' onClick={markAnswerCorrect}>Correct</Button>
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

export default FlashcardAnswerComponent;