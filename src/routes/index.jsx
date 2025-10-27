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

export default class index extends Component {
  render() {
    return (
      <AuthProvider>
        <Router>
          <NavBar />
          <Routes>
            <Route
              path="/"
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
            <Route path="/create_store" element={<CreateStore/>} />
            {/* <Route path="/riesgosapp/analisis/*" element={<Analisis />}>
            <Route path="alertmap" element={<Alerts />} />
            <Route path="threatmap" element={<Dangermap />} />
            <Route path="geologia" element={<Geologia />} />
            <Route path="fire_camp" element={<FireCamp />} />
            <Route path="risk" element={<RiesgosPage />} />
          </Route> */}
            <Route path="*" element={<NotFoud />} />

            {/*    //auth*/}
          </Routes>
        </Router>
      </AuthProvider>
    );
  }
}
