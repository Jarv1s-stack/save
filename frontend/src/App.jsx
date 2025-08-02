import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Profile from "./pages/Profile";
import CreateEvent from "./pages/CreateEvent";
import EventDetail from "./pages/EventDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthContext } from "./context/AuthContext";
import Footer from "./components/Footer"

function PrivateRoute({ children }) {
  const { user } = React.useContext(AuthContext);
  const location = useLocation();
  return user
    ? children
    : <Navigate to="/login" state={{ from: location }} replace />;
}

export default function App() {
  return (
    <>
      <Header />
      <main style={{ minHeight: "90vh", padding: "32px 0 0 0", background: "inherit" }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/shop" element={<PrivateRoute><Shop /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/create-event" element={<PrivateRoute><CreateEvent /></PrivateRoute>} />
          <Route path="/events/:id" element={<PrivateRoute><EventDetail /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer></Footer>
    </>
  );
}
