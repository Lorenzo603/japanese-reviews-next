'use client'

import { SSRProvider } from 'react-bootstrap';
import { Col, Container, Row } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import kanjiRaw from './kanji_full.json';
import vocabularyRaw from './vocabulary_full.json';
import { loadDictionary } from './DictionaryLoader';
import { SelectSettings } from '../components/SelectSettingsComponent';
import { QuestionAnswerComponent } from '../components/QuestionAnswerComponent';
import { GuessMode } from './GuessMode'
import { QuizSet } from './QuizSet'
import { useLocalStorage } from "./useLocalStorage";
import Image from 'next/image'
import styles from './page.module.css'

export default function Home() {

  const AppState = {
    SELECT_MODE: 0,
    QUESTION_ANSWER: 1,
  };

  const [appState, setAppState] = useState(AppState.SELECT_MODE);
  const [fullKanjiDictionary] = useState([]);
  const [fullVocabularyDictionary] = useState([]);
  const [kanjiSet, setKanjiSet] = useState([]);
  const [guessMode, setGuessMode] = useState(GuessMode.GUESS_MEANING);
  const [quizSet, setQuizSet] = useState(QuizSet.KANJI);
  const [selectedLevel, setSelectedLevel] = useLocalStorage("selectedLevel", 1);


  useEffect(() => {
    if (fullKanjiDictionary.length === 0) {
      fullKanjiDictionary.push(...loadDictionary(kanjiRaw));
      console.log('Loaded', fullKanjiDictionary.length, 'kanjis in the dictionary');
    }
    if (fullVocabularyDictionary.length === 0) {
      fullVocabularyDictionary.push(...loadDictionary(vocabularyRaw));
      console.log('Loaded', fullVocabularyDictionary.length, 'vocabs in the dictionary');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSetSelection(event) {
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
        if (quizSet === QuizSet.KANJI) {
          selectedSet = fullKanjiDictionary
            .filter(kanji => kanji['data']['level'] === Number(selectedLevel));
        } else {
          selectedSet = fullVocabularyDictionary
            .filter(vocab => vocab['data']['level'] === Number(selectedLevel));
        }
        break;
      default:
        selectedSet = fullKanjiDictionary
          .filter(kanji => kanji['data'].hasOwnProperty('categories'))
          .filter(kanji => kanji['data']['categories'].includes(dataOption));
        break;
    }

    setKanjiSet(selectedSet);
    setAppState(AppState.QUESTION_ANSWER);
  }

  function handleResetEvent() {
    setAppState(AppState.SELECT_MODE);
  }

  const guessModeMap = {
    "guess-meaning": GuessMode.GUESS_MEANING,
    "guess-reading": GuessMode.GUESS_READING,
    "guess-kanji": GuessMode.GUESS_KANJI,
  }

  const handleGuessModeSelection = (event) => {
    const selectedId = event.target.getAttribute('id');
    setGuessMode(guessModeMap[selectedId]);
  }

  const handleQuizSetSelection = (event) => {
    const selectedId = event.target.getAttribute('id');
    setQuizSet(selectedId === 'kanji-set' ? QuizSet.KANJI : QuizSet.VOCABULARY);
  }


  return (
    <SSRProvider>
      <Container fluid className='App'>
        <Row>
          <Col className='AppBody'>
            {
              appState === AppState.SELECT_MODE
                ? <SelectSettings handleGuessModeSelection={handleGuessModeSelection} handleQuizSetSelection={handleQuizSetSelection} handleSetSelection={handleSetSelection}
                  guessMode={guessMode} quizSet={quizSet} selectedLevel={selectedLevel} setSelectedLevel={setSelectedLevel} />
                : <QuestionAnswerComponent kanjis={kanjiSet} resetHandler={handleResetEvent} guessMode={guessMode} quizSet={quizSet} />
            }
          </Col>
        </Row>
      </Container>
    </SSRProvider>
  )
}
