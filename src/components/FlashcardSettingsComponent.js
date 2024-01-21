'use client'

import { Col, Row, Form, Button } from 'react-bootstrap';
import { SelectionOption } from './SelectionOptionComponent';
import styles from '../app/page.module.css'
import { useEffect, useState } from 'react';
import { SelectLevel } from './SelectLevelComponent';
import { setCookie, getCookie } from 'cookies-next';
import { LoadingSpinner } from './LoadingSpinner';

export const FlashcardSettings = (props) => {

    const [selectedSet, setSelectedSet] = useState('select-level');

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
        return loading;
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

    function onFlashcardFormSubmit(event) {
        setLoading(true);
        props.handleFlashcardFormSubmission(event);
    }

    return (
        <Row className='quiz-settings'>
            <Col>
                <Row><Col><h4 className='quiz-type-title'>Flashcards</h4></Col></Row>

                {selectedSet == 'select-level' ?
                    <Row className='align-items-center p-3'>
                        <Col className="col-8">
                            <Form id="flashcard-form" onSubmit={onFlashcardFormSubmit} data-selected-level={selectedLevel}>
                                <Row className='justify-content-end align-items-center p-2'>
                                    <Col className="col-4 level-label">
                                        Level:
                                    </Col>
                                    <Col className='col-4'>
                                        <SelectLevel level={selectedLevel} handleLevelSelect={handleLevelSelect} />
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
                    :
                    <Row className='mt-4'>
                        <Col>
                            <SelectionOption handleSetSelectionCallback={props.handleSetSelection} dataOption={'jlpt5'}>JLPT N5</SelectionOption>
                            <SelectionOption handleSetSelectionCallback={props.handleSetSelection} dataOption={'jlpt4'}>JLPT N4</SelectionOption>
                            <SelectionOption handleSetSelectionCallback={props.handleSetSelection} dataOption={'jlpt3'}>JLPT N3</SelectionOption>
                            <SelectionOption handleSetSelectionCallback={props.handleSetSelection} dataOption={'jlpt2'}>JLPT N2</SelectionOption>
                            <SelectionOption handleSetSelectionCallback={props.handleSetSelection} dataOption={'full-kanji'}>Full Kanji Set</SelectionOption>
                            <SelectionOption handleSetSelectionCallback={props.handleSetSelection} dataOption={'full-vocab'}>Full Vocabulary Set</SelectionOption>
                            <SelectionOption handleSetSelectionCallback={props.handleSetSelection} dataOption={'test'}>Test</SelectionOption>
                        </Col>
                    </Row>
                }
            </Col>
        </Row>

    );
}


export default FlashcardSettings;