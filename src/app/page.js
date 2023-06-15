'use client'

import { SSRProvider } from 'react-bootstrap';
import { Col, Container, Row } from 'react-bootstrap';
import kanjiRaw from './kanji_full.json';
import vocabularyRaw from './vocabulary_full.json';
import { loadDictionary } from './DictionaryLoader';
import { SelectSettings } from '../components/SelectSettingsComponent';
import styles from './page.module.css'
import { useEffect } from 'react';
import QuizSet from './QuizSet';
import { useRouter } from 'next/navigation';
import { useQuizContext } from './context/quizContext';

export default function Home() {

  const router = useRouter();

  const fullKanjiDictionary = [];
  const fullVocabularyDictionary = [];
  const {kanjiSet, setKanjiSet} = useQuizContext();

  useEffect(() => {
    if (fullKanjiDictionary.length === 0) {
      fullKanjiDictionary.push(...loadDictionary(kanjiRaw));
      console.log('Loaded', fullKanjiDictionary.length, 'kanjis in the dictionary');
    }
    if (fullVocabularyDictionary.length === 0) {
      fullVocabularyDictionary.push(...loadDictionary(vocabularyRaw));
      console.log('Loaded', fullVocabularyDictionary.length, 'vocabs in the dictionary');
    }

  }, []);


  function handleSetSelection(event) {
    event.preventDefault();
    let reviewMode = false;
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
        console.log("selectedSet:", selectedSet);
        reviewMode = true;
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
            <SelectSettings handleSetSelection={handleSetSelection} />
          </Col>
        </Row>
      </Container>
    </SSRProvider>

  )
}
