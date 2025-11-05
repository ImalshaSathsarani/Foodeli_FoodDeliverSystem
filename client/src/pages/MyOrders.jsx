
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { getOrdersById } from "../api";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const OrdersContainer = styled.div`
  max-width: 1000px;
  margin: 40px auto;
  padding: 20px;
  font-family: 'Segoe UI', sans-serif;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 30px;
  color: #333;
`;

const OrderCard = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 25px;
  box-shadow: 0 4px 12px hsla(0, 3.80%, 20.40%, 0.78);
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.01);
    box-shadow: 0 6px 18px rgba(225, 22, 22, 0.78);
  }
`;

const OrderInfo = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  
`;

const Status = styled.div`
  margin-top: 10px;
  font-size: 0.85rem;
  span {
    font-weight: 600;
    color: #555;
  }
    margin-left:20px;
`;

const ProductList = styled.ul`
  margin-top: 15px;
  padding-left: 20px;
`;

const ProductItem = styled.li`
  margin-bottom: 8px;
`;
 
const ProductRow = styled.div`
 display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding: 10px;
  background: #fafafa;
  border-radius: 8px;
`;

const ProductText = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: #333;
`;

const ProductImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 10px;
  margin-left: 15px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
`;

const MyOrders = () => {

    const [orders,setOrders] = useState([]);
const [loading,setLoading] = useState(false);
const BASE_URL = "https://foodeli-fooddeliversystem.onrender.com";
const navigate = useNavigate();


const getMyOrders = async ()=>{
    setLoading(true);
    const token = localStorage.getItem("foodeli-app-token");

    await getOrdersById(token).then((res)=>{
        setOrders(res.data.orders);
        setLoading(false);
  })
    
}

useEffect(()=>{
    getMyOrders();
},[])


  return (
    <>
    <OrdersContainer>
      <Title>My Orders</Title>
      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
         orders.map((order)=>(
          <OrderCard 
           key = {order._id}
           onClick={()=> navigate(`order/${order._id}`)}>
            <OrderInfo>
              <div><strong>Order ID:</strong> {order._id}</div>
              <div><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</div>
              
            </OrderInfo>
            <Status>
              <div><span>Payment:</span>{order.paymentStatus}</div>
              <div><span>Food:</span>{order.foodStatus}</div>
              <div><span>Total:</span> Rs.{order.total_amount}</div>
              <div><span>Address:</span>{order.address}</div>
              <div><span>Delivery:</span> 30 mins</div>
            </Status>
            <ProductList>
              {order.products.map((item , index)=>(
                 <ProductRow key = {index}>
                    <ProductText>
                   🍽️ {item.product?.name} × {item.quantity}
                   </ProductText>
                     <ProductImage src= {`${BASE_URL}${item?.product?.img}`} alt={item.product?.name} />
                 </ProductRow>
              ))}
               
             
            </ProductList>
          </OrderCard>
         ))
    
      )}
    </OrdersContainer>
    <Footer/>
    </>
  );
};

export default MyOrders;

