'use client'

import { SSRProvider } from 'react-bootstrap';
import { Col, Container, Row } from 'react-bootstrap';
import { SelectSettings } from '../components/SelectSettingsComponent';
import styles from './page.module.css'
import { useEffect } from 'react';
import QuizSet from './QuizSet';
import { useRouter } from 'next/navigation';
import { useQuizContext } from './context/quizContext';
import { useDictionaryContext } from './context/dictionaryContext';
import PendingReviewsComponent from '@/components/PendingReviewsComponent';


export default function Home() {

  const router = useRouter();

  const { fullKanjiDictionary, fullVocabularyDictionary } = useDictionaryContext();

  useEffect(() => {
    const loadDictionaries = (dictionaryId, callback) => {
      fetch('/api/dictionary/' + dictionaryId)
        .then((res) => res.json())
        .then(callback);
    }

    if (fullKanjiDictionary.length === 0) {
      loadDictionaries('kanji_full', (data) => {
        fullKanjiDictionary.push(...JSON.parse(data));
        console.log('Loaded', fullKanjiDictionary.length, 'kanjis in the dictionary');
      });
    }

    if (fullVocabularyDictionary.length === 0) {
      loadDictionaries('vocabulary_full', (data) => {
        fullVocabularyDictionary.push(...JSON.parse(data));
        console.log('Loaded', fullVocabularyDictionary.length, 'vocabs in the dictionary');
      });
    }
  }, [])


  const { kanjiSet, setKanjiSet, guessMode, setGuessMode, reviewMode, setReviewMode } = useQuizContext();

  function handleSetSelection(event) {
    event.preventDefault();
    setGuessMode(event.target.getAttribute('data-guess-mode'));
    setReviewMode(false);
    const dataOption = event.target.getAttribute('data-option');
    let selectedSet = [];
    switch (dataOption) {
      case "full-vocab":
        selectedSet = fullVocabularyDictionary;
        break;
      case "full":
        selectedSet = fullKanjiDictionary;
        break;
      case "level":
        const selectedLevel = Number(event.target.getAttribute('data-selected-level'));
        const quizSet = Number(event.target.getAttribute('data-quiz-set'));
        if (quizSet === QuizSet.KANJI) {
          selectedSet = fullKanjiDictionary
            .filter(kanji => kanji['data']['level'] === selectedLevel);
        } else {
          selectedSet = fullVocabularyDictionary
            .filter(vocab => vocab['data']['level'] === selectedLevel);
        }
        break;
      case "review":
        const elementIds = event.target.getAttribute('data-review-set').split(',').map(elementId => Number(elementId));
        console.log("element ids:", elementIds);
        const selectedKanji = fullKanjiDictionary.filter(kanji => elementIds.includes(kanji['id']));
        const selectedVocabulary = fullVocabularyDictionary.filter(vocab => elementIds.includes(vocab['id']));
        selectedSet = selectedKanji.concat(selectedVocabulary);
        // console.log("selectedSet:", selectedSet);
        // setGuessMode(); // TODO implement GUESS_BOTH mode.
        setReviewMode(true);
        break;
      default:
        selectedSet = fullKanjiDictionary
          .filter(kanji => kanji['data'].hasOwnProperty('categories'))
          .filter(kanji => kanji['data']['categories'].includes(dataOption));
        break;
    }


    setKanjiSet(JSON.stringify(selectedSet));
    router.push('/quiz');

  }

  return (
    <SSRProvider>
      <Container fluid className='App'>
        <Row>
          <Col className='AppBody'>
            <Row className='justify-content-center'>
              <Col className='col-8'>
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
