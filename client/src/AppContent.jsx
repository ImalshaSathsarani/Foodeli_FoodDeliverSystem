import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from './components/Navbar';
import Authentication from "./pages/Authentication";
import Home from './pages/Home';
import Favourites from "./pages/Favourites";
import Cart from "./pages/Cart";
import FoodDetails from "./pages/FoodDetails";
import FoodListing from "./pages/FoodListing";
import AddFoodsForm from "./pages/Admin/AddFoodsForm";
import MyOrders from "./pages/MyOrders";
import AdminOrders from "./pages/Admin/AdminOrders";
import OrderDetails from "./pages/OrderDetails";
import FoodPrediction from './pages/Admin/FoddPrediction';
import UserProfile from "./pages/UserProfile";
import EditProfile from "./pages/EditProfile";
import ChangePassword from "./pages/ChangePassword";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import { useSelector } from "react-redux";
import ProtectedRoute from "./components/ProtectedRoutes";
import AdminProfile from "./pages/Admin/AdminProfile";
import AdminChangePassword from "./pages/Admin/AdminChangePassword";
import AdminEditProfile from "./pages/Admin/AdminEditProfile";
import AllFoods from "./pages/Admin/AllFoods";
import AdminFoodDetails from "./pages/Admin/AdminFoodDetails";
import UpdateFoodForm from "./pages/Admin/UpdateFoodForm";
import Contact from "./pages/Contact";
import Search from "./pages/Search";

export default function AppContent({ currentUser, openAuth, setOpenAuth }) {
  const { open } = useSelector((state) => state.snackbar);
  const location = useLocation();

  const adminRoutes = [
    '/adminDashboard',
    '/allorders',
    '/addfood',
    '/foodprediction',
    '/adminProfile',
    '/adminChangePassword',
    '/adminEditProfile',
    '/allFoods',
    '/admin/dishes',
    '/adminUpdateFood'
  ];

  //const hideNavbar = adminRoutes.includes(location.pathname);
  const hideNavbar = adminRoutes.some(route =>
  location.pathname.startsWith(route)
);


  return (
    <>
      {!hideNavbar && (
        <Navbar
          setOpenAuth={setOpenAuth}
          openAuth={openAuth}
          currentUser={currentUser}
        />
      )}

      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/favourite" exact element={<Favourites />} />
        <Route path="/cart" exact element={<Cart />} />
        <Route path="/dishes/:id" exact element={<FoodDetails />} />
        <Route path="/dishes" exact element={<FoodListing />} />
        <Route path="/search" exact element={<Search/>} />
        <Route 
         path="/addfood" 
        element={<ProtectedRoute requiredRole="admin">
          <AddFoodsForm/></ProtectedRoute>} />
        <Route path="/myorders" exact element={<MyOrders />} />
        <Route 
        path="/allorders" 
        element={<ProtectedRoute requiredRole="admin">
          <AdminOrders/>
        </ProtectedRoute>} />
        <Route path="/myorders/order/:id" exact element={<OrderDetails />} />
        <Route 
        path="/foodprediction" 
        element={<ProtectedRoute requiredRole="admin">
          <FoodPrediction/>
        </ProtectedRoute>} />
        <Route path="/userprofile" exact element={<UserProfile />} />
        <Route path="/editProfile" exact element={<EditProfile />} />
        <Route path="/changePassword" exact element={<ChangePassword />} />
        <Route path="/contact" exact element = {<Contact/>}/>
        <Route 
        path="/adminDashboard" 
        element={<ProtectedRoute requiredRole="admin">
          <AdminDashboard/>
        </ProtectedRoute>} />
        <Route 
        path="/adminProfile" 
        element={<ProtectedRoute requiredRole="admin">
          <AdminProfile/>
        </ProtectedRoute>} />
         <Route 
        path="/adminChangePassword" 
        element={<ProtectedRoute requiredRole="admin">
          <AdminChangePassword/>
        </ProtectedRoute>} />
         <Route 
        path="/adminEditProfile" 
        element={<ProtectedRoute requiredRole="admin">
          <AdminEditProfile/>
        </ProtectedRoute>} />
        <Route 
        path="/allFoods" 
        element={<ProtectedRoute requiredRole="admin">
          <AllFoods/>
        </ProtectedRoute>} />
         <Route 
        path="/admin/dishes/:id" 
        element={<ProtectedRoute requiredRole="admin">
          <AdminFoodDetails/>
        </ProtectedRoute>} />
         <Route 
        path="/adminUpdateFood/:id" 
        element={<ProtectedRoute requiredRole="admin">
          <UpdateFoodForm/>
        </ProtectedRoute>} />
      </Routes>

      {openAuth && (
        <Authentication setOpenAuth={setOpenAuth} openAuth={openAuth} />
      )}
    </>
  );
}
