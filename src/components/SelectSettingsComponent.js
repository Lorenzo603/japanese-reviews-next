'use client'

import { Col, Row, Form, Button } from 'react-bootstrap';
import { RadioSelectModeComponent } from './RadioSelectModeComponent';
import { SelectionOption } from './SelectionOptionComponent';
import styles from '../app/page.module.css'
import { useEffect, useState } from 'react';
import { SelectLevel } from './SelectLevelComponent';
import SelectModeButton from './SelectModeButtonComponent';
import { useQuizContext } from '@/app/context/quizContext';
// import { useLocalStorage } from "./useLocalStorage";
import { setCookie, getCookie } from 'cookies-next';
import { LoadingSpinner } from './LoadingSpinner';
import MultiRangeSliderComponent from './MultiRangeSlider/MultiRangeSliderComponent';

export const SelectSettings = (props) => {

    const [selectedSet, setSelectedSet] = useState('select-level');

    const {
        guessMeaningSelected, setGuessMeaningSelected,
        guessReadingSelected, setGuessReadingSelected,
        guessKanjiSelected, setGuessKanjiSelected,
        kanjiSetSelected, setKanjiSetSelected,
        vocabularySetSelected, setVocabularySetSelected,
        practiceMode, setPracticeMode } = useQuizContext();

    // const [selectedLevel, setSelectedLevel] = useLocalStorage("selectedLevel", 1);
    const [selectedLevel, setSelectedLevel] = useState(null);

    const [loading, setLoading] = useState(false);

    const handleLevelSelect = (newLastSelectedLevel) => {
        setSelectedLevel(newLastSelectedLevel);
        setCookie('lastSelectedLevel', newLastSelectedLevel, { sameSite: true });
        fetch('/api/accounts', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ newLastSelectedLevel: newLastSelectedLevel })
        })
            .then((res) => {
                console.log('POST update last selected level response status:', res.status);
                res.json();
            })
    }

    const isStartQuizButtonDisabled = () => {
        return loading
            || (!guessMeaningSelected && !guessReadingSelected && !guessKanjiSelected)
            || (!kanjiSetSelected && !vocabularySetSelected)
    }

    useEffect(() => {
        const newLastSelectedLevel = getCookie('lastSelectedLevel');
        if (newLastSelectedLevel !== undefined) {
            setSelectedLevel(newLastSelectedLevel);
        } else {
            fetch('/api/accounts')
                .then((res) => res.json())
                .then((data) => {
                    console.log('GET last selected level:', data);
                    const newLastSelectedLevel = Number(data[0].last_selected_level);
                    setSelectedLevel(newLastSelectedLevel);
                    setCookie('lastSelectedLevel', newLastSelectedLevel, { sameSite: true });
                })
                .catch((error) => {
                    console.log('ERROR getting the last selected level:', error);
                    setSelectedLevel(1);
                })
        }

    }, []);

    function onFormSubmit(event) {
        setLoading(true);
        props.handleSetSelection(event);
    }

    return (
        <>
            <Row className='quiz-settings'>
                <Col>
                    <RadioSelectModeComponent title="Select Mode:">
                        <Col className='col-2'>
                            <SelectModeButton key="guess-meaning" id="guess-meaning"
                                onClickHander={() => { setGuessMeaningSelected(!guessMeaningSelected) }}
                                checked={guessMeaningSelected}>
                                Guess Meaning
                            </SelectModeButton>
                        </Col>
                        <Col className='col-2'>
                            <SelectModeButton key="guess-reading" id="guess-reading"
                                onClickHander={() => { setGuessReadingSelected(!guessReadingSelected) }}
                                checked={guessReadingSelected}>
                                Guess Reading
                            </SelectModeButton>
                        </Col>
                        <Col className='col-2'>
                            <SelectModeButton key="guess-kanji" id="guess-kanji"
                                onClickHander={() => { setGuessKanjiSelected(!guessKanjiSelected) }}
                                checked={guessKanjiSelected}>
                                Guess Kanji
                            </SelectModeButton>
                        </Col>
                    </RadioSelectModeComponent>
                    <Row className='align-items-center p-3'>
                        <Col className='col-4 select-title'>
                            Select Set:
                        </Col>
                        <Col className='col-4'>
                            <Button className={selectedSet === 'select-level' ? 'selected-set-button-checked' : 'selected-set-button'}
                                onClick={() => { setSelectedSet('select-level') }}>Select Level</Button>
                        </Col>
                        <Col className='col-4'>
                            <Button className={selectedSet === 'preconfigured-sets' ? 'selected-set-button-checked' : 'selected-set-button'}
                                onClick={() => { setSelectedSet('preconfigured-sets') }}>Preconfigured sets</Button>
                        </Col>
                    </Row>

                    {selectedSet == 'select-level' ?
                        <>
                            <RadioSelectModeComponent title="Select Quiz Set:">
                                <Col className='col-2'>
                                    <SelectModeButton key="kanji-set" id="kanji-set"
                                        onClickHander={() => { setKanjiSetSelected(!kanjiSetSelected) }}
                                        checked={kanjiSetSelected}>
                                        Kanjis
                                    </SelectModeButton>
                                </Col>
                                <Col className='col-2'>
                                    <SelectModeButton key="vocabulary-set" id="vocabulary-set"
                                        onClickHander={() => { setVocabularySetSelected(!vocabularySetSelected) }}
                                        checked={vocabularySetSelected}>
                                        Vocab
                                    </SelectModeButton>
                                </Col>
                            </RadioSelectModeComponent>
                            <Row className='align-items-center p-3'>
                                <Col className="col-8">
                                    <Form onSubmit={onFormSubmit} data-option={'level'}
                                        data-guess-meaning-selected={guessMeaningSelected}
                                        data-guess-reading-selected={guessReadingSelected}
                                        data-guess-kanji-selected={guessKanjiSelected}
                                        data-kanjiset-selected={kanjiSetSelected}
                                        data-vocabularyset-selected={vocabularySetSelected}
                                        data-selected-level={selectedLevel}>
                                        <Row className='justify-content-end align-items-center p-2'>
                                            <Col className="col-4 level-label">
                                                Level:
                                            </Col>
                                            <Col className='col-4'>
                                                <SelectLevel level={selectedLevel} handleLevelSelect={handleLevelSelect} />
                                            </Col>
                                        </Row>
                                        <Row className='justify-content-end align-items-center p-2'>
                                            <Col className="col-4 level-label">
                                                Practice Mode:
                                            </Col>
                                            <Col className='col-4'>
                                                <div className="form-check form-switch">
                                                    <input className="form-check-input" type="checkbox" role="switch" id="practiceModeCheck"
                                                        checked={practiceMode === true} onChange={() => { setPracticeMode(!practiceMode) }} />
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row className='justify-content-end'>
                                            <Col className='col-4 p-2 d-flex flex-column'>
                                                <Button type='submit' className='start-quiz-button'
                                                    disabled={isStartQuizButtonDisabled()}>
                                                    {loading ? <LoadingSpinner className="loading-spinner" /> : 'Start Quiz'}
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Form>
                                </Col>
                            </Row>
                        </>
                        :
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
                    }
                </Col>
            </Row>

            <Row className='quiz-settings'>
                <Col>
                    <Row><Col>Visually similar Kanjis</Col></Row>

                    <Row>
                        <Col>
                            <MultiRangeSliderComponent
                                min={1}
                                max={60}
                                onChange={({ min, max }) => console.log(`min = ${min}, max = ${max}`)}
                            />
                        </Col>
                        <Col>
                            <Button>Start Quiz</Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    );
}


export default SelectSettings;