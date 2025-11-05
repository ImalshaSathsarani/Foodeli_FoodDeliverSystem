import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const navStyle = {
    padding: "15px",
    color: "white",
    textDecoration: "none",
    display: "block"
  };

  const activeStyle = {
    backgroundColor:'#a83232',
    borderRadius:'8px',
    margin:'7px'
  }
  return (
    <div style={{ width: "220px", backgroundColor: "#d35252", color: "white", padding: "20px 0" }}>
      <h3 style={{ textAlign: "center" }}>Admin Panel</h3>
    <NavLink to="/adminDashboard" style={({isActive})=>(isActive? {...navStyle, ...activeStyle}: navStyle)}>Dashboard</NavLink>
     <NavLink to="/addfood" style={({isActive})=>(isActive? {...navStyle, ...activeStyle}: navStyle)}>Add Food</NavLink>
      <NavLink to="/foodprediction" style={({isActive})=>(isActive? {...navStyle, ...activeStyle}: navStyle)}>Sales Prediction</NavLink>
       <NavLink to="/allorders" style={({isActive})=>(isActive? {...navStyle, ...activeStyle}: navStyle)}>Orders</NavLink>
        <NavLink to="/adminProfile" style={({isActive})=>(isActive? {...navStyle, ...activeStyle}: navStyle)}>Profile</NavLink>
          <NavLink to="/allFoods" style={({isActive})=>(isActive? {...navStyle, ...activeStyle}: navStyle)}>All Foods</NavLink>
    </div>
  );
}
