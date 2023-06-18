'use client'

import { SSRProvider } from 'react-bootstrap';
import { Col, Container, Row } from 'react-bootstrap';
import { SelectSettings } from '../components/SelectSettingsComponent';
import styles from './page.module.css'
import { useRouter } from 'next/navigation';
import { useQuizContext } from './context/quizContext';
import PendingReviewsComponent from '@/components/PendingReviewsComponent';


export default function Home() {

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
    router.push('/quiz');

  }

  return (
    <SSRProvider>
      <Container fluid className='App'>
        <Row>
          <Col className='AppBody'>
            <Row className='justify-content-center'>
              <Col className='col-6'>
                <SelectSettings handleSetSelection={handleSetSelection} />
              </Col>
              <Col className='col-2'>
                <PendingReviewsComponent handleSetSelection={handleSetSelection} />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </SSRProvider>

  )
}
