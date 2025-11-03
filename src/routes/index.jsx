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
              path="/my_store/:id/*"
              element={
                <ProtectedRoute>
                  <HomeStore />
                </ProtectedRoute>
              }
            >
              <Route path="inventary" element={<Inventary />} />
            </Route>
            <Route
              path="/my_profile/:id/*"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/my_cart/:id"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFoud />} />
             <Route path="/store/:id/*" element={<StorePage />} />
            <Route path="/product/:id" element={<ProductPage />} />

            {/*    //auth*/}
          </Routes>
        </Router>
      </AuthProvider>
    );
  }
}
