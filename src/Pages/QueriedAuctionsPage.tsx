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

// TODO: Display no results found on empty return

interface QueriedAuctionsPageProps {
    categoryID : number,
    items : AuctionItem[]
}

export default function QueriedAuctionsPage(Props: QueriedAuctionsPageProps) {

    let starterauctions : AuctionItem[] = [];

    const [categoryID, setCategoryID] = useState(Props.categoryID);

    const [items, setAuctions] = useState(Props.items);

    const [empty, setEmpty] = useState(true);

    const [queried, setQueried] = useState(false);

    const url = "http://localhost:5000/api/auctionspage/auctions/category/"

    async function fetchData(){
        //category or search query magic
        if(items.length === 0 && categoryID !== 0){
            const result = await axios.get(url.concat(categoryID.toString()));
            setQueried(true);
            if (!result.data.length) {
                return false;
            }
            setAuctions(result.data);
            return true;
        }
    };

    useEffect(() => {
        (async () => {
            const hasData = await fetchData();
            setEmpty(!!hasData);
        })()
    }, []);

    if (!items.length && !queried) {
        return (
            <div style = {{display: "flex", justifyContent: "center", alignItems: "center"}}>
                <Spinner
                animation="border"
                role="status"
                className="sidebar-sticky">
                    <span className="sr-only">Loading...</span>
                </Spinner>
            </div>
        )
    }

    else if (!empty && queried) {
        return (
            <Container>
                <h2>
                    No auctions found!
                </h2>
            </Container>
        )
    }
    else {
        if (items.length === 0) {
            return (
                <Container>
                    <h2>
                        No auctions found!
                    </h2>
                </Container>
            )
        }
        else {
            return (
                <Container fluid>
                    <Row>
                        <Col xs={2} id="sidebar-wrapper">
                            <Sidebar/>
                        </Col>
                        <Col>
                            <Row className="mt-4">
                                <Col className="d-flex justify-content-start">
                                    <h5>Auctions found:</h5>
                                </Col>
                            </Row>
                            <Row className={"g-6 d-flex"} style = {{justifyContent: "flex-start"}}>
                                    <AuctionCards highlighted={false} items={items}/>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            )
        }
    }
}
