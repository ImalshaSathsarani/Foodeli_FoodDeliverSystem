// AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import SummaryCards from "../../components/SummaryCards";
import SalesChart from "../../components/SalesChart";
import CustomerChart from "../../components/CustomerChart";
import RecentOrdersTable from "../../components/RecentOrdersTable";
import { getUserProfile } from "../../api";

export default function AdminDashboard() {
  const token = localStorage.getItem("foodeli-app-token");
  const [ adminData, setAdminData ] = useState(null);

  useEffect(()=>{
    const fetchUserProfile = async()=>{
      try{
         const { data } = await getUserProfile(token);
         console.log("Admin profile data fetched:", data.user);
         setAdminData(data.user);

      }catch(e){
        console.log("Error fetching admin data:",e.message);
      }
     

    };
    fetchUserProfile();
  },[token])
  return (
    <div style={{ display: "flex", height: "100vh",flexDirection:"column" }}>
      <Topbar />
      <div style={{ flex: 1, display: "flex"}}>
        <Sidebar/>
        
        <div style={{ padding: "20px", overflowY: "auto", flex:1 }}>
          {!adminData ? (
            <p>Loading...</p>
          ):(
            <>
            <h2>Welcome, {adminData.name} !</h2>
          <SummaryCards />
          <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
            <SalesChart />
            <CustomerChart />
          </div>
          <RecentOrdersTable />
            </>

          )}
          
        </div>
      </div>
    </div>
  );
} 

// components/Sidebar.jsx

// components/Topbar.jsx


// components/SummaryCards.jsx


// components/SalesChart.jsx

// components/CustomerChart.jsx


// components/RecentOrdersTable.jsx
