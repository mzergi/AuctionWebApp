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
import { AuctionItem, Bid } from "../Model/auction_types";
import { useAppSelector, useAppDispatch } from "../App/hooks";
import axios from "axios";
import * as signalR from "@microsoft/signalr";
import "../styles/auctionspage_styles.css";
import FollowedAuctionCardContent from "../Components/FollowedAuctionCardContent";


// Todo: SEND BID ON MODAL BID CLICK
export default function MyBidsPage() {
  const [auctions, setAuctions] = useState([] as AuctionItem[]);
  const [modalAuction, setModalAuction] = useState({} as AuctionItem);
  const [showModal, setShowModal] = useState(false);

  const userId = useAppSelector((state) => state.loginstate.user.id);

  const url = "http://localhost:5000/api/auctionspage/auctions/followed-by/";

  const fetchData = async () => {
    const result = await axios(url.concat(userId.toString()));

    setAuctions([...result.data]);
  };

  const connection = useAppSelector((state) => state.connection.connection);

  connection.on("bidReceived", async () => {
    await fetchData();
  });

  useEffect(() => {
    (async () => {
      await fetchData();
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

  function openModal(){
    setShowModal(true);
  }

  function closeModal(){
    setShowModal(false);
  }

  const handleClick = (item: AuctionItem) => {
    setModalAuction({...item});
    setShowModal(true);
  };

  return (
      <Container fluid>
        <Row className={"justify-content-center mt-4"}>
          <h2><b>Followed auctions</b></h2>
        </Row>
        <Row className={"justify-content-center mt-2"}></Row>
        <Table bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Description</th>
              <th>Current bid</th>
              <th>Your bid</th>
              <th>Starting price</th>
              <th>Start of auction</th>
              <th>End of auction</th>
            </tr>
          </thead>
          <tbody>
          {auctions.map((a) => (
              <tr onClick={() => handleClick(a)}>
                <td>{auctions.indexOf(a) + 1}</td>
                <td>{a.product.name}</td>
                <td>{a.description}</td>
                <td>{a.topBid.biddedAmount}</td>
                <td>{findHighestBidByUser(a) === 0 ? 'No bids yet!' : findHighestBidByUser(a)}</td>
                <td>{a.startingPrice}</td>
                <td>{a.startOfAuction}</td>
                <td>{a.endOfAuction}</td>
              </tr>
          ))}
          </tbody>
        </Table>
        <Modal show={showModal} onHide={closeModal}>
          <Modal.Header>
            <Modal.Title>
              {modalAuction?.product?.name}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Table borderless>
              <thead>
                <tr>
                  <th>
                    Highest bid
                  </th>
                  <th>
                    Your bid
                  </th>
                  <th>
                    Quick bid
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className={"flex align-items-center"}>
                  <td>
                    {modalAuction?.topBid?.biddedAmount}
                  </td>
                  <td>
                    {findHighestBidByUser(modalAuction)}
                  </td>
                  <td>
                    <Form>
                      <Form.Group>
                        <Row>
                        <Col md = {8}>
                      <Form.Control name={"bid_input"} type={"number"} placeholder={"Enter bid"}/>
                        </Col>
                        <Col>
                          <Button variant={"success"}>
                            Bid
                          </Button>
                        </Col>
                        </Row>
                      </Form.Group>
                    </Form>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Modal.Body>
          <Modal.Footer>
            <Button variant={"secondary"} onClick={closeModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
  )
}
