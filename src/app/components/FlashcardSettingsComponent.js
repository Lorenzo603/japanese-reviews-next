'use client'

import { SelectionOption } from './SelectionOptionComponent';
import { useEffect, useState } from 'react';
import { SelectLevel } from './SelectLevelComponent';
import { setCookie, getCookie } from 'cookies-next';
import StartQuizButton from '../(dashboard)/components/StartQuizButton';

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
        <div className='p-4 rounded-md border-2 border-blue-600'>
            <h4>Flashcards</h4>

            {selectedSet == 'select-level' ?
                <div>
                    <form id="flashcard-form" onSubmit={onFlashcardFormSubmit} data-selected-level={selectedLevel}>
                        <div className='flex flex-row justify-center items-center gap-x-2'>
                            <div>
                                Level:
                            </div>
                            <div>
                                <SelectLevel level={selectedLevel} handleLevelSelect={handleLevelSelect} />
                            </div>
                        </div>
                        <div>
                            <StartQuizButton loading={loading} disabled={isStartQuizButtonDisabled()} />
                        </div>
                    </form>
                </div>
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
        </div>

    );
}


export default FlashcardSettings;