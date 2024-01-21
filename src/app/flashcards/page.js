'use client'

import FlashcardAnswerComponent from "@/components/FlashcardAnswerComponent";
import { Col, Container, Row, SSRProvider } from "react-bootstrap";

export default function FlashcardsPage() {

    return (
        <SSRProvider>
            <Container fluid className='App'>
                <Row>
                    <Col className='AppBody'>
                        <FlashcardAnswerComponent />
                    </Col>
                </Row>
            </Container>
        </SSRProvider>

    );
}