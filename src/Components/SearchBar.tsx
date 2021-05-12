import React, {useState} from 'react';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Col, Row, Button } from 'react-bootstrap'
import { FaSearch } from 'react-icons/fa';
import "../styles/auctionspage_styles.css";
import { useAppSelector, useAppDispatch } from '../App/hooks';
import { store } from '../App/store';
import { AuctionItem } from '../Model/auction_types';
import { setQueriedItems, setCategoryID } from "../Reducers/AuctionsQueryReducer";
import history from "../App/history";


export default function SearchBar() {
    let starteritems: AuctionItem[] = [];
    const [searchQuery, setQuery] = useState("");

    const url = "http://localhost:5000/api/auctionspage/auctions/search"

    let onSearchClick = () => {
        axios.get(url, {params: {query: searchQuery}})
        .then((response) =>{
            store.dispatch(setQueriedItems(response.data));
            store.dispatch(setCategoryID(0));

            history.push("/auctions/search");
        });
    }

    return (
        <Form style={{flexGrow: 1}}>
            <Form.Group as={Row} controlId="searchBar" className="searchBarWrapper" flex>
                <Col sm={9} className="pr-2 mt-2">
                    <Form.Control type="text" placeholder="Search..." className="searchBarInput" value={searchQuery} onChange={e => setQuery(e.target.value)}/>
                </Col>
                <Form.Label column sm={1}>
                    <Button variant="primary" className="searchBarButton" style ={{marginLeft: "-1rem", borderRadius: "12px"}} onClick= {onSearchClick}>
                        <FaSearch style={{color: "darkgray", marginBottom: "0.35rem"}} />
                    </Button>
                </Form.Label>
            </Form.Group>
        </Form>
    )
}
