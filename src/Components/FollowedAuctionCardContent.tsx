import React, { useState, useRef, useEffect } from "react";
import { AuctionItem } from "../Model/auction_types";
import { useAppSelector, useAppDispatch } from "../App/hooks";
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

import "../styles/auctionspage_styles.css";

interface FollowedAuctionCardContentProps {
  item: AuctionItem;
}

export default function FollowedAuctionCardContent(
  Props: FollowedAuctionCardContentProps
) {
  const [firstRenderOnly, setFirstRenderOnly] = useState(false);

  const [item, setItem] = useState(Props.item);

  let userId = useAppSelector((state) => state.loginstate.user.id);

  return (
    <Card
      className="followed-auctions-card"
    >
      <Card.Body>{Props.item.product.name}</Card.Body>
    </Card>
  );
}
