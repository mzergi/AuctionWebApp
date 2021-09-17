import React, {useEffect} from 'react';
import {Link, Redirect, Route, Router, Switch} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import {Col, Nav, Navbar, Row} from "react-bootstrap";
import './App.css';
import SearchBar from '../Components/SearchBar'
import LoginPage from "../Pages/LoginPage";
import AuctionsPage from "../Pages/AuctionsPage";
import ItemDisplayPage from "../Pages/ItemDisplayPage";
import {AuctionItem} from "../Model/auction_types";
import {useAppDispatch, useAppSelector} from './hooks';
import QueriedAuctionsPage from '../Pages/QueriedAuctionsPage';
import "../styles/auctionspage_styles.css";
import history from "./history";
import SignOutButton from "../Components/SignOutButton";
import CreateAuctionPage from "../Pages/CreateAuctionPage";
import {store} from '../App/store';
import {LoginActions} from "../Reducers/UserLoginReducer";
import "../styles/navbar-logged-in.css";
import MyBidsPage from "../Pages/MyBidsPage";
import {FaUserCircle, FaWallet} from 'react-icons/fa';
import ProfilePage from "../Pages/ProfilePage";
import {HubConnectionState} from "@microsoft/signalr";
import MyAuctionsPage from "../Pages/MyAuctionsPage";
import WalletPage from "../Pages/WalletPage";

function App() {
  const displayedItem = useAppSelector(state => state.details.auctionitem);

  const categoryID = useAppSelector(state => state.items.categoryID);

  let q = useAppSelector(state => state.items.items)

  const dispatch = useAppDispatch();

  let connection = store.getState().connection.connection;

  useEffect(() => {
    (async () => {
      if(connection.state === HubConnectionState.Disconnected)
      await connection.start();
    })()
  }, []);

  if (localStorage.jwtToken) {
    dispatch(LoginActions.checkAuthentication());
  }
  else {
    localStorage.clear();
    history.push("/login");
  }

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
        <Nav className="d-flex sm-4 align-items-center">
          <Nav.Item>
            <div className="username-on-navbar">{store.getState().loginstate.user.name}</div>
          </Nav.Item>
          <Nav.Item style={{marginLeft:"2rem"}}>
            <Link className="nav-link" to="/auctions">
              Browse
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link className="nav-link" to="/followed">
              Followed auctions
            </Link>
          </Nav.Item>
          <Nav.Item style={{marginRight:"9rem"}}>
            <Link className="nav-link" to="/create-auction">
              Create auction
            </Link>
          </Nav.Item>
        </Nav>
        <Col className="ml-auto" sm={1}>
          <SearchBar />
        </Col>
        <div>
          <Row>
            <Nav>
              <Nav.Item>
                <Link className="nav-link" to="/my-auctions">
                  My auctions
                </Link>
              </Nav.Item>
            </Nav>
            <Col>
                <Link className="nav-link user-icon" style={{marginTop: "0rem"}} to="/profile">
                  <FaUserCircle/>
                </Link>
            </Col>
          </Row>
        </div>
          < WalletPage />
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
        <Route path={"/auctions/search"} component={() => <QueriedAuctionsPage items={querieditems} categoryID={categoryID} />} />
        <Route exact path={"/create-auction"}>
          <CreateAuctionPage/>
        </Route>
        <Route exact path="/followed">
          <MyBidsPage/>
        </Route>
        <Route exact path="/login">
            <LoginPage />
        </Route>
        <Route exact path="/profile">
            <ProfilePage />
        </Route>
        <Route exact path="/my-auctions">
          <MyAuctionsPage />
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
