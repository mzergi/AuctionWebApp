import React, {useState} from 'react';
import {Button, Col, Container, Form, Modal, Row} from "react-bootstrap";
import history from "../App/history";
import {Link} from "react-router-dom";
import {FaWallet} from "react-icons/fa";
import { useAppSelector } from '../App/hooks';
import {store} from "../App/store";
import { LoginSlice } from '../Reducers/UserLoginReducer';
import axios from 'axios';
import { User } from '../Model/auction_types';
// TODO: sketch
export default function WalletPage() {

    const [shown, setShown] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState(useAppSelector(state => state.loginstate.user) as User);
    const [addValue, setValue] = useState(0);
    function closeModal(){
        setShown(false);
    }
    function openModal(){
        setShown(true);
    }
    async function updateBalance(value: number) {
        let fetched = (await axios.put("http://localhost:5000/api/auctionspage/user/" + loggedInUser.id + "/wallet", {amount: value.toString()})).data as User;
        store.dispatch(LoginSlice.actions.setUser({...fetched}));
        setLoggedInUser({...fetched});
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
                Your balance: {loggedInUser.balance}
                <Form>
                    <Form.Group>
                        <Form.Label>Add balance</Form.Label>
                        <Row>
                            <Col>
                                <Form.Control
                                    name = "add_balance"
                                    type = "number"
                                    value={addValue}
                                    onChange = {(e:any) => setValue(e.currentTarget.value)}>
                                </Form.Control>
                            </Col>
                            <Col>
                                <Button variant="success" onClick={async () => {await updateBalance(addValue)}}>Add balance</Button>
                            </Col>
                        </Row>
                    </Form.Group>
                </Form>
            </Modal.Body>
        </Modal>
        </div>
    )
}
