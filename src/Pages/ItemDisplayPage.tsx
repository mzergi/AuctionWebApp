import React, { useState, useRef, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Row, Container, CardGroup, Button, Form, Modal, Card, Image } from "react-bootstrap";
import { Product, User, AuctionItem, Bid } from '../Model/auction_types';
import "../styles/detailspage_style.css";
import moment from "moment";
import placeholder from '../assets/placeholder.jpg'
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import axios from 'axios';
import { useAppSelector, useAppDispatch } from '../App/hooks';
import { store } from '../App/store';
import * as signalR from "@microsoft/signalr";

interface ItemDisplayPageProps {
    auction: AuctionItem
}
export default function ItemDisplayPage(Props: ItemDisplayPageProps) {
    const [item, setItem] = useState(Props.auction);

    const url = "http://localhost:5000/api/auctionspage/auctions/".concat(item.id.toString());

    const [biddedvalue, setBiddedValue] = useState((item.topBid !== null) ? item.topBid.biddedAmount : item.startingPrice);

    const user = useAppSelector(state => state.loginstate.user);

    const connection = useAppSelector(state => state.connection.connection);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBiddedValue(parseInt(e.currentTarget.value));
    }

    const sendBid = async () => {
        let bid: Bid = {id: 0, biddedAmount: biddedvalue, auctionID: item.id, bidderID: user.id, bidder: {} as User, bidTime: new Date()}

        const result = await axios.patch(url, bid);

        setItem(result.data);
    }

    const fetchData = async () => {
        const result = await axios(url);

        setItem(result.data)
    };

    connection.on("bidReceived", async (bid: Bid) => {
        await fetchData();
    });

    useEffect(() => {
        (async () => {
            await fetchData();
        })()
    }, []);
    return (
        <Container fluid>
            <Row>
                <Col className="d-flex justify-content-start detailsTitle">
                    {item.product.name}
                </Col>
            </Row>

            <Row>
                <Col>
                    <Carousel>
                        <div>
                            <img src={placeholder} />
                        </div>
                        <div>
                            <img src={placeholder} />
                        </div>
                    </Carousel>
                </Col>
                <Col>
                    <Row>
                        <Col className="detailsBidsWrapper">
                            <div className="detailsBidsHeaderWrapper"><div className="detailsBidsHeader">Bid history:</div></div>
                            <div className="detailsBids">
                                {item.bids.slice(0).reverse().map((bid) => (
                                    <Row>
                                        <Col className="d-flex justify-content-left detailsBid">
                                            {(bid.bidderID == user.id) ? 
                                            <div style= {{color: "green"}}>{moment(bid.bidTime).format("YYYY.MM.DD. HH:mm:ss")} GMT: You bidded: {bid.biddedAmount} </div>
                                            :
                                            <div style={{color: "red"}}>{moment(bid.bidTime).format("YYYY.MM.DD. HH:mm:ss")} GMT: Someone else bidded: {bid.biddedAmount}</div>
                                            }
                                        </Col>
                                    </Row>
                                ))}
                            </div>
                            <div className="detailsBidsFooterWrapper"></div>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="d-flex justify-content-center detailsDate">
                            Start of auction: {moment(item.startOfAuction).format("YYYY-MM-DD HH:MM:SS")}
                        </Col>
                    </Row>
                    <Row>
                        <Col className="d-flex justify-content-center detailsDate">
                            End of auction: {moment(item.endOfAuction).format("YYYY-MM-DD HH:MM:SS")}
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row>
                <Col className="detailsDescription">
                    Description: {" "}
                    {item.description}
                </Col>

                <Col className="d-flex justify-content-center detailsPostBidWrapper">
                    <Row>
                        <Col className="d-flex" style={{marginTop: "5%"}}>
                            <Form>
                                <Form.Row>
                                    <Form.Control name="bid_input" size="lg" className="detailsPostBidInput" type="number" placeholder="Enter bid" value={biddedvalue} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)} />
                                </Form.Row>
                            </Form>
                        </Col>
                        <Col>
                            <Button variant="success" size="lg" className = "detailsPostBidButton" onClick = {() => sendBid()}>Place bid</Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}
