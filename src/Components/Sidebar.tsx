import React from "react";
import '../styles/auctionspage_styles.css';
import { Card, Row, Col, CardGroup, Container } from "react-bootstrap";
import axios from "axios";

const Side = () => {
    return (
        <>
            <div className="sidebar-sticky d-flex justify-content-center">
                <Card className="mt-2">
                    <Card.Body>
                        <b>Select a Category to find auctions faster!</b>

                        <div className="d-flex categories_wrapper mt-3"> <div className="categories_item">Laptops</div></div>

                        <div className="d-flex categories_wrapper"> <div className="categories_item">Furniture</div></div>

                        <div className="d-flex categories_wrapper"> <div className="categories_item">Jewellery</div></div>

                        <div className="d-flex categories_wrapper"> <div className="categories_item">Art</div></div>
                    </Card.Body>
                </Card>
            </div>
        </>
    );
};

export default Side;