import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Container, Button, Form, Modal, Card } from "react-bootstrap";

export default function LoginPage() {
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [registeredPopupIsOpen, setRegisterPopup] = React.useState(false);
  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }
  function registerUser() {
    setIsOpen(false);
    openRegisterPopup();
  }
  function openRegisterPopup() {
    setRegisterPopup(true);
  }
  function closeRegisterPopup() {
    setRegisterPopup(false);
  }
  return (
    //TODO: react hook formra átírni
    <Container className="d-flex mt-5 p-2 justify-content-end">
      <div style={{ flexGrow: 1 }}>
        <h1>
          <b>Welcome to our store!</b>
        </h1>
        <br />
        <br />
        <h5>Please sign in to start browsing our auctions.</h5>
        <br />
        <h5>
          If you don't have an account,{" "}
          <a onClick={openModal} style={{ color: "blue", cursor: "pointer" }}>
            <u>sign up!</u>
          </a>{" "}
        </h5>
      </div>
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
          Enter the e-mail address you registered with. Not registered?{" "}
          <a onClick={openModal} style={{ color: "blue", cursor: "pointer" }}>
            <u>Sign up!</u>
          </a>
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
      <Modal show={modalIsOpen} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Sign up</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="signupEmail">
              <Form.Label>E-mail </Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter the e-mail you want to register with."
              />
            </Form.Group>
            <Form.Group controlId="signupPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Enter your password" />
            </Form.Group>
            <Form.Group controlId="confirm">
              <Form.Label>Confirm password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Type in the password you entered above"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Enter your name" />
            </Form.Group>
            <Form.Group controlId="birth">
              <Form.Label>Born in:</Form.Label>
              <Form.Control type="date" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
          <Button variant="primary" onClick={registerUser} type="submit">
            Register
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={registeredPopupIsOpen} onHide={closeRegisterPopup}>
        <Modal.Header>
          <Modal.Title>Success!</Modal.Title>
        </Modal.Header>
        <Modal.Body>You have succesfully registered to our page!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeRegisterPopup}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
