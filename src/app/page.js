'use client'

import { SSRProvider } from 'react-bootstrap';
import { Col, Container, Row } from 'react-bootstrap';
import { SelectSettings } from '../components/SelectSettingsComponent';
import styles from './page.module.css'
import { useEffect } from 'react';
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


  const { setPromptSet, setReviewMode, reviewSet } = useQuizContext();

  // TODO do this on backend:
  //
  function handleSetSelection(event) {
    event.preventDefault();

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
        const kanjiSetSelected = event.target.getAttribute('data-kanjiset-selected') === "true"
        const vocabularySetSelected = event.target.getAttribute('data-vocabularyset-selected') === "true"
        if (kanjiSetSelected) {
          selectedSet.push(
            ...fullKanjiDictionary
              .filter(kanji => kanji['data']['level'] === selectedLevel)
          );
        }
        if (vocabularySetSelected) {
          selectedSet.push(
            ...fullVocabularyDictionary
              .filter(vocab => vocab['data']['level'] === selectedLevel)
          );
        }
        break;
      case "review":
        const elementIds = reviewSet.map(review => review.element_id);
        console.log("Review element ids:", elementIds);
        const selectedKanji = fullKanjiDictionary.filter(kanji => elementIds.includes(kanji['id']));
        const selectedVocabulary = fullVocabularyDictionary.filter(vocab => elementIds.includes(vocab['id']));
        selectedSet = selectedKanji.concat(selectedVocabulary);
        setReviewMode(true);
        break;
      default:
        selectedSet = fullKanjiDictionary
          .filter(kanji => kanji['data'].hasOwnProperty('categories'))
          .filter(kanji => kanji['data']['categories'].includes(dataOption));
        break;
    }

    const guessMeaningSelected = event.target.getAttribute('data-guess-meaning-selected') === "true";
    const guessReadingSelected = event.target.getAttribute('data-guess-reading-selected') === "true";
    const guessKanjiSelected = event.target.getAttribute('data-guess-kanji-selected') === "true";

    const promptSet = []
    if (guessMeaningSelected || dataOption === "review") {
      const cloneSet = structuredClone(selectedSet);
      cloneSet.forEach(prompt => { prompt.promptMode = "meaning" });
      promptSet.push(...cloneSet);
    }

    if (guessReadingSelected || dataOption === "review") {
      const cloneSet = structuredClone(selectedSet);
      cloneSet
        .filter(prompt => prompt.data.hasOwnProperty('readings'))
        .forEach((prompt) => { prompt.promptMode = "reading" });
      promptSet.push(...cloneSet);
    }

    if (guessKanjiSelected) {
      const cloneSet = structuredClone(selectedSet);
      cloneSet.forEach((prompt) => { prompt.promptMode = "kanji" });
      promptSet.push(...cloneSet);
    }

    setPromptSet(promptSet);
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
