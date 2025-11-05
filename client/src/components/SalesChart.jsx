import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js";
import { useState } from "react";
import { useEffect } from "react";
import { getSalesChart } from "../api";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

export default function SalesChart() {
  const [sales, setSales ] = useState([]);
  const token = localStorage.getItem('foodeli-app-token');

  useEffect(()=>{
     const fetchSalesData= async() =>{
      try{
        const { data } = await getSalesChart(token);
        console.log("Fetched sales data:", data);
        setSales(data.data);

      }catch(e){
        console.log("Error fetching sales data:", e.message);
      }


    }
    fetchSalesData();
  },[token])
  const chartData = {
    labels: sales.map(item => item.day),
    datasets: [
      {
        label: "Sales",
        data: sales.map(item => item.total),
        borderColor: "#d35252",
        fill: false
      }
    ]
  };

  return (
    <div style={{ flex: 1, padding: "20px", backgroundColor: "#fff", border: "1px solid #ddd", borderRadius: "10px",boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <h4>Sales Over Time</h4>
      <Line data={chartData} />
    </div>
  );
}
