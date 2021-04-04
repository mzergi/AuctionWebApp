import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Container, Button, Form, Modal, Card } from "react-bootstrap";
import axios from "axios";
import {User} from "../Model/auction_types";
import { useAppSelector, useAppDispatch } from '../App/hooks';
import { store } from '../App/store';
import { LoginActions } from '../Reducers/UserLoginReducer';
import { Redirect } from "react-router";
import history from "../App/history";
import { mockComponent } from "react-dom/test-utils";
import moment from "moment";

//bejelentkezés és regisztrálás Katona Tamás szakdolgozata alapján

export default function LoginPage() {
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [registeredPopupIsOpen, setRegisterPopup] = React.useState(false);
  const [loggedInPopupIsOpen, setLoggedInPopup] = React.useState(false);


  //form states
  const [loginEmail, setLoginEmail] = React.useState("");
  const [loginPassword, setLoginPassword] = React.useState("");

  const [regEmail, setRegEmail] = React.useState("");
  const [regPassword, setRegPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [regName, setRegName] = React.useState("");
  const [regBirth, setRegBirth] = React.useState(new Date());

  const url = "http://localhost:5000/auth"

  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }


  function registerUser() {
    setIsOpen(false);
    var user: any = { Email: regEmail, Password: regPassword, Name: regName, Birth: regBirth};
    axios.post(url.concat("/register"), user, {headers: {"Content-Type" : "application/json"},
  })
  .then((response) => {
    setRegEmail("");
    setRegPassword("");
    setConfirmPassword("");
    setRegName("");
    setRegBirth(new Date());
    openRegisterPopup();
  })
  .catch((error) => {
    const text = !error.response ? "Server error" : error.response.data;

    alert(text);
  });
  }

  function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms));
  }

  const loginUser = () =>  {
      var user: any = {Email: loginEmail, Password: loginPassword }
      axios.post(url.concat("/login"), user, {headers: {"Content-Type": "application/json"},
    })
    .then(async (response) => {
      store.dispatch(LoginActions.login(response.data.tokenString));

      setLoggedInPopup(true);

      await delay(3000);

      setLoggedInPopup(false);

      history.push("/auctions");
    })
    .catch((error) => {
      const text = !error.response ? "Server error" : error.response.data;

      alert (text);
    });
  }

  function openRegisterPopup() {
    setRegisterPopup(true);
  }
  function closeRegisterPopup() {
    setRegisterPopup(false);
  }
  return (
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
              <Form.Control type="email" placeholder="Enter email" value={loginEmail} onChange = {(e: React.ChangeEvent<HTMLInputElement>) => setLoginEmail(e.currentTarget.value)}/>
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
              <Form.Control type="password" placeholder="Password" value={loginPassword} onChange = {(e: React.ChangeEvent<HTMLInputElement>) => setLoginPassword(e.currentTarget.value)}/>
            </Col>
          </Form.Group>
          <br />
        </Form.Row>
        <Form.Row>
          <Button variant="success" onClick={() => loginUser()}>
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
                placeholder="Enter the e-mail you want to register with"
                value = {regEmail}
                onChange = {(e: React.ChangeEvent<HTMLInputElement>) => setRegEmail(e.currentTarget.value)}
              />
            </Form.Group>
            <Form.Group controlId="signupPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" 
              placeholder="Enter your password"
              value = {regPassword}
              onChange = {(e: React.ChangeEvent<HTMLInputElement>) => setRegPassword(e.currentTarget.value)} />
            </Form.Group>
            <Form.Group controlId="confirm">
              <Form.Label>Confirm password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter the password you gave above"
                value = {confirmPassword}
                onChange = {(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.currentTarget.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Enter your name"
                value = {regName}
                onChange = {(e: React.ChangeEvent<HTMLInputElement>) => setRegName(e.currentTarget.value)} />
            </Form.Group>
            <Form.Group controlId="birth">
              <Form.Label>Birth</Form.Label>
              <Form.Control type="date" 
              value = {moment(new Date(regBirth)).format('YYYY-MM-DD')}
              onChange = {(e: React.ChangeEvent<HTMLInputElement>) => {
                var date = new Date(moment(e.currentTarget.value).format('YYYY-MM-DD'));
                setRegBirth(date);
              }}/>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
          <Button variant="primary" onClick={registerUser}>
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

      <Modal show={loggedInPopupIsOpen}>
        <Modal.Header>
          <Modal.Title>Login successful!</Modal.Title>
        </Modal.Header>
        <Modal.Body>Login successful! Redirecting you to browsing!</Modal.Body>
      </Modal>
    </Container>
  );
}
