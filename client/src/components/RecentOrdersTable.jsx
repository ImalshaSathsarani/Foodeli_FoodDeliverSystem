import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { getRecentOrders } from "../api";

export default function RecentOrdersTable() {
  const [orders,setOrders] = useState([]);
  const token = localStorage.getItem("foodeli-app-token");


  useEffect(()=>{
    const fetchOrders = async () =>{
      const { data } = await getRecentOrders(token);
      console.log("Fetched recent orders:",data);
      setOrders(data);
    }

    fetchOrders();
  },[token]);
 
  return (
    <div style={{ marginTop: "20px", backgroundColor: "#fff", padding: "20px", border: "1px solid #ddd", borderRadius: "10px",boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <h4>Recent Orders</h4>
      <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Food</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td>{order._id}</td>
              {order.products.map((p,i)=>(
                <span key={i}>
                  {p.product?.name}
                  {i< order.products.length - 1 ? "," :""}
                </span>
              ))}
             
              <td>{order.user?.name}</td>
              <td>{order.total_amount}</td>
              <td>{order.paymentStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
