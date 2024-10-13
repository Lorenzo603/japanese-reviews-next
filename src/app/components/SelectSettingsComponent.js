'use client'

import { Form } from 'react-bootstrap';
import { RadioSelectModeComponent } from './RadioSelectModeComponent';
import { SelectionOption } from './SelectionOptionComponent';
import { useEffect, useState } from 'react';
import { SelectLevel } from './SelectLevelComponent';
import SelectModeButton from './SelectModeButtonComponent';
import { useQuizContext } from '@/app/context/quizContext';
import { setCookie, getCookie } from 'cookies-next';
import { LoadingSpinner } from './LoadingSpinner';
import StartQuizButton from '../(dashboard)/components/StartQuizButton';

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
        console.log('newLastSelectedLevel:', newLastSelectedLevel);
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
        <div className='p-4 rounded-md border-2 border-blue-600'>
            <h4>Meaning and Reading</h4>
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
                    <div>
                        <Form id="meaning-reading-form" onSubmit={onMeaningReadingFormSubmit} data-option={'level'}
                            data-guess-meaning-selected={guessMeaningSelected}
                            data-guess-reading-selected={guessReadingSelected}
                            data-guess-kanji-selected={guessKanjiSelected}
                            data-kanjiset-selected={kanjiSetSelected}
                            data-vocabularyset-selected={vocabularySetSelected}
                            data-selected-level={selectedLevel}>
                            <div className='flex flex-row justify-center items-center gap-x-2'>
                                <div>
                                    Level:
                                </div>
                                <div>
                                    <SelectLevel level={selectedLevel} handleLevelSelect={handleLevelSelect} />
                                </div>
                            </div>
                            <div className='flex flex-row justify-center items-center gap-x-2'>
                                <div>
                                    Practice Mode:
                                </div>
                                <div>
                                    <div className="inline-flex items-center justify-center">
                                        <label className="font-medium transition-colors duration-300 ease-in-out peer-disabled:opacity-70 text-xs flex items-center">
                                            <div className="relative">
                                                <input role="switch" id="switch-1" className="peer sr-only" aria-label="Checked" aria-checked="true"
                                                    checked={practiceMode ? 'checked' : ''}
                                                    type="checkbox" onChange={() => { setPracticeMode(!practiceMode) }} name="switch" />
                                                {/* Toggle background */}
                                                <div className="block cursor-pointer rounded-full 
                                                            border-1 border-slate-300 bg-slate-800 
                                                            transition duration-300 
                                                            peer-checked:bg-blue-600 peer-checked:border-blue-600 
                                                            h-6 w-12">
                                                </div>
                                                {/* Toggle ball */}
                                                <div className="absolute top-0.5 z-10 cursor-pointer rounded-full 
                                                            bg-slate-900 transition duration-300 
                                                            peer-checked:translate-x-5 peer-checked:bg-white 
                                                            left-[3px] size-5 peer-checked:left-[5px]">
                                                </div>
                                            </div>
                                            {/* <span className="ml-2 cursor-pointer whitespace-nowrap text-xs font-medium leading-none text-black">Checked</span> */}
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <StartQuizButton loading={loading} disabled={isStartQuizButtonDisabled()} />
                            </div>
                        </Form>
                    </div>
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
        </div>

    );
}


export default SelectSettings;