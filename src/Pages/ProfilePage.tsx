import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import {FaUser} from 'react-icons/fa';
import { useAppSelector, useAppDispatch } from "../App/hooks";
import profile_picture_default from "../assets/profile_picture_default.png"
import MyAuctionsPage from "../Pages/MyAuctionsPage";
import "../styles/profile_page_styles.css"
export default function ProfilePage() {
    const user = useAppSelector(state => state.loginstate.user);
    return(
        <Container>
            <Row>
                <Col md = {3}>
                    <Row className = "profile_page_starter_element">
                        <img src = {profile_picture_default} className = "profile_page_image"/>
                    </Row>
                    <Row className = "profile_page_element">
                        <h5>Name: {user.name}</h5>
                    </Row>
                    <Row className = "profile_page_element">
                        <h5>Birth: {user.birth}</h5>
                    </Row>
                    <Row className = "profile_page_element">
                        <h5>E-mail: {user.email}</h5>
                    </Row>
                    <Row className = "profile_page_element">
                        <h5>Balance: {user.balance}</h5>
                    </Row>
                </Col>
                <Col md = {8}>
                    <MyAuctionsPage></MyAuctionsPage>
                </Col>
            </Row>
        </Container>
    )
}
