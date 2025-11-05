import axios from "axios";
import React, { useEffect, useState } from "react";
import { getSummary } from "../api";

function Card({ title, value }) {
  return (
    <div style={{ flex: 1, padding: "20px", backgroundColor: "#fff", border: "1px solid #ddd", borderRadius: "10px", boxShadow: '0 4px 8px rgba(0,0,0,0.1)', textAlign: "center" }}>
      <h4>{title}</h4>
      <p style={{ fontSize: "20px", fontWeight: "bold" }}>{value}</p>
    </div>
  );
}

export default function SummaryCards() {
  const [data, setData] =useState({});
  

  
  useEffect(() => {
    const fetchSummary = async () => {
    const token = localStorage.getItem('foodeli-app-token');
     if(token){
      try{
        const {data} = await getSummary(token);
        console.log("Fetched summary", data);
        setData(data);


      }catch(e){
        console.log("Error getting summary:",e.message)
      }
     }
    };
    fetchSummary();
  }, []);
  return (
    <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
      <Card title="Total Sales" value={`Rs. ${data.totalSales || 0}`} />
      <Card title="Total Orders" value={data.totalOrders || 0} />
      <Card title="Top Food" value={data.topFood || "N/A"} />
      <Card title="Customers" value={data.totalCustomers || 0} />
    </div>
  );
}