import { FaSignOutAlt } from 'react-icons/fa';
import React, { useState } from 'react';
import { store } from '../App/store';
import { LoginActions } from '../Reducers/UserLoginReducer';
import history from "../App/history";
import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Row, Container, CardGroup, Button, Form, Modal, Card, Image } from "react-bootstrap";
import "../styles/auctionspage_styles.css";

export default function SignOutButton() {

    const [loggedOutPopupIsOpen, setLoggedOutPopup] = useState(false);

    function delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const handleSignout = async () => {
        LoginActions.logout();

        setLoggedOutPopup(true);

        await delay(3000);

        setLoggedOutPopup(false);

        history.push("/login");
    }

    return (
        <div>
            <Row>
                <Col>
                    <Button onClick={() => handleSignout()} className="signOutButton">
                        <FaSignOutAlt style={{color: "darkgray", marginBottom: "0.35rem"}} />
                    </Button>
                </Col>
            </Row>

            <Modal show={loggedOutPopupIsOpen}>
                <Modal.Header>
                    <Modal.Title>Sign out successful!</Modal.Title>
                </Modal.Header>
                <Modal.Body>Sign out successful! Redirecting you to login!</Modal.Body>
            </Modal>
        </div>
    )
}