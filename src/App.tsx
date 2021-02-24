import React from 'react';
import { BrowserRouter as Router, Switch, Redirect, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Nav, Navbar } from "react-bootstrap";
import './App.css';
import LoginPage from "./Pages/LoginPage";

function App() {
  return (
      <Router>
        <Navbar
          bg = "dark"
          variant = "dark"
          >
            <Nav className="container-fluid">
              <Nav.Item>
                <Link className = "nav-link" to = "/login">
                  Login
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
          </Switch>
      </Router>
  )
}

export default App;
