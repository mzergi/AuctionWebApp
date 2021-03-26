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
  Spinner
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

import {store} from '../App/store';

import axios from 'axios';

import AuctionCard from './AuctionCard';

interface AuctionCardsProps {
  highlighted: boolean
}

export default function AuctionCards(Props: AuctionCardsProps){

  const url = (Props.highlighted ? "http://localhost:5000/api/auctionspage/auctions/highlighted" : "http://localhost:5000/api/auctionspage/auctions/basic");

  var starterauction: AuctionItem[] = [];

  const onDetailsClick = () => {
    
  }
  
  const [auctions, setAuctions] = useState(starterauction);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(url);

      setAuctions(result.data)
    };

    fetchData();
  }, [auctions]);

  const postBid = async (bid: Bid, value: number, item: AuctionItem) => {
    bid.biddedAmount = value;
    const result = await axios.patch(url.concat("/".concat(bid.auctionID.toString())), bid);

    item = result.data;
  }

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

  if (auctions.length > 0) {
    content.current = (
      <CardGroup>
        {auctions.map((item) => (
          <AuctionCard item={item}/>
        ))}
      </CardGroup>
    )
  }
  return content.current;
}