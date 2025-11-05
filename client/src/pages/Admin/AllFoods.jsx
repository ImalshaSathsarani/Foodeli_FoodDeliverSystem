import React, { useEffect, useState } from 'react'
import Topbar from '../../components/Topbar'
import Sidebar from '../../components/Sidebar'
import { getAllProducts } from '../../api';

import AdminProductsCard from '../../components/cards/AdminProductsCard';

function AllFoods() {
    const [foods, setFoods] = useState([]);
    const [activeTab,setActiveTab] = useState("active");

    useEffect(()=>{
        const getAllFoods = async () =>{
            try{
 const data = await getAllProducts();
            console.log("All food items:",data.data);
            setFoods(data.data);
            }catch(e){
                console.log("Error getting all foods:", e.message);
            }
           
        }
        getAllFoods();
    },[]);

    const activeFoods = foods.filter((food)=>food.status === "Active");
    const incativeFoods =foods.filter((food)=> food.status === "Inactive");
  return (
    <div style= {{ display:'flex', height:'100vh', flexDirection:'column'}}>
        <Topbar/>

        <div style={{ flex:1,display:'flex'}}>
            <Sidebar/>
            <div style={{ flex:1,display:'flex', flexDirection:'column',alignItems:'center',padding:'20px'}}>
                <h1 style={{ textAlign:'center', marginBottom:'20px'}}>All Food Items</h1>
           <div style={{ display:'flex',gap:'20px',marginBottom:'20px'}}>
            <button 
            onClick={()=>setActiveTab("active")}
            style={{
              padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                background: activeTab === "active" ? '#d35252' : '#ccc',
                color: 'white',
                fontWeight: '600',  
            }}>
            Selling Foods

            </button>
            <button 
            onClick={()=>setActiveTab("inactive")}
            style={{
                 padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                background: activeTab === "inactive" ? '#d35252' : '#ccc',
                color: 'white',
                fontWeight: '600',
            }}>
                Deleted Foods

            </button>

           </div>
                
           <div style= {{ display:'flex', flexWrap:'wrap',gap:'20px',justifyContent:'center',width:'100%'}}>
            {activeTab === "active"?(
                activeFoods.length > 0 ? (
                    activeFoods.map((food)=>(
                        <AdminProductsCard key={food._id} product={food}/>
                    ))
                ):(
                    <p>No Selling Foods Found.</p>
                )
            ):incativeFoods.length > 0 ? (
                incativeFoods.map((food)=>(
                    <AdminProductsCard kry={food._id} product={food}/>
                ))
            ):(
                <p>No Deleted Foods.</p>
            )}

           </div>

            </div>
            

        </div>
      
    </div>
  )
}

export default AllFoods
