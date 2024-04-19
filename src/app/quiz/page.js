'use client'

import QuestionAnswerComponent from "@/app/components/QuestionAnswerComponent";
import { Col, Container, Row, SSRProvider } from "react-bootstrap";

export default function QuizPage() {

    return (
        <SSRProvider>
            <Container fluid className='App'>
                <Row>
                    <Col className='AppBody'>
                        <QuestionAnswerComponent />
                    </Col>
                </Row>
            </Container>
        </SSRProvider>

    );
}