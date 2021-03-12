import React , {useRef, useState, useEffect}from "react";
import '../styles/auctionspage_styles.css';
import { Card, Row, Col, CardGroup, Container, Spinner } from "react-bootstrap";
import axios from "axios";
import {Category} from "../Model/auction_types";
import { propTypes } from "react-bootstrap/esm/Image";


export default function Side() {
    const url = "http://localhost:5000/api/auctionspage/categories";
    let content = useRef(
        <div>
            <Spinner
            animation="border"
            role="status"
            className="sidebar-sticky">
                <span className="sr-only">Loading...</span>
            </Spinner>
        </div>
    )
    var startercategory: Category[] = [];
    const [categories, setCategories] = useState(startercategory);

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios(url);
            
            setCategories(result.data)
        };

        fetchData();
    }, [categories]);
    if(categories.length > 0) {
        content.current = (
        <>
            <div className="sidebar-sticky d-flex justify-content-center">
                <Card className="mt-2">
                    <Card.Body>
                        <b>Select a Category to find auctions faster!</b>
                        {categories.map((item: Category) => (
                            <div className="d-flex categories_wrapper mt-3"> <div className="categories_item">{item.name}</div></div>
                        ))}
                            
                    </Card.Body>
                </Card>
            </div>
        </>
        )
    }
    return content.current;
};