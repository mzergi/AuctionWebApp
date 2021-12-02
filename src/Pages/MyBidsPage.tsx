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
import { FaSearch } from "react-icons/fa";

export default function MyBidsPage() {
  const [auctions, setAuctions] = useState([] as AuctionItem[]);
  const [filteredAuctions, setFilteredAuctions] = useState(auctions);
  const [bidInputs, setBidInputs] = useState([] as number[]);

  const [searchQuery, setSearch] = useState("");
  const [leadingBidsSelected, setLeadingBids] = useState(false);
  const [withBidsSelected, setWithBids] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);

  const userId = useAppSelector((state) => state.loginstate.user.id);

  const url = "http://localhost:5000/api/auctionspage/auctions/followed-by/";

  const fetchDataInit = async () => {
    const result = await axios(url.concat(userId.toString()));

    setAuctions([...result.data]);
    setFilteredAuctions([...result.data]);
    let bids = [...bidInputs];
    auctions.forEach(a => {bids.push(findHighestBidByUser(a))})
    setBidInputs([...bids]);
  };

  useEffect(() => {
    if (searchQuery === "") {
      let filtered = [...auctions];
      if (leadingBidsSelected || withBidsSelected) {
        if (leadingBidsSelected) {
          filtered = filtered.filter((a) => a.topBid.bidderID == userId);
        } else if (withBidsSelected) {
          filtered = filtered.filter((a) => a.topBid.bidderID != userId);
        }
      }
      if (hasStarted || hasEnded) {
        if (hasStarted) {
          filtered = filtered.filter((a) => new Date(a.startOfAuction).getTime() < new Date().getTime());
        } else if (hasEnded) {
          filtered = filtered.filter((a) => new Date(a.endOfAuction).getTime() < new Date().getTime());
        }
      }
      setFilteredAuctions([...filtered]);
    } else {
      let filtered = auctions.filter(
        (a) =>
          a.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.product.category.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          a.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (leadingBidsSelected || withBidsSelected) {
        if (leadingBidsSelected) {
          filtered = filtered.filter((a) => a.topBid.bidderID == userId);
        } else if (withBidsSelected) {
          filtered = filtered.filter((a) => a.topBid.bidderID != userId);
        }
      }
      if (hasStarted || hasEnded) {
        if (hasStarted) {
          filtered = filtered.filter((a) => new Date(a.startOfAuction).getTime() < new Date().getTime());
        } else if (hasEnded) {
          filtered = filtered.filter((a) => new Date(a.endOfAuction).getTime() < new Date().getTime());
        }
      }
      setFilteredAuctions([...filtered]);
    }
  }, [searchQuery, leadingBidsSelected, withBidsSelected, hasStarted, hasEnded]);

  const fetchData = async () => {
    const result = await axios(url.concat(userId.toString()));
    setAuctions([...result.data]);
  }

  const connection = useAppSelector((state) => state.connection.connection);


  useEffect(() => {
    (async () => {
      await fetchDataInit();
      connection.on("bidReceived", async () => {
        await fetchData();
      });
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
              <Col sm = {12} className="mb-1">
      <Row className={"form-filter-wrapper"}>
        <Col sm={2}>
          <Form>
            <Form.Group>
              <Button
                className="filter-checkbox"
                style = {{background: hasStarted ? "blue" : "white", color: hasStarted ? "white" : "black"}}
                onClick={(e: any) => {
                  if (hasEnded && !hasStarted) {
                    setHasEnded(false);
                  }
                  setHasStarted(!hasStarted);
                }}
              >
                Started auctions only
              </Button>
            </Form.Group>
          </Form>
        </Col>
        <Col sm={2}>
        <Form>
            <Form.Group>
            <Button
                className="filter-checkbox"
                style = {{background: hasEnded ? "blue" : "white", color: hasEnded ? "white" : "black"}}
                onClick={(e: any) => {
                  if (!hasEnded && hasStarted) {
                    setHasStarted(false);
                  }
                  setHasEnded(!hasEnded);
                }}
              >
                Expired auctions only
              </Button>
            </Form.Group>
          </Form>
        </Col>
        <Col sm={2}>
        <Form>
            <Form.Group>
            <Button
                className="filter-checkbox"
                style = {{background: leadingBidsSelected ? "blue" : "white", color: leadingBidsSelected ? "white" : "black"}}
                onClick={(e: any) => {
                  if (withBidsSelected && !leadingBidsSelected) {
                    setWithBids(false);
                  }
                  setLeadingBids(!leadingBidsSelected);
                }}
              >
                Auctions you are leading
              </Button>
            </Form.Group>
          </Form>
        </Col>
        <Col sm={2}>
        <Form>
            <Form.Group>
            <Button
                className="filter-checkbox"
                style = {{background: withBidsSelected ? "blue" : "white", color: withBidsSelected ? "white" : "black"}}
                onClick={(e: any) => {
                  if (leadingBidsSelected && !withBidsSelected) {
                    setLeadingBids(false);
                  }
                  setWithBids(!withBidsSelected);
                }}
              >
                Auctions someone else is leading
              </Button>
            </Form.Group>
          </Form>
        </Col>
        <Col sm={4}>
          <Form>
            <Form.Group
              as={Row}
              controlId="searchBar"
              className="tableSearchBarWrapper"
            >
              <Col sm={9} className="pr-2 mt-2">
                <Form.Control
                  type="text"
                  placeholder="Filter items..."
                  className="tableSearchBarInput"
                  value={searchQuery}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </Col>
              <Form.Label column sm={1}>
                <FaSearch
                  style={{ color: "darkgray", marginBottom: "0.35rem" }}
                />
              </Form.Label>
            </Form.Group>
          </Form>
        </Col>
      </Row>
      </Col>
        <Row className={"justify-content-center mt-2"}></Row>
        <Table bordered hover>
          <thead>
            <tr>
              <th colSpan={8}>Followed auctions</th>
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
          {filteredAuctions.map((a, index) => (
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
