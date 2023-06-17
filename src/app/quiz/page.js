'use client'

import QuestionAnswerComponent from "@/components/QuestionAnswerComponent";
import { Col, Container, Row, SSRProvider } from "react-bootstrap";
import { useQuizContext } from '../context/quizContext';

export default function QuizPage() {

    const { promptSet, reviewMode} = useQuizContext();
    
    return (
        <SSRProvider>
            <Container fluid className='App'>
                <Row>
                    <Col className='AppBody'>
                        <QuestionAnswerComponent prompts={JSON.parse(promptSet)} reviewMode={reviewMode} />
                    </Col>
                </Row>
            </Container>
        </SSRProvider>

    );
}