import React, { useRef, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
    Col,
    Row,
    Container,
    CardGroup,
    Button,
    Form,
    Modal,
    Card,
    Spinner,
} from "react-bootstrap";
import { Product, User, AuctionItem, Bid } from "../Model/auction_types";
import {
    BrowserRouter as Router,
    Switch,
    Redirect,
    Route,
    Link,
} from "react-router-dom";

import { setDisplayed } from '../Reducers/AuctionDetailsReducer';

import { useAppSelector, useAppDispatch } from '../App/hooks';

import { store } from '../App/store';

import axios from 'axios';
import { setConstantValue } from "typescript";

interface AuctionCardsProps {
    item: AuctionItem
}

export default function AuctionCard(Props: AuctionCardsProps) {

    const url = "http://localhost:5000/api/auctionspage/auctions/".concat(Props.item.id.toString());

    const [item, setItem] = useState(Props.item);

    const[biddedvalue, setBiddedValue] = useState((item.topBid !== null) ? item.topBid.biddedAmount : item.startingPrice);

    const[highestbidbyuser, setHighestBidByUser] = useState({} as Bid);

    const sendBid = async () => {
        let bid: Bid = {id: 0, biddedAmount: biddedvalue, auctionID: item.id, bidderID: 1, bidder: {} as User}

        const result = await axios.patch(url, bid);

        setItem(result.data);
    }

    const getHighestBidByUser = async () => {

        const result = await axios(url.concat("/highestByUser/1"));

        setHighestBidByUser(result.data);
    }

    getHighestBidByUser();

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios(url);

            setItem(result.data)
        };

        fetchData();
        getHighestBidByUser();
    }, [item]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBiddedValue(parseInt(e.currentTarget.value));
    }

    useEffect(() => {
        getHighestBidByUser();
    }, [biddedvalue]);

    return(
        <Card className="d-flex justify-content-center" style = {{width: "15rem"}}>
            <Card.Body>
                <Card.Title>{item.product.name}</Card.Title>
            Picture
            <br />
            Goes
            <br />
            Here
            <br />
            </Card.Body>
            <Card.Footer>
                <Link to={"/auctions/".concat(item.id.toString())} onClick={() => {
                    store.dispatch(setDisplayed(item));
                }
                }>Details</Link>
                <br />
            Highest bid: {(item.topBid === null) ? item.startingPrice : item.topBid.biddedAmount}
                <Form>
                    <Form.Label>Your bid: {(highestbidbyuser.biddedAmount > 0) ? highestbidbyuser.biddedAmount : "None"}</Form.Label>
                        <Form.Control name="bid_input" type="number" placeholder="Enter bid" value = {biddedvalue} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)}/>
                    <Button variant="success" className="mt-2" onClick = {() => sendBid()}>
                        Bid
              </Button>
                </Form>
            </Card.Footer>
        </Card>
    )
}