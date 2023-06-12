import Image from 'next/image'
import styles from './page.module.css'

export default function Home() {
  return (
    <Container fluid className='App'>
      <Row>
        <Col className='App-body'>
          {/* {
            appState === AppState.SELECT_MODE
              ? <SelectSettings handleGuessModeSelection={handleGuessModeSelection} handleQuizSetSelection={handleQuizSetSelection} handleSetSelection={handleSetSelection}
                guessMode={guessMode} quizSet={quizSet} selectedLevel={selectedLevel} setSelectedLevel={setSelectedLevel} />
              : <QuestionAnswerComponent kanjis={kanjiSet} resetHandler={handleResetEvent} guessMode={guessMode} quizSet={quizSet} />
          } */}
          Hello
        </Col>
      </Row>
    </Container>
  )
}
