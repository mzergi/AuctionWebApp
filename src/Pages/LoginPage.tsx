import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Container, Button, Form } from "react-bootstrap";

export default function LoginPage() {
    return (
        //TODO: react hook formra átírni
        <Container className="pl-5 pt-3">
            <Form>
                <Form.Row>
                    <Form.Group controlId="formEmail">
                        <Form.Label>Email address</Form.Label>
                        <Col>
                            <Form.Control type="email" placeholder="Enter email" />
                        </Col>
                    </Form.Group>
                </Form.Row>
                <Form.Text className="text-muted">
                    Enter the e-mail address you registered with. Not registered? Sign up!
                </Form.Text>
                <br />
                <Form.Row>
                    <Form.Group controlId="formPassword">
                        <Form.Label>Password</Form.Label>
                        <Col>
                            <Form.Control type="password" placeholder="Password" />
                        </Col>
                    </Form.Group>
                    <br />
                </Form.Row>
                <Form.Row>
                    <Button variant="success" type="submit">
                        Log in
                </Button>
                </Form.Row>
            </Form>
        </Container>
    )
}