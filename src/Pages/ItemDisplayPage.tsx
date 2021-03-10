import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Row, Container, CardGroup, Button, Form, Modal, Card } from "react-bootstrap";
import { Product, User, AuctionItem, Bid } from '../Model/auction_types';

interface ItemDisplayPageProps{
    auction: AuctionItem
}
export default function ItemDisplayPage(Props: ItemDisplayPageProps)
{
    return(
        <Container fluid>
            <Row>
                <Col className = "d-flex justify-content-center">
                    <h3>{Props.auction.name}</h3>
                </Col>
            </Row>
        </Container>
    )
}