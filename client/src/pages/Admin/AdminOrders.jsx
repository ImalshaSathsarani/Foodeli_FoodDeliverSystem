import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import { getOrders, updateOrderFoodStatus } from '../../api';
import { CircularProgress } from '@mui/material';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';



const Container = styled.div`
  max-width: 1200px;
  margin: 40px auto;
  padding: 20px;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 30px;
`;

const OrderCard = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const UserInfo = styled.div`
  margin-bottom: 10px;
  color: #555;
`;

const ProductList = styled.ul`
  padding-left: 20px;
  margin: 10px 0;
`;

const ProductItem = styled.li`
  margin-bottom: 6px;
`;

const StatusButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const StatusButton = styled.button`
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background-color: ${({ active }) =>
    active ? "#28a745" : "#ddd"};
  color: ${({ active }) => (active ? "#fff" : "#333")};
  font-weight: 500;
  transition: 0.2s ease;

  &:hover {
    background-color: ${({ active }) =>
      active ? "#218838" : "#bbb"};
  }
`;

const AdminOrders = () => {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] =useState(false);
    const token = localStorage.getItem("foodeli-app-token");
      
    
    const fetchOrders = async ()=>{
        setLoading(true);

        try{
            const res = await getOrders(token);
            setOrders(res.data.orders);
            setLoading(false);

        }catch(e){
            console.log("Failed to load orders:",e);
        }

    };


    const handleStatusChange = async (orderId , newStatus) =>{
        try{
            await updateOrderFoodStatus(orderId,newStatus,token);
            fetchOrders();

        }catch(e){
            console.log("Failed to update order status:",e);
        }
    };


    useEffect(()=>{
        fetchOrders();

    },[]);

   const statuses = ["Preparing", "On the way", "Delivered"]; 
    return (
      <div style={{display: "flex", height: "100vh",flexDirection:"column"}}>
        <Topbar/>
       <div style = {{ flex: 1, display: "flex"}}>
            <Sidebar/>
            <div style = {{flex:1, padding:'20px'}}>
               <h1 style = {{textAlign:'center', marginBottom:'20px'}}>All Orders</h1>
    
    <Container>
        {/* <Title>All Orders (Admin View)</Title> */}

       {orders.map((order)=>(
          <OrderCard key = {order._id}>
          <UserInfo><strong>User: </strong> {order.user?.name} ({order.user?.email})</UserInfo>
          <UserInfo><strong>Order Id:</strong> {order._id}</UserInfo>
          <UserInfo><strong>Address:</strong> {order.address}</UserInfo>
          <UserInfo><strong>Total Amount:</strong> Rs. {order.total_amount}</UserInfo>
          <UserInfo>
  <strong>Ordered Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
</UserInfo>
<UserInfo>
  <strong>Ordered Time:</strong> {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
</UserInfo>


          <ProductList>
            {order.products.map((item,index)=>(
                  <ProductItem key = {index}>
                    🍽️ {item.product?.name}× {item.quantity}
                  </ProductItem>
            ))}
         
          </ProductList>

          <div>
              <strong>Food Status:</strong>
              <StatusButtons>
                {statuses.map((status) =>(
                    <StatusButton
                    key = {status}
                    active={order.foodStatus === status}
                    onClick = {()=>
                        order.foodStatus !==status && handleStatusChange(order._id,status)
                    }>{status}</StatusButton>
                  
                ))}
                  
              </StatusButtons>
          </div>
      </OrderCard>
  
       ))} 
       
    </Container>
    </div>
    </div>
    </div>
  )
}


export default AdminOrders
