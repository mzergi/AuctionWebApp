import React, {useEffect, useState} from 'react';
import {useAppSelector, useAppDispatch} from '../App/hooks';
import {Container, Row, Col, Form, Modal, Button} from "react-bootstrap";
import {store} from '../App/store';
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

    const createUrl = "http://localhost:5000/api/auctionspage/auctions/create";
    const baseUrl = "http://localhost:5000/api/";

    const [newProductModalIsOpen, setNewProductModalIsOpen] = useState(false);

    //form states
    const [inputProduct, setProduct] = useState({} as Product);
    const [description, setDescription] = useState("");
    const [startOfAuction, setStart] = useState(new Date());
    const [endOfAuction, setEnd] = useState(new Date());
    const [highlighted, setHighlighted] = useState(false);
    const [startingPrice, setStartingPrice] = useState(0);
    const [productCategory, setProductCategory] = useState({} as Category);
    const [newProductName, setNewProductName] = useState("");
    const [newProductCategory, setNewProductCategory] = useState({} as Category);

    const [loadedProducts, setLoadedProducts] = useState([] as Product[]);
    const [loadedCategories, setLoadedCategories] = useState([] as Category[]);

    const loggedInUser = useAppSelector(state => state.loginstate.user);

    // useEffect with empty array watched only gets called when mounted/unmounted
    // create async function inside useEffect
    useEffect(() => {
        (async () => {
                let products = await axios.get(baseUrl + "auctionspage/products");
                setLoadedProducts(products.data);
                let categories = await axios.get(baseUrl + "auctionspage/categories");
                setLoadedCategories(categories.data);
            }
        )()
    }, [])

    function openNewProductModal()
    {
        setNewProductModalIsOpen(true);
    }
    function closeNewProductModal()
    {
        setNewProductModalIsOpen(false);
    }
    // TODO: TEST IF IT WORKS
    async function CreateAuction(){
        var toCreate: AuctionItem = {
            id: {} as number,
            topBidder: {} as User,
            name: inputProduct.name,
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
        var result = await axios.post(createUrl, toCreate);
        console.log(result.data);
    }
    // TODO: MAKE ASYNC, POST TO DB, LOAD BACK
    function CreateProduct() {
        let createProduct: Product = {
            id: {} as number,
            name: newProductName,
            category: newProductCategory,
            imagePath: "",
            categoryID: newProductCategory.id
        };
        setProduct({...createProduct});
        setProductCategory({...newProductCategory});
        let loaded = loadedProducts;
        loaded.push(createProduct);
        setLoadedProducts([...loaded]);
        closeNewProductModal();
        console.log(createProduct);
        console.log(inputProduct);
        console.log(productCategory);
    }

    async function CategorySelected(categoryId: number) {
        var category = await axios.get(baseUrl + "auctionspage/categories/" + categoryId);
        var productsOfCategory = await axios.get(baseUrl + "auctionspage/products/category/" + categoryId);

        let old = loadedProducts;
        old = productsOfCategory.data;

        setLoadedProducts([...old]);
        setProductCategory({...category.data});
        console.log(productCategory);
        console.log(loadedProducts);
    }

    function SetNewProductCategoryById(id: number){
        let category = loadedCategories.find(c => c.id === id);

        setNewProductCategory(category as Category);
    }

    function setProductFromId(id: number){
        let product = loadedProducts.find(p => p.id == id);

        setProduct(product as Product);
    }

    return (
        <Container>
            <Row>
                <Col lg={5} style={{marginTop: "8%"}}>
                    <h3>Create new auction</h3>
                    <Form style={{marginTop: "10%"}} inline>
                        <Form.Group>
                            <Form.Label className="my-1 mr-3">Category</Form.Label>
                            <Form.Control as="select" className="my-1 mr-sm-3" custom
                                          onChange={async(e) => {await CategorySelected(parseInt(e.target.value))}}>
                                <option value="0">Choose category</option>
                                {loadedCategories.map((category) => (
                                    <option value={category.id}>{category.name}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Form>
                    <Form>
                        <Form style={{marginTop: "5%"}}>
                            <Form.Group>
                                <Form.Label>Select Product</Form.Label>
                                <Row>
                                    <Col>
                                        <Form.Control as="select" onChange={e => {setProductFromId(parseInt(e.currentTarget.value))}} value = {inputProduct.id} custom>
                                            <option value="0">Choose Product</option>
                                            {loadedProducts.map((product) => (
                                                <option value={product.id}>{product.name}</option>
                                            ))}
                                        </Form.Control>
                                    </Col>
                                    <Col>
                                        <Button variant="success" onClick={openNewProductModal}>New product</Button>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Description (max. 300 characters)</Form.Label>
                                <Form.Control as="textarea" maxLength={300} value={description}
                                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.currentTarget.value)}/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Start of auction</Form.Label>
                                <Form.Control type="date"
                                              value={moment(new Date(startOfAuction)).format('YYYY-MM-DD')}
                                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                  var date = new Date(moment(e.currentTarget.value).format('YYYY-MM-DD'));
                                                  setStart(date);
                                              }}/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>End of auction</Form.Label>
                                <Form.Control type="date"
                                              value={moment(new Date(endOfAuction)).format('YYYY-MM-DD')}
                                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                  var date = new Date(moment(e.currentTarget.value).format('YYYY-MM-DD'));
                                                  setEnd(date);
                                              }}/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Check type="checkbox" label="Highlight auction" checked={highlighted}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                setHighlighted(e.target.checked);
                                            }}/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Starting price</Form.Label>
                                <Form.Control type="number" value={startingPrice}
                                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                  setStartingPrice(parseInt(e.currentTarget.value));
                                              }}></Form.Control>
                            </Form.Group>
                            <Button variant="success" onClick={CreateAuction}>Create!</Button>
                        </Form>
                    </Form>
                </Col>
                <Col>

                </Col>
            </Row>
            <Modal show={newProductModalIsOpen} onHide={closeNewProductModal}>
                <Modal.Header>
                    <Modal.Title>Create new Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" value={newProductName}
                                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                              setNewProductName(e.currentTarget.value);
                                          }}>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Category</Form.Label>
                            <Form.Control as="select" custom
                                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {SetNewProductCategoryById(parseInt(e.currentTarget.value))}}>
                                <option value="0">Choose category</option>
                                {loadedCategories.map((category) => (
                                    <option value={category.id}>{category.name}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeNewProductModal}>Close</Button>
                    <Button variant="success" onClick={CreateProduct}>Create</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}
