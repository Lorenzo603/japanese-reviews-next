'use client'

import { Col, Container, Row } from 'react-bootstrap';
import { SelectSettings } from '@/app/components/SelectSettingsComponent';
import styles from '../page.module.css'
import { useRouter } from 'next/navigation';
import { useQuizContext } from '@/app/context/quizContext';
import PendingReviewsComponent from '@/app/components/PendingReviewsComponent';
import VisuallySimilarKanji from '@/app/components/VisuallySimilarKanjiComponent';
import FlashcardSettings from '@/app/components/FlashcardSettingsComponent';


export default function Dashboard() {

    const { setPromptSet, setReviewMode, reviewSet } = useQuizContext();

    const router = useRouter();

    async function handleSetSelection(event) {
        event.preventDefault();

        const dataOption = event.target.getAttribute('data-option');
        const selectedLevel = Number(event.target.getAttribute('data-selected-level'));
        const kanjiSetSelected = event.target.getAttribute('data-kanjiset-selected') === "true"
        const vocabularySetSelected = event.target.getAttribute('data-vocabularyset-selected') === "true"
        const guessMeaningSelected = event.target.getAttribute('data-guess-meaning-selected') === "true";
        const guessReadingSelected = event.target.getAttribute('data-guess-reading-selected') === "true";
        const guessKanjiSelected = event.target.getAttribute('data-guess-kanji-selected') === "true";

        let promptSetResponse = await (await fetch('/api/quiz/prompts', {
            method: 'post',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                dataOption: dataOption,
                selectedLevel: selectedLevel,
                kanjiSetSelected: kanjiSetSelected,
                vocabularySetSelected: vocabularySetSelected,
                guessMeaningSelected: guessMeaningSelected,
                guessReadingSelected: guessReadingSelected,
                guessKanjiSelected: guessKanjiSelected,
                reviewSetElementIds: reviewSet.map(review => review.element_id)
            })
        })).json();

        setReviewMode(dataOption === "review");
        setPromptSet(promptSetResponse);
        router.push('/dashboard/quiz');

    }

    async function handleLevelSelection(minLevel, maxLevel) {

        const fullKanjiSetResponse = await (await fetch('/api/quiz/prompts', {
            method: 'post',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                dataOption: "full-kanji",
                kanjiSetSelected: true,
                guessMeaningSelected: true,
                guessReadingSelected: true
            })
        })).json();

        const levelSet = fullKanjiSetResponse
            .filter(kanji => minLevel <= kanji['data']['level'] && kanji['data']['level'] <= maxLevel)
            .filter(kanji => kanji['data']['visually_similar_subject_ids'].length > 0)

        // fetch 'visually_similar_subject_ids' in other levels
        const visuallySimilarKanjis = [...new Set(levelSet.flatMap(kanji => kanji['data']['visually_similar_subject_ids']))]
            .flatMap(kanjiId => fullKanjiSetResponse.filter(kanji => kanji['id'] === kanjiId));

        levelSet.push(...visuallySimilarKanjis)
        // console.log('Visually Similar Kanji set: ', levelSet);

        setPromptSet(levelSet);
        router.push('/dashboard/quiz');
    }

    async function handleFlashcardFormSubmission(event) {
        event.preventDefault();

        const selectedLevel = Number(event.target.getAttribute('data-selected-level'));

        let promptSetResponse = await (await fetch('/api/quiz/prompts', {
            method: 'post',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                dataOption: 'level',
                selectedLevel: selectedLevel,
                kanjiSetSelected: true,
                vocabularySetSelected: true,
                guessMeaningSelected: true,
            })
        })).json();

        setPromptSet(promptSetResponse);
        router.push('/dashboard/flashcards');

    }

    return (

        <Container fluid className='App'>
            <Row>
                <Col className='AppBody'>
                    <Row className='justify-content-center'>
                        <Col className='col-6'>
                            <SelectSettings handleSetSelection={handleSetSelection} />
                            <VisuallySimilarKanji handleLevelSelection={handleLevelSelection} />
                            <FlashcardSettings handleFlashcardFormSubmission={handleFlashcardFormSubmission} />
                        </Col>
                        <Col className='col-3'>
                            <PendingReviewsComponent handleSetSelection={handleSetSelection} />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}