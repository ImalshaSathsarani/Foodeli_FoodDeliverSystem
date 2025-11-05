import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getOrderDetails } from '../api';
import styled from 'styled-components';


const Container = styled.div`
  max-width: 900px;
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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Info = styled.div`
  margin-bottom: 20px;
  div {
    margin: 6px 0;
    color: #555;
  }
`;

const ProgressWrapper = styled.div`
  margin: 50px 0;
`;

const ProgressTrack = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;

const Step = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  flex: 1;
  text-align: center;
`;

const Circle = styled.div`
  width: 30px;
  height: 30px;
  background: ${(props) => (props.completed ? "#4CAF50" : props.active ? "#2196F3" : "#ccc")};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 1.2rem;
  z-index: 2;
  transition: background 0.4s ease;
`;

const Line = styled.div`
  position: absolute;
  top: 15px;
  left: 50%;
  width: 100%;
  height: 4px;
  background: ${(props) => (props.completed ? "#4CAF50" : "#ccc")};
  z-index: 1;
  transform: translateX(-50%);
`;

const Label = styled.div`
  margin-top: 8px;
  font-size: 0.8rem;
  color: #555;
`;

const ProductList = styled.ul`
  margin-top: 20px;
`;

const ProductItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  padding: 8px;
  background: #f9f9f9;
  border-radius: 8px;
`;

const ProductImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 15px;
`;

const ProductText = styled.div`
  font-size: 1rem;
  color: #333;
`;
const OrderDetails = () => {
    const { id } = useParams();
    const [order,setOrder] = useState(null);
    const [loading,setLoading] = useState(true);
    const stages = ['Order Placed',"Preparing","On the way","Delivered"];
    const BASE_URL = "https://foodeli-fooddeliversystem.onrender.com";

    useEffect(()=>{
        const fetchOrderDetails = async () =>{
            try{
                const token = localStorage.getItem('foodeli-app-token');
                const res = await getOrderDetails(id, token);
                setOrder(res.data.order);
                setLoading(false);
            }catch(e){
                console.log("Failed to fetch order details:",e);
                setLoading(false);
            }
        };
        fetchOrderDetails();
    } , [id]);

    if(loading) return <Container>Loading Order Details...</Container>;

    if(!order) return <Container>No order found.</Container>;

    const currentStatus = order.foodStatus;
    const currentIndex = stages.indexOf(currentStatus);
  return (
    <Container>
        <Title>Order Details</Title>
        <OrderCard>
            <Info>
                <div><strong>Order Id:</strong>{order._id}</div>
                <div><strong>Ordered By:</strong>{order.user?.name} ({order.user?.email})</div>
                <div><strong>Delivery Address:</strong>{order.address}</div>
                <div><strong>Total Amount:</strong>Rs.{order.total_amount}</div>
                <div><strong>Payment:</strong>{order.paymentStatus}</div>
                <div><strong>Food Status:</strong>{order.foodStatus}</div>
                <div><strong>Date:</strong>{new Date(order.createdAt).toLocaleDateString()}</div>
            </Info>

            <ProgressWrapper>
                <ProgressTrack>
                    {stages.map((stage,index)=>{
                        const isCompleted = index <= currentIndex;
                        const isActive = index === currentIndex;
                        return(
                            <Step key={index}>
                                {index !==0 &&(
                                    <Line copleted={index<=currentIndex} />
                                )}
                                <Circle conpleted = {isCompleted} active={isActive}>
                                {isCompleted ? "✅" : index + 1}
                                </Circle>
                                <Label>{stage}</Label>
                            </Step>
                        )
                    })}
                </ProgressTrack>
            </ProgressWrapper>

            <h3>Ordered Items</h3>
            <ProductList>
                {order.products.map((item,idx)=>(
                    <ProductItem key = {idx}>
                        <ProductImage src = {`${BASE_URL}${item.product?.img}`} alt={item.product?.name} />
                        <ProductText>
                            🍽️ {item.product?.name} × {item.quantity}
                        </ProductText>
                    </ProductItem>
                ))}
            </ProductList>
        </OrderCard>
    </Container>
  )
}

export default OrderDetails
