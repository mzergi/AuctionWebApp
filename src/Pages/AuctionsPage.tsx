import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Row, Container, CardGroup, Button, Form, Modal, Card } from "react-bootstrap";
import Sidebar from "../Components/Sidebar";
import "../styles/auctionspage_styles.css";
import "../Mock/FeaturedAuctionsMock";
import FeaturedAuctionsMock from '../Mock/FeaturedAuctionsMock';
import {AuctionItem} from "../Model/auction_types";

interface AuctionsPageProps {
    DetailsHandler: (item: AuctionItem) => void
}
export default function AuctionsPage(Props: AuctionsPageProps) {
    return (
        <Container fluid>
            <Row>
                <Col xs={2} id="sidebar-wrapper">
                    <Sidebar />
                </Col>
                <Col>
                    <Row className = "mt-4">
                        <Col className="d-flex justify-content-center">
                            <h5>Featured auctions</h5>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="d-flex">
                            <FeaturedAuctionsMock DetailsHandler = {Props.DetailsHandler}/>
                        </Col>
                    </Row>


                    <Row className = "mt-4">
                        <Col className="d-flex justify-content-center">
                            <h5>Other auctions</h5>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}