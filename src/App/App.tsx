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
import QueriedAuctionsPage from '../Pages/QueriedAuctionsPage';

function App() {
  const displayedItem = useAppSelector(state => state.details.auctionitem);

  const categoryID = useAppSelector(state => state.items.categoryID);

  debugger;

  let q = useAppSelector(state => state.items.items)

  useAppDispatch();

  const querieditems : AuctionItem[] = (q.length > 0) ? q : [];

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
            <Route exact path={"/auctions/category/".concat(categoryID.toString())} component={() => <QueriedAuctionsPage items = {querieditems} categoryID = {categoryID}/>}/>
          </Switch>
      </Router>
  )
}

export default App;
