import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Switch, Redirect, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Nav, Navbar } from "react-bootstrap";
import './App.css';
import LoginPage from "./Pages/LoginPage";
import AuctionsPage from "./Pages/AuctionsPage";
import ItemDisplayPage from "./Pages/ItemDisplayPage";
import {AuctionItem, Product, User, Bid} from "./Model/auction_types";

function App() {
  var starteruser: User = {id: 0, wallet: 0, email: "", bids: []}
  var starterproduct: AuctionItem = {id: 0, name: "", top_bidder: starteruser, product: {id: 0, name: ""}, highest_bid: 0, description: "" }
  const [displayedProduct, SetDisplayedProduct] = useState(starterproduct);
  return (
      <Router>
        <Navbar
          bg = "dark"
          variant = "dark"
          >
            <Nav>
              <Nav.Item>
                <Link className = "nav-link" to = "/login">
                  Log in
                </Link>
              </Nav.Item>
              <Nav.Item>
                <Link className = "nav-link" to = "/auctions">
                  Browse
                </Link>
              </Nav.Item>
            </Nav>
          </Navbar>
          <Switch>
            <Route exact path="/login">
              <LoginPage/>
            </Route>
            <Route exact path="/">
              <Redirect to="/login"/>
            </Route>
            <Route exact path="/auctions">
              <AuctionsPage DetailsHandler = {SetDisplayedProduct}/>
            </Route>
            <Route exact path={"/auctions/".concat(displayedProduct.id.toString())}>
              <ItemDisplayPage auction = {displayedProduct}/>
            </Route>
          </Switch>
      </Router>
  )
}

export default App;
