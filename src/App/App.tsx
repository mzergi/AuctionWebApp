import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Switch, Redirect, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Nav, Navbar } from "react-bootstrap";
import './App.css';
import LoginPage from "../Pages/LoginPage";
import AuctionsPage from "../Pages/AuctionsPage";
import ItemDisplayPage from "../Pages/ItemDisplayPage";
import {AuctionItem, Product, User, Bid} from "../Model/auction_types";
import { useAppSelector, useAppDispatch } from './hooks';

function App() {
  const displayedItem = useAppSelector(state => state.details.auctionitem);
  useAppDispatch();
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
              <AuctionsPage/>
            </Route>
            <Route exact path={"/auctions/".concat(displayedItem.id.toString())}>
              <ItemDisplayPage auction = {displayedItem}/>
            </Route>
          </Switch>
      </Router>
  )
}

export default App;
