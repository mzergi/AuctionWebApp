import React, { useState, useEffect } from 'react';
import { Router, Switch, Redirect, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Nav, Navbar, Row, Col } from "react-bootstrap";
import './App.css';
import SearchBar from '../Components/SearchBar'
import LoginPage from "../Pages/LoginPage";
import AuctionsPage from "../Pages/AuctionsPage";
import ItemDisplayPage from "../Pages/ItemDisplayPage";
import { AuctionItem, Product, User, Bid } from "../Model/auction_types";
import { useAppSelector, useAppDispatch } from './hooks';
import QueriedAuctionsPage from '../Pages/QueriedAuctionsPage';
import "../styles/auctionspage_styles.css";
import history from "./history";
import SignOutButton from "../Components/SignOutButton";

function App() {
  const displayedItem = useAppSelector(state => state.details.auctionitem);

  const categoryID = useAppSelector(state => state.items.categoryID);

  let q = useAppSelector(state => state.items.items)

  const querieditems: AuctionItem[] = (q.length > 0) ? q : [];
  const notLoggedInRoutes = () => {
    return (
      <div>
        <Navbar
          bg="dark"
          variant="dark"
          className="container-fluid auctionsnavbar"
        >
          <Nav>
            <Nav.Item>
              <Link className="nav-link" to="/login">
                Log in
                </Link>
            </Nav.Item>
          </Nav>
        </Navbar>
        <Switch>
          <Route exact path="/login">
            <LoginPage />
          </Route>
        </Switch>
      </div>
    );
  };

  const loggedInRoutes = () => {
    return (
      <div>
        <Navbar
        bg="dark"
        variant="dark"
        className="container-fluid auctionsnavbar"
      >
        <Nav className="d-flex sm-4">
          <Nav.Item style={{marginRight:"9rem"}}>
            <Link className="nav-link" to="/auctions">
              Browse
                </Link>
          </Nav.Item>
        </Nav>
        <Col className="ml-auto" sm={1}>
          <SearchBar />
        </Col>
        <SignOutButton/>
      </Navbar>
      <Switch>
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>
        <Route exact path="/auctions">
          <AuctionsPage />
        </Route>
        <Route exact path={"/auctions/".concat(displayedItem.id.toString())}>
          <ItemDisplayPage auction={displayedItem} />
        </Route>
        <Route exact path={"/auctions/category/".concat(categoryID.toString())} component={() => <QueriedAuctionsPage items={querieditems} categoryID={categoryID} />} />
        <Route exact path={"/auctions/search"} component={() => <QueriedAuctionsPage items={querieditems} categoryID={categoryID} />} />
        <Route exact path="/login">
            <LoginPage />
        </Route>
      </Switch>
      </div>
    )
  }
  return (
    <Router history = {history}>
      <Switch>
       <Route path="/login" component={notLoggedInRoutes}/>
       <Route component={loggedInRoutes}/>
      </Switch>
    </Router>
  )
}

export default App;
