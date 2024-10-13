'use client'

import { Col, Row, Form, Button } from 'react-bootstrap';
import { RadioSelectModeComponent } from './RadioSelectModeComponent';
import { SelectionOption } from './SelectionOptionComponent';
import styles from '../page.module.css'
import { useEffect, useState } from 'react';
import { SelectLevel } from './SelectLevelComponent';
import SelectModeButton from './SelectModeButtonComponent';
import { useQuizContext } from '@/app/context/quizContext';
import { setCookie, getCookie } from 'cookies-next';
import { LoadingSpinner } from './LoadingSpinner';

export const SelectSettings = (props) => {

    const [selectedSet, setSelectedSet] = useState('select-level');

    const {
        guessMeaningSelected, setGuessMeaningSelected,
        guessReadingSelected, setGuessReadingSelected,
        guessKanjiSelected, setGuessKanjiSelected,
        kanjiSetSelected, setKanjiSetSelected,
        vocabularySetSelected, setVocabularySetSelected,
        practiceMode, setPracticeMode } = useQuizContext();

    const [selectedLevel, setSelectedLevel] = useState(null);

    const [loading, setLoading] = useState(false);


    const handleLevelSelect = (newLastSelectedLevel) => {
        setSelectedLevel(newLastSelectedLevel);
        setCookie('lastSelectedLevel', newLastSelectedLevel, { sameSite: true });
        fetch('/api/accounts/lastSelectedLevel', {
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
            fetch('/api/accounts/lastSelectedLevel')
                .then((res) => res.json())
                .then((data) => {
                    console.log('GET last selected level:', data);
                    const newLastSelectedLevel = Number(data);
                    setSelectedLevel(newLastSelectedLevel);
                    setCookie('lastSelectedLevel', newLastSelectedLevel, { sameSite: true });
                })
                .catch((error) => {
                    console.log('ERROR getting the last selected level:', error);
                    setSelectedLevel(1);
                })
        }

    }, []);

    function onMeaningReadingFormSubmit(event) {
        setLoading(true);
        props.handleSetSelection(event);
    }

    return (
        <Row className='quiz-settings'>
            <Col>
                <Row><Col><h4 className='quiz-type-title'>Meaning and Reading</h4></Col></Row>
                <RadioSelectModeComponent title="Select Mode:">
                    <SelectModeButton key="guess-meaning" id="guess-meaning"
                        onClickHander={() => { setGuessMeaningSelected(!guessMeaningSelected) }}
                        checked={guessMeaningSelected}>
                        Guess Meaning
                    </SelectModeButton>
                    <SelectModeButton key="guess-reading" id="guess-reading"
                        onClickHander={() => { setGuessReadingSelected(!guessReadingSelected) }}
                        checked={guessReadingSelected}>
                        Guess Reading
                    </SelectModeButton>
                    <SelectModeButton key="guess-kanji" id="guess-kanji"
                        onClickHander={() => { setGuessKanjiSelected(!guessKanjiSelected) }}
                        checked={guessKanjiSelected}>
                        Guess Kanji
                    </SelectModeButton>
                </RadioSelectModeComponent>
                <div className='flex flex-row gap-x-4 items-center'>
                    <div className='text-lg'>
                        Select Set:
                    </div>
                    <button className={`p-2 ${selectedSet === 'select-level' ? 'bg-blue-600' : ''} hover:bg-blue-700`}
                        onClick={() => { setSelectedSet('select-level') }}>Select Level</button>
                    <button className={`p-2 ${selectedSet === 'preconfigured-sets' ? 'bg-blue-600' : ''} hover:bg-blue-700`}
                        onClick={() => { setSelectedSet('preconfigured-sets') }}>Preconfigured sets</button>
                </div>

                {selectedSet == 'select-level' ?
                    <>
                        <RadioSelectModeComponent title="Select Quiz Set:">
                            <SelectModeButton key="kanji-set" id="kanji-set"
                                onClickHander={() => { setKanjiSetSelected(!kanjiSetSelected) }}
                                checked={kanjiSetSelected}>
                                Kanjis
                            </SelectModeButton>
                            <SelectModeButton key="vocabulary-set" id="vocabulary-set"
                                onClickHander={() => { setVocabularySetSelected(!vocabularySetSelected) }}
                                checked={vocabularySetSelected}>
                                Vocab
                            </SelectModeButton>
                        </RadioSelectModeComponent>
                        <Row className='align-items-center p-3'>
                            <Col className="col-8">
                                <Form id="meaning-reading-form" onSubmit={onMeaningReadingFormSubmit} data-option={'level'}
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
                    <div className='flex flex-col mt-4'>
                        <SelectionOption handleSetSelectionCallback={props.handleSetSelection} dataOption={'jlpt5'}>JLPT N5</SelectionOption>
                        <SelectionOption handleSetSelectionCallback={props.handleSetSelection} dataOption={'jlpt4'}>JLPT N4</SelectionOption>
                        <SelectionOption handleSetSelectionCallback={props.handleSetSelection} dataOption={'jlpt3'}>JLPT N3</SelectionOption>
                        <SelectionOption handleSetSelectionCallback={props.handleSetSelection} dataOption={'jlpt2'}>JLPT N2</SelectionOption>
                        <SelectionOption handleSetSelectionCallback={props.handleSetSelection} dataOption={'full-kanji'}>Full Kanji Set</SelectionOption>
                        <SelectionOption handleSetSelectionCallback={props.handleSetSelection} dataOption={'full-vocab'}>Full Vocabulary Set</SelectionOption>
                        <SelectionOption handleSetSelectionCallback={props.handleSetSelection} dataOption={'test'}>Test</SelectionOption>
                    </div>
                }
            </Col>
        </Row>

    );
}


export default SelectSettings;