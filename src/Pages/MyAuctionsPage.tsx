import React, { useState, useEffect, useRef } from "react";
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
    Table
} from "react-bootstrap";
import ItemDisplayPage from "./ItemDisplayPage";
import {AuctionItem, Bid, IIndexable, Product, User} from "../Model/auction_types";
import { useAppSelector, useAppDispatch } from "../App/hooks";
import axios from "axios";
import * as signalR from "@microsoft/signalr";
import "../styles/auctionspage_styles.css";
import {store} from "../App/store";
import {setDisplayed} from "../Reducers/AuctionDetailsReducer";
import {Link} from "react-router-dom";
import moment from "moment";

export default function MyBidsPage() {
    const [modalProduct, setProduct] = useState({} as Product);
    const [modalProductId, setProductId] = useState(0);
    const [loadedProducts, setLoadedProducts] = useState([] as Product[]);
    const [loadedCategories, setLoadedCategories] = useState([] as Category[]);
    const [auctions, setAuctions] = useState([] as AuctionItem[]);
    const [modalAuction, setModalAuction] = useState({} as AuctionItem);
    const [showModal, setShowModal] = useState(false);
    const [modalBid, setModalBid] = useState(0);

    const userId = useAppSelector((state) => state.loginstate.user.id);

    const url = "http://localhost:5000/api/auctionspage/auctions/created-by/";
    const updateUrl = "http://localhost:5000/api/auctionspage/auctions/";

    const fetchData = async () => {
        const result = await axios(url.concat(userId.toString()));

        setAuctions([...result.data]);
    };

    const connection = useAppSelector((state) => state.connection.connection);

    connection.on("bidReceived", async () => {
        await fetchData();
    });

    useEffect(() => {
        (async () => {
            await fetchData();
        })()
    }, []);

    function updateModalAuction(value: any, prop: string) {
        var tmp = modalAuction;
        (tmp as IIndexable)[prop] = value;
        setModalAuction({...tmp});
    }

    function findHighestBidByUser(auction: AuctionItem) : number
    {
        let highest = 0;
        auction?.bids?.forEach(b => {
            if(b.bidderID == userId)
            {
                if(b.biddedAmount > highest)
                {
                    highest = b.biddedAmount;
                }
            }
        });
        return highest;
    }

    function openModal(){
        setShowModal(true);
    }

    function closeModal(){
        setShowModal(false);
    }
    async function updateAuction() {
        const result = await axios.put(updateUrl + modalAuction?.id, modalAuction);
        await fetchData();
        closeModal();
    }

    const handleClick = (item: AuctionItem) => {
        setModalAuction({...item});
        setShowModal(true);
    };

    return (
        <Container fluid>
            <Row className={"justify-content-center mt-4"}>
            </Row>
            <Row className={"justify-content-center mt-2"}></Row>
            <Table bordered hover>
                <thead>
                <tr>
                    <th colSpan={8}>Your auctions</th>
                </tr>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Current bid</th>
                    <th>Starting price</th>
                    <th>Start of auction</th>
                    <th>End of auction</th>
                    <th>Highlighted</th>
                </tr>
                </thead>
                <tbody>
                {auctions.map((a) => (
                    <tr onClick={() => handleClick(a)} className={'table-row'}>
                        <td>{auctions.indexOf(a) + 1}</td>
                        <td>{a.product.name}</td>
                        <td>{a.description}</td>
                        <td>{a.topBid?.biddedAmount ? a.topBid?.biddedAmount : 'No bids yet.'}</td>
                        <td>{a.startingPrice}</td>
                        <td>{a.startOfAuction}</td>
                        <td>{a.endOfAuction}</td>
                        <td>{a.highlighted ? 'Yes' : 'No'}</td>
                    </tr>
                ))}
                </tbody>
            </Table>


            <Modal show={showModal && Date.now() < new Date(modalAuction?.endOfAuction).getTime()} onHide={closeModal}>
                <Modal.Header>
                    <Modal.Title>
                        {modalAuction?.product?.name}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                name="edit_description"
                                disabled = {!!modalAuction?.topBid?.biddedAmount} 
                                as="textarea" 
                                value={modalAuction?.description}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        updateModalAuction(e.currentTarget.value, 'description');
                                        }}>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Starting price</Form.Label>
                            <Form.Control
                                name="edit_starting_price"
                                disabled = {!!modalAuction?.topBid?.biddedAmount} 
                                type="number" value={modalAuction?.startingPrice}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            updateModalAuction(e.currentTarget.value, 'startingPrice');
                                        }}>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Start of auction</Form.Label>
                            <Form.Control
                                name="edit_start_of_auction"
                                disabled = {Date.now() > new Date(modalAuction?.startOfAuction).getTime()}
                                type="date" 
                                value={moment(new Date(modalAuction?.startOfAuction)).format('YYYY-MM-DD')}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                              updateModalAuction(new Date(moment(e.currentTarget.value).format('YYYY-MM-DD')), 'startOfAuction');
                                          }}>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>End of auction</Form.Label>
                            <Form.Control 
                                name="edit_end_of_auction"
                                disabled = {Date.now() < new Date(modalAuction?.endOfAuction).getTime()}
                                type="date" 
                                value={moment(new Date(modalAuction?.endOfAuction)).format('YYYY-MM-DD')}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                              updateModalAuction(new Date(moment(e.currentTarget.value).format('YYYY-MM-DD')), 'endOfAuction');
                                          }}>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Check 
                                type="checkbox" 
                                label="Highlight auction" 
                                checked={modalAuction?.highlighted}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    updateModalAuction(e.target.checked, 'highlighted');
                                }}/>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant={"primary"} onClick={async () => {updateAuction();}}>
                        Update
                    </Button>
                    <Button variant={"secondary"} onClick={async () => {closeModal();}}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}
