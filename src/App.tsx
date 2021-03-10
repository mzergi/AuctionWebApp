import React from 'react';
import { BrowserRouter as Router, Switch, Redirect, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Nav, Navbar } from "react-bootstrap";
import './App.css';
import LoginPage from "./Pages/LoginPage";
import AuctionsPage from "./Pages/AuctionsPage";

function App() {
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
              <AuctionsPage />
            </Route>
          </Switch>
      </Router>
  )
}

export default App;
