import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Redirect, Route, Link } from "react-router-dom";
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

function App() {
  const displayedItem = useAppSelector(state => state.details.auctionitem);

  const categoryID = useAppSelector(state => state.items.categoryID);

  let q = useAppSelector(state => state.items.items)

  useAppDispatch();

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
        <Nav>
          <Nav.Item>
            <Link className="nav-link" to="/auctions">
              Browse
                </Link>
          </Nav.Item>
        </Nav>
        <Col className="ml-auto align-items-end" sm={3}>
          <SearchBar />
        </Col>
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
      </Switch>
      </div>
    )
  }
  return (
    <Router>
      <Switch>
       <Route path="/login" component={notLoggedInRoutes}/>
       <Route component={loggedInRoutes}/>
      </Switch>
    </Router>
  )
}

export default App;
