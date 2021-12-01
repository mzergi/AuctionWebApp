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

import * as signalR from "@microsoft/signalr";

interface AuctionCardsProps {
  highlighted: boolean,
  items: AuctionItem[]
}

export default function AuctionCards(Props: AuctionCardsProps){

  const url = (Props.highlighted ? "http://localhost:5000/api/auctionspage/auctions/highlighted" : "http://localhost:5000/api/auctionspage/auctions/basic");
  
  const [auctions, setAuctions] = useState(Props.items);

  const [queried, setQueried] = useState(Props.items.length ? true : false);

  const fetchData = async () => {
    if(!queried) {
      const result = await axios.get(url);

      setAuctions([...result.data]);
    }
  };

  useEffect(() => {
    (async () => {
      if (!(auctions.length > 0)){
        await fetchData();
      }
    })()
  });
  
  return (
    <>
    {auctions.map((item, index) => (
      <AuctionCard item={item} key={index}/>
    ))}
    </>
  )
}
