import React, {useState} from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Row, Container, CardGroup, Button, Form, Modal, Card } from "react-bootstrap";
import Sidebar from "../Components/Sidebar";
import AuctionCards from "../Components/AuctionCards";
import "../styles/auctionspage_styles.css";
import "../Mock/FeaturedAuctionsMock";
import {AuctionItem} from "../Model/auction_types";
import SearchBar from "../Components/SearchBar";


export default function AuctionsPage() {
    return (
        <Container fluid>
            <Row>
                <Col xs={2} id="sidebar-wrapper">
                    <Sidebar/>
                </Col>
                <Col>
                    <Row className = "mt-4">
                        <Col className="d-flex justify-content-start">
                            <h5>Featured auctions</h5>
                        </Col>
                    </Row>
                    <Row className = {"g-6 d-flex"} style = {{justifyContent: "flex-start"}}>
                            <AuctionCards highlighted = {true} items = {[]}/>
                    </Row>


                    <Row className = "mt-4">
                        <Col className="d-flex justify-content-start">
                            <h5>Other auctions</h5>
                        </Col>
                    </Row>
                    <Row className={"g-6 d-flex"} style = {{justifyContent: "flex-start"}}>
                            <AuctionCards highlighted = {false} items = {[]}/>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}
