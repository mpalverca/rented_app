import React, { Component } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";

import ProtectedRoute, { PublicRoute } from "./ProtectedRoute";
//Geojson
import NotFoud from "./NotFoud";
import Home from "./home/home";
import HomeStore from "./home/homeStore";
import Login from "./auth/Login";
import NavBar from "../components/Navbar/NavBar";
import { AuthProvider } from "../context/AuthContext";
import Register from "./auth/Register";
import CreateStore from "./store/createStore";
import Inventary from "./store/inventory";
import ProductPage from "./store/product/productPage";
import Profile from "./profile/Profile";
import Cart from "./profile/cart";
import StorePage from "./store/StorePage";
import Horarios from "./store/product/timer/horarios";
import RentedPage from "./profile/rented/rentedPage";
import RentedStore from "./store/rented/rented";
import RentedDetail from "./profile/rented/rentedDetail";
import RentedDetailStore from "./store/rented/rentedDetail";
import Stores from "./stores";

export default class index extends Component {
  render() {
    return (
      <AuthProvider>
        <Router>
          <NavBar />
          <Routes>
            <Route
              path=""
              element={
                /* <ProtectedRoute>
                <Home />{" "}
              </ProtectedRoute> */
                <Home />
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
            <Route path="/rented_app" element={<Home />} />
            <Route path="/create_store" element={<CreateStore />} />
            <Route
              path="/my_store/:storeId/*"
              element={
                <ProtectedRoute>
                  <HomeStore />
                </ProtectedRoute>
              }
            >
              <Route path="inventary" element={<Inventary />} />
              <Route path="timer" element={<Horarios />} />
              <Route path="rented" element={<RentedStore />} />
              <Route
                path="rented/rented_detail/:rentedId"
                element={<RentedDetailStore />}
              />
            </Route>
            <Route
              path="/my_profile/:userId/*"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            >
              <Route path="my_cart" element={<Cart />} />
              <Route path="rented" element={<RentedPage />} />
              <Route
                path="rented/rented_detail/:rentedId"
                element={<RentedDetail />}
              />
            </Route>
            <Route path="*" element={<NotFoud />} />

            <Route path="/stores" element={<Stores />} />
           <Route path="/store/:storeId/*" element={<StorePage />} />
            <Route path="/product/:productId" element={<ProductPage />} />
            {/*    //auth*/}
          </Routes>
        </Router>
      </AuthProvider>
    );
  }
}
