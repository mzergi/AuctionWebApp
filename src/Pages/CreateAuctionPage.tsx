import React, {useState} from 'react';
import { useAppSelector, useAppDispatch } from '../App/hooks';
import { Container, Row, Col, Form, Modal, Button } from "react-bootstrap";
import { store } from '../App/store';
import axios from "axios";
import * as signalR from "@microsoft/signalr";
import {Product, Category, AuctionItem, User, Bid} from "../Model/auction_types";
import moment from "moment";


export default function CreateAuctionPage() {

    //TODO: category, product lekerdezes, kivalasztott category/product nyilvantartas state-ben
    // CreateAuction fv, amiben osszeallitjuk az uj auctiont
    // CreateProduct fv, amiben osszeallitjuk az uj productot
    // Kulon create product form/modal
    // product select dropdown
    // category dropdown
    // ezek betöltése

    const url = "http://localhost:5000/api/auctionspage/auctions/create";

    //form states
    const [inputProduct, setProduct] = useState({} as Product);
    const [description, setDescription] = useState("");
    const [startOfAuction, setStart] = useState(new Date());
    const [endOfAuction, setEnd] = useState(new Date());
    const [highlighted, setHighlighted] = useState(false);
    const [startingPrice, setStartingPrice] = useState(0);
    const [productCategory, setProductCategory] = useState({} as Category);
    const [productName, setProductName] = useState("");

    const loggedInUser = useAppSelector(state => state.loginstate.user);

    const CreateAuction = async () => {
        var toCreate: AuctionItem = {
            id: {} as number,
            topBidder: {} as User,
            name: productName,
            product: inputProduct,
            description: description,
            startOfAuction: startOfAuction,
            endOfAuction: endOfAuction,
            bids: {} as Bid[],
            startingPrice: startingPrice,
            highlighted: highlighted,
            topBid: {} as Bid,
            createdBy: loggedInUser
        };
        await axios.post(url, toCreate);
    }

    const CreateProduct = () => {
        var createProduct: Product = {
            id: {} as number,
            name: productName,
            category: productCategory,
            imagePath: "",
            categoryID: productCategory.id
        };

        setProduct(createProduct);
    }

    return(
        <Container>
            <Row>
                <Col lg={5} style={{marginTop: "8%"}}>
                <h3>Create new auction</h3>
                    <Form style={{marginTop: "10%"}} inline>
                        <Form.Group>
                            <Form.Label className="my-1 mr-3">Category</Form.Label>
                            <Form.Control as="select" className="my-1 mr-sm-3" custom>
                                <option value="0">Choose category</option>
                                <option value="1">Electronics</option>
                            </Form.Control>
                        </Form.Group>
                    </Form>
                    <Form>
                        <Form style={{marginTop: "5%"}}>
                            <Form.Group>
                                <Form.Label>Product name</Form.Label>
                                <Form.Control type="text" maxLength={100}
                                value = {productName}
                                onChange = {(e: React.ChangeEvent<HTMLInputElement>) =>  {
                                    setProductName(e.currentTarget.value);
                                    }}></Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Description (max. 300 characters)</Form.Label>
                                <Form.Control as="textarea" maxLength={300} value={description}
                                    onChange= {(e: React.ChangeEvent<HTMLInputElement>)=> setDescription(e.currentTarget.value)}/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Start of auction</Form.Label>
                                <Form.Control type = "date"
                                value = {moment(new Date(startOfAuction)).format('YYYY-MM-DD')}
                                onChange = {(e: React.ChangeEvent<HTMLInputElement>)=> {
                                    var date = new Date(moment(e.currentTarget.value).format('YYYY-MM-DD'));
                                    setStart(date);
                                }}/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>End of auction</Form.Label>
                                <Form.Control type = "date"
                                value = {moment(new Date(endOfAuction)).format('YYYY-MM-DD')}
                                onChange = {(e: React.ChangeEvent<HTMLInputElement>)=> {
                                    var date = new Date(moment(e.currentTarget.value).format('YYYY-MM-DD'));
                                    setEnd(date);
                                }}/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Check type="checkbox" label="Highlight auction" checked = {highlighted}
                                onChange = {(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setHighlighted(e.target.checked);
                                }}/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Starting price</Form.Label>
                                <Form.Control type = "number" value = {startingPrice}
                                onChange = {(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setStartingPrice(parseInt(e.currentTarget.value));
                                } }></Form.Control>
                            </Form.Group>
                            <Button variant="success">Create!</Button>
                        </Form>
                    </Form>
                </Col>
                <Col>
                    
                </Col>
            </Row>
        </Container>
    )
}