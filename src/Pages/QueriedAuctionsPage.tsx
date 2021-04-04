import React, {useState, useEffect, useRef} from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Row, Container, CardGroup, Button, Form, Modal, Card, Spinner } from "react-bootstrap";
import Sidebar from "../Components/Sidebar";
import AuctionCards from "../Components/AuctionCards";
import "../styles/auctionspage_styles.css";
import { useAppSelector, useAppDispatch } from '../App/hooks';
import { AuctionItem} from "../Model/auction_types";
import { store } from '../App/store';
import axios from "axios";
import { withRouter } from 'react-router';
import { setQueriedItems, setCategoryID as setStoreCategory } from "../Reducers/AuctionsQueryReducer";

interface QueriedAuctionsPageProps {
    categoryID : number,
    items : AuctionItem[]
}

export default function QueriedAuctionsPage(Props: QueriedAuctionsPageProps) {

    let starterauctions : AuctionItem[] = [];

    const [categoryID, setCategoryID] = useState(Props.categoryID);

    const [items, setAuctions] = useState(Props.items);

    const url = "http://localhost:5000/api/auctionspage/auctions/category/"

    useEffect(() => {
        const fetchData = async () => {
            //category or search query magic
            if(items.length === 0 && categoryID !== 0){
                const result = await axios(url.concat(categoryID.toString()));
            
                setAuctions(result.data);
            }
        };

        fetchData();
    }, [items]);

    let content = useRef(
        <div style = {{display: "flex", justifyContent: "center", alignItems: "center"}}>
            <Spinner
            animation="border"
            role="status"
            className="sidebar-sticky">
                <span className="sr-only">Loading...</span>
            </Spinner>
        </div>
    )

    if(items.length > 0)
    {
        content.current = (
            <Container fluid>
            <Row>
                <Col xs={2} id="sidebar-wrapper">
                    <Sidebar/>
                </Col>
                <Col>
                    <Row className = "mt-4">
                        <Col className="d-flex justify-content-center">
                            <h5>Auctions found:</h5>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="d-flex">
                            <AuctionCards highlighted = {false} items = {items}/>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
        )
    }

    return content.current;
}