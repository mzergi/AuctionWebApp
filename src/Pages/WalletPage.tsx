import React, {useState} from 'react';
import {Button, Col, Container, Modal, Row} from "react-bootstrap";
import history from "../App/history";
import {Link} from "react-router-dom";
import {FaWallet} from "react-icons/fa";
// TODO: sketch
export default function WalletPage() {

    const [shown, setShown] = useState(false);

    function closeModal(){
        setShown(false);
    }
    function openModal(){
        setShown(true);
    }

    return(
        <div>
            <Row>
                <Col>
            <Button className="walletButton" onClick={openModal}>
                <FaWallet/>
            </Button>
        </Col>
            </Row>
        <Modal show = {shown} onHide={closeModal}>
            <Modal.Header>
                Your wallet
            </Modal.Header>
            <Modal.Body>
                Hi
            </Modal.Body>
        </Modal>
        </div>
    )
}
