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
} from "react-bootstrap";
import ItemDisplayPage from "./ItemDisplayPage";
import { AuctionItem, Bid } from "../Model/auction_types";
import { useAppSelector, useAppDispatch } from "../App/hooks";
import axios from "axios";
import * as signalR from "@microsoft/signalr";
import "../styles/auctionspage_styles.css";
import FollowedAuctionCardContent from "../Components/FollowedAuctionCardContent";

export default function MyBidsPage() {
  const [auctions, setAuctions] = useState([] as AuctionItem[]);

  const [alreadyQueried, setQueried] = useState(false);

  const [auctionClicked, setClicked] = useState(false);

  const [displayedItem, setDisplayed] = useState({} as AuctionItem);

  const [displayPage, setDisplayPage] = useState(<Col></Col>);

  const userId = useAppSelector((state) => state.loginstate.user.id);

  const url = "http://localhost:5000/api/auctionspage/auctions/followed-by/";

  let left = useRef(<Col></Col>);

  let content = useRef(
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Spinner animation="border" role="status" className="sidebar-sticky">
        <span className="sr-only">Loading...</span>
      </Spinner>
    </div>
  );

  const fetchData = async () => {
    const result = await axios(url.concat(userId.toString()));

    setAuctions(result.data);

    setQueried(true);
  };

  const connection = useAppSelector((state) => state.connection.connection);

  connection.on("bidReceived", () => {
    fetchData();
  });

  let getDisplayPage = () => {
    if(auctionClicked)
      return <Col><ItemDisplayPage auction={displayedItem}/></Col>
    else
      return <Col></Col>
  }

  useEffect(() => {
    fetchData();
    if (alreadyQueried) {
      if (auctions.length > 0) {
        left.current = (
          <Col className="followed-auctions-wrapper">
            {auctions.map((item) => (
              <Card
                className="followed-auctions-card"
                onClick={() => handleClick(item)}
              >
                <Card.Body>{item.product.name}</Card.Body>
              </Card>
            ))}
          </Col>
        );
      } else {
        left.current = (
          <Col>
            <h3 style={{ marginTop: "30%" }}>You have no followed auctions.</h3>
          </Col>
        );
      }
    }
  
    content.current = (
      <Container>
        <Row>
          {left.current}
          {getDisplayPage()}
        </Row>
      </Container>
    );
  }, [auctions]);

  useEffect(() => {
    if (auctionClicked) {
      setDisplayPage(<Col>{displayedItem.product.name}<ItemDisplayPage auction={displayedItem} /></Col>);
    }
    content.current = (
      <Container>
        <Row>
          {left.current}
          {getDisplayPage()}
        </Row>
      </Container>
    );
  }, [displayedItem]);

  const handleClick = (item: AuctionItem) => {
    setClicked(true);
    setDisplayed(item);
  };

  return content.current;
}
