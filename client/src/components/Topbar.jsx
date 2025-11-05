import React from "react";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../redux/reducers/UserSlice";
import { openSnackbar } from "../redux/reducers/SnackBarSlice";

export default function Topbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () =>{
    dispatch(logout());
    localStorage.removeItem("foodeli-app-token");

    dispatch(
      openSnackbar({
        message:"Logged out successfully",
        severity:"success",
      })
    );
    navigate("/");
  }
  return (
    <div style={{ backgroundColor: "#f5f5f5", padding: "10px 20px", borderBottom: "1px solid #ddd", display:'flex', justifyContent:"flex-end", alignItems:"center", gap:" 15px" }}>
     <Link to = "/adminProfile"><FaUserCircle size ={20} color='red' title="Admin Profile"/></Link>
     <FaSignOutAlt size ={20} color='red' title="Logout" style={{ cursor: "pointer" }}  onClick={handleLogout}/>
    </div>
  );
}