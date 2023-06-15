'use client'

import { Col, Row, Form, Button, Popover, OverlayTrigger, Tab, Tabs } from 'react-bootstrap';
import { PendingReviewsComponent } from './PendingReviewsComponent';
import { RadioSelectModeComponent } from './RadioSelectModeComponent';
import { SelectionOption } from './SelectionOptionComponent';
import { GuessMode } from '../app/GuessMode'
import { QuizSet } from '../app/QuizSet'
import styles from '../app/page.module.css'
import { useEffect, useState } from 'react';
// import { useLocalStorage } from "./useLocalStorage";

export const SelectSettings = (props) => {

    const [quizSet, setQuizSet] = useState(QuizSet.KANJI);
    const [guessMode, setGuessMode] = useState(GuessMode.GUESS_MEANING);
    const guessModeMap = {
        "guess-meaning": GuessMode.GUESS_MEANING,
        "guess-reading": GuessMode.GUESS_READING,
        "guess-kanji": GuessMode.GUESS_KANJI,
    }
    // const [selectedLevel, setSelectedLevel] = useLocalStorage("selectedLevel", 1);
    const [selectedLevel, _setSelectedLevel] = useState(1);
    const setSelectedLevel = (newLastSelectedLevel) => {
        _setSelectedLevel(newLastSelectedLevel);
        fetch('/api/accounts', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ newLastSelectedLevel: newLastSelectedLevel })
        })
            .then((res) => {
                console.log('POST last selected level response status:', res.status);
                res.json();
            })
    }

    const handleGuessModeSelection = (event) => {
        const selectedId = event.target.getAttribute('id');
        setGuessMode(guessModeMap[selectedId]);
    }

    const handleQuizSetSelection = (event) => {
        const selectedId = event.target.getAttribute('id');
        setQuizSet(selectedId === 'kanji-set' ? QuizSet.KANJI : QuizSet.VOCABULARY);
    }

    function handleLevelNumberClick(index) {
        setSelectedLevel(index);
        document.body.click();
    }

    const popover = (
        <Popover id="popover-basic">
            <Popover.Body>
                <Row>
                    {Array.from({ length: 61 }, (_, i) => i + 1).map(index => {
                        return (
                            <Col key={'level-number-' + index} className='col-2 level-number'>
                                <Button onClick={() => { handleLevelNumberClick(index); }}>{index}</Button>
                            </Col>
                        );
                    })}
                </Row>
            </Popover.Body>
        </Popover>
    );

    const selectModeOptions = {
        "title": "Select Mode:",
        "onClickHandler": handleGuessModeSelection,
        "options": [
            {
                "id": "guess-meaning",
                "label": "Guess Meaning",
                "isChecked": () => { return guessMode === GuessMode.GUESS_MEANING },
            },
            {
                "id": "guess-reading",
                "label": "Guess Reading",
                "isChecked": () => { return guessMode === GuessMode.GUESS_READING },
            },
            {
                "id": "guess-kanji",
                "label": "Guess Kanji",
                "isChecked": () => { return guessMode === GuessMode.GUESS_KANJI },
            },
        ],
    };

    const selectQuizSetOptions = {
        "title": "",
        "onClickHandler": handleQuizSetSelection,
        "options": [
            {
                "id": "kanji-set",
                "label": "Kanjis",
                "isChecked": () => { return quizSet === QuizSet.KANJI },
            },
            {
                "id": "vocabulary-set",
                "label": "Vocab",
                "isChecked": () => { return quizSet === QuizSet.VOCABULARY },
            },
        ],
    };

    useEffect(() => {
        fetch('/api/accounts')
            .then((res) => res.json())
            .then((data) => {
                console.log('GET last selected level:', data);
                setSelectedLevel(Number(data[0].last_selected_level));
            })
    }, []);

    return (
        <Row>
            <Col className='AppBody'>
                <PendingReviewsComponent handleSetSelection={props.handleSetSelection} />
                <RadioSelectModeComponent config={selectModeOptions} />
                <Row className='select-title'>
                    <Col>
                        Select Set:
                    </Col>
                </Row>
                <Row className='justify-content-center'>
                    <Col className='col-4'>
                        <Tabs variant="pills" justify>
                            <Tab eventKey="level-select" title="Select Level">
                                <RadioSelectModeComponent config={selectQuizSetOptions} />
                                <Row className='mt-4 justify-content-center'>
                                    <Col className="col-4">
                                        <Form onSubmit={props.handleSetSelection} data-option={'level'} 
                                        data-selected-level={selectedLevel} data-quiz-set={quizSet} data-guess-mode={guessMode}>
                                            <Row className='justify-content-center align-items-center'>
                                                <Col className="level-label">
                                                    Level:
                                                </Col>
                                                <Col>
                                                    <OverlayTrigger variant="dark" trigger="click" placement="right" rootClose="true" overlay={popover}>
                                                        <Button className='selectedLevel'>{selectedLevel}</Button>
                                                    </OverlayTrigger>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col className='col-12 mt-4'>
                                                    <Button type='submit' className='start-quiz-button'>Start Quiz</Button>
                                                </Col>
                                            </Row>
                                        </Form>
                                    </Col>
                                </Row>
                            </Tab>
                            <Tab eventKey="preconfigured-set-select" title="Preconfigured sets">
                                <Row className='mt-4'>
                                    <Col>
                                        <SelectionOption handleSetSelectionCallback={props.handleSetSelection} dataOption={'jlpt5'}>JLPT N5</SelectionOption>
                                        <SelectionOption handleSetSelectionCallback={props.handleSetSelection} dataOption={'jlpt4'}>JLPT N4</SelectionOption>
                                        <SelectionOption handleSetSelectionCallback={props.handleSetSelection} dataOption={'jlpt3'}>JLPT N3</SelectionOption>
                                        <SelectionOption handleSetSelectionCallback={props.handleSetSelection} dataOption={'jlpt2'}>JLPT N2</SelectionOption>
                                        <SelectionOption handleSetSelectionCallback={props.handleSetSelection} dataOption={'full'}>Full Kanji Set</SelectionOption>
                                        <SelectionOption handleSetSelectionCallback={props.handleSetSelection} dataOption={'full-vocab'}>Full Vocabulary Set</SelectionOption>
                                        <SelectionOption handleSetSelectionCallback={props.handleSetSelection} dataOption={'test'}>Test</SelectionOption>
                                    </Col>
                                </Row>
                            </Tab>
                        </Tabs>
                    </Col>
                </Row>

            </Col>
        </Row>
    );
}


export default SelectSettings;