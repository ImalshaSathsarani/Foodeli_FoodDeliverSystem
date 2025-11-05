import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useState } from "react";
import { useEffect } from "react";
import { getCustomerChart } from "../api";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CustomerChart() {

  const [customer, setCustomer] = useState({ new:0,returning:0});
  const token = localStorage.getItem('foodeli-app-token');

  useEffect(()=>{
    const fetchCustomers = async () =>{
      try{
        const { data } = await getCustomerChart(token);
        console.log("Fetched customer data:",data);
        setCustomer(data);
        
      }catch(e){
        console.log("Error fetching customers",e);
      }

    };
    fetchCustomers();
  }, [token])
  const data = {
    labels: ["New Customers", "Returning"],
    datasets: [
      {
        label: "Customers",
        data: [customer.new,customer.returning],
        backgroundColor: ["#ff6384", "#36a2eb"]
      }
    ]
  };

  return (
    <div style={{ flex: 1, padding: "20px", backgroundColor: "#fff", border: "1px solid #ddd", borderRadius: "10px",boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <h4>Customer Distribution</h4>
      <Pie data={data} />
    </div>
  );
}