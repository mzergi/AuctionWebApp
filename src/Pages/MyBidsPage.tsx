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
import {AuctionItem, Bid, User} from "../Model/auction_types";
import { useAppSelector, useAppDispatch } from "../App/hooks";
import axios from "axios";
import * as signalR from "@microsoft/signalr";
import "../styles/auctionspage_styles.css";
import {store} from "../App/store";
import {setDisplayed} from "../Reducers/AuctionDetailsReducer";
import {Link} from "react-router-dom";

export default function MyBidsPage() {
  const [auctions, setAuctions] = useState([] as AuctionItem[]);
  const [bidInputs, setBidInputs] = useState([] as number[]);

  const userId = useAppSelector((state) => state.loginstate.user.id);

  const url = "http://localhost:5000/api/auctionspage/auctions/followed-by/";

  const fetchDataInit = async () => {
    const result = await axios(url.concat(userId.toString()));

    setAuctions([...result.data]);
    let bids = [...bidInputs];
    auctions.forEach(a => {bids.push(findHighestBidByUser(a))})
    setBidInputs([...bids]);
  };

  const fetchData = async () => {
    const result = await axios(url.concat(userId.toString()));
    setAuctions([...result.data]);
  }

  const connection = useAppSelector((state) => state.connection.connection);

  connection.on("bidReceived", async () => {
    await fetchData();
  });

  useEffect(() => {
    (async () => {
      await fetchDataInit();
    })()
  }, []);

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

  async function sendBid(auction: AuctionItem)
  {
    const index = auctions.indexOf(auction);
    let bid: Bid = { id: 0, biddedAmount: bidInputs[index], auctionID: auction.id, bidderID: userId, bidder: {} as User, bidTime: new Date() }
    const result = await axios.patch("http://localhost:5000/api/auctionspage/auctions/".concat(auction.id.toString()), bid);
    await fetchData();
  }

  function setBid(value: number, auction: AuctionItem) {
    const index = auctions.indexOf(auction);
    let bids = [...bidInputs];
    bids[index] = value;
    setBidInputs([...bids]);
  }

  return (
      <Container fluid>
        <Row className={"justify-content-center mt-4"}>
          <h2><b>Followed auctions</b></h2>
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
              <th>Your bid</th>
              <th>Starting price</th>
              <th>Start of auction</th>
              <th>End of auction</th>
              <th>Quick bid</th>
            </tr>
          </thead>
          <tbody>
          {auctions.map((a) => (
              <tr className={"table-row"}>
                <td>{auctions.indexOf(a) + 1}</td>
                <td>{a.product.name}</td>
                <td>{a.description}</td>
                <td>{a.topBid.biddedAmount}</td>
                <td>{findHighestBidByUser(a) === 0 ? 'No bids yet!' : findHighestBidByUser(a)}</td>
                <td>{a.startingPrice}</td>
                <td>{a.startOfAuction}</td>
                <td>{a.endOfAuction}</td>
                <td><Form>
                      <Form.Group>
                      <Row>
                        <Col md = {7}>
                      <Form.Control 
                      name={"bid_input"} 
                      type={"number"} 
                      placeholder={"Enter bid"} 
                      onChange = {(e) => {setBid(parseInt(e.currentTarget.value), a)}} 
                      defaultValue = {a?.topBid?.biddedAmount}/>
                      </Col>
                        <Col>
                          <Button variant={"success"} onClick = {async () => {await sendBid(a)}}>
                            Bid
                          </Button>
                        </Col>
                        </Row>
                      </Form.Group>
                    </Form></td>
              </tr>
          ))}
          </tbody>
        </Table>
      </Container>
  )
}
