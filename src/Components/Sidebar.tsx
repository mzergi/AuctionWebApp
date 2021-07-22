import React , {useRef, useState, useEffect}from "react";
import '../styles/auctionspage_styles.css';
import { Card, Row, Col, CardGroup, Container, Spinner } from "react-bootstrap";
import axios from "axios";
import {Category} from "../Model/auction_types";
import { propTypes } from "react-bootstrap/esm/Image";
import { store } from '../App/store';
import { setQueriedItems, setCategoryID } from "../Reducers/AuctionsQueryReducer";
import {Link, withRouter} from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../App/hooks';
import history from "../App/history";
import {AuctionItem} from "../Model/auction_types";

export default function Side() {
    const url = "http://localhost:5000/api/auctionspage/categories";
    const navigateonclick = "http://localhost:3000/auctions/category/";

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

    let getAuctionsOfCategory = (id: number) => {

        store.dispatch(setCategoryID(id));
        store.dispatch(setQueriedItems([] as AuctionItem[]));

        history.push("/auctions/category/" + id.toString());
    }

    var startercategory: Category[] = [];
    const [categories, setCategories] = useState(startercategory);

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios(url);
            
            setCategories(result.data)
        };

        fetchData();
    }, []);
    if(categories.length > 0) {
        content.current = (
        <>
            <div className="sidebar-sticky d-flex justify-content-center">
                <Card className="mt-2">
                    <Card.Body>
                        <b>Select a Category to find auctions faster!</b>
                        {categories.map((item: Category) => (
                            <div className="d-flex categories_wrapper mt-3" onClick = {() => {getAuctionsOfCategory(item.id)}}> <div className="categories_item">{item.name}</div></div>
                        ))}
                            
                    </Card.Body>
                </Card>
            </div>
        </>
        )
    }
    return content.current;
};
