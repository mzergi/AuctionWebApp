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
  const [modalAuction, setModalAuction] = useState({} as AuctionItem);
  const [showModal, setShowModal] = useState(false);
  const [modalBid, setModalBid] = useState(0);

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

  async function sendBid()
  {
    let bid: Bid = { id: 0, biddedAmount: modalBid, auctionID: modalAuction.id, bidderID: userId, bidder: {} as User, bidTime: new Date() }
    const result = await axios.patch(url, bid);
    await fetchData();
    closeModal();
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
            </tr>
          </thead>
          <tbody>
          {auctions.map((a) => (
              <tr onClick={() => handleClick(a)} className={"table-row"}>
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
            <Link to={"/auctions/".concat(modalAuction?.id?.toString())} onClick={() => {
              store.dispatch(setDisplayed(modalAuction));
            }
            }>Details</Link>
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
                      <Form.Control name={"bid_input"} type={"number"} placeholder={"Enter bid"} onChange = {(e) => {setModalBid(parseInt(e.currentTarget.value))}} defaultValue = {modalAuction?.topBid?.biddedAmount}/>
                        </Col>
                        <Col>
                          <Button variant={"success"} onClick = {sendBid}>
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
            <Button variant={"secondary"} onClick={async () => {closeModal();}}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
  )
}
