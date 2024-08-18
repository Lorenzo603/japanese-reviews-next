'use client'

import QuestionAnswerComponent from "@/app/components/QuestionAnswerComponent";
import { Col, Container, Row } from "react-bootstrap";

export default function QuizPage() {

    return (
        <Container fluid className='App'>
            <Row>
                <Col className='AppBody'>
                    <QuestionAnswerComponent />
                </Col>
            </Row>
        </Container>

    );
}