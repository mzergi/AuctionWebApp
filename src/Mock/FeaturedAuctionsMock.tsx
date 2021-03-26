import React from "react";
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
} from "react-bootstrap";
import { Product, User, AuctionItem, Bid } from "../Model/auction_types";
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route,
  Link,
} from "react-router-dom";
import ItemDisplayPage from "../Pages/ItemDisplayPage";


/*export default function FeaturedAuctionsMock() {
  let user: User = {
    id: 1,
    balance: 150000,
    email: "kisbela@gmail.com",
    bids: [],
  };
  let products: Product[] = [
    { id: 1, name: "iPhone X" },
    { id: 2, name: "Samsung Galaxy A41" },
    { id: 3, name: "IKEA Jahrmürgangül asztal" },
  ];
  let auctions: AuctionItem[] = [
    {
      id: 1,
      top_bidder: user,
      product: products[0],
      name: products[0].name,
      highest_bid: 150,
      description: "Apple iPhone X mobile phone, used for 3 months",
      highlighted: true
    },
    {
      id: 2,
      top_bidder: user,
      product: products[1],
      name: products[1].name,
      highest_bid: 170,
      description: "Samsung Galaxy A41 telefon, fekete",
      highlighted: true
    },
    {
      id: 3,
      top_bidder: user,
      product: products[2],
      name: products[2].name,
      highest_bid: 2100,
      description: "IKEA Jahrmürgangühl étkezőasztal, fehér",
      highlighted: true
    },
  ];
  user.bids = [
    { auction: auctions[0], bidder: user },
    { auction: auctions[1], bidder: user },
    { auction: auctions[2], bidder: user },
  ];
  return (
    <CardGroup>
      {auctions.map((item) => (
        <Card className="d-flex justify-content-center">
          <Card.Body>
            <Card.Title>{item.name}</Card.Title>
            Picture
            <br />
            Goes
            <br />
            Here
            <br />
            {item.description}
          </Card.Body>
          <Card.Footer>
            <Link to={"/auctions/".concat(item.id.toString())}>Details</Link>
            <br />
            Highest bid: {item.highest_bid}
            <Form>
              <Form.Label>Your bid: </Form.Label>
              <Form.Control type="number" placeholder="Enter bid" />
              <Button variant="success" className="mt-2">
                Bid
              </Button>
            </Form>
          </Card.Footer>
        </Card>
      ))}
    </CardGroup>
  );
}
*/