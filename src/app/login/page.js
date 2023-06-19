'use client'

import { useRouter } from "next/navigation";
import { Button, Col, Container, Form, Row, SSRProvider } from "react-bootstrap";

export default function LoginPage() {

    const router = useRouter();

    function onLoginSubmit(event) {
        event.preventDefault();
        fetch('/api/accounts/login', {
            method: 'post',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: document.getElementById('username').value,
                password: document.getElementById('password').value
            })
        })
            .then((res) => {
                if (res.status !== 200) {
                    throw new Error("Error during authentication");
                }
                router.push('/');
            })
            .catch(error => {
                console.log("Error:", error);
            });
    }

    return (
        <SSRProvider>
            <Container fluid className='App'>
                <Row>
                    <Col className='AppBody'>
                        <Form id="loginForm" method="post" onSubmit={onLoginSubmit}>
                            <Row>
                                <Col>
                                    <label htmlFor="username">Username:</label>
                                    <input type="text" id="username" name="username" />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <label htmlFor="password">Password:</label>
                                    <input type="password" id="password" name="password" />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Button type='submit'>
                                        Login
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </SSRProvider >

    );
}