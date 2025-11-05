import React, { useEffect, useState } from 'react'
import styled from "styled-components";
import {category} from "../utils/data";
//import HeaderImage from "../utils/Images/Header.png";
import ProductCategoryCard from '../components/cards/ProductCategoryCard';
import ProductsCard from '../components/cards/ProductsCard';
import { getAllProducts } from '../api';
import { CircularProgress } from '@mui/material';
import { Swiper,SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {createGlobalStyle} from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';



const GlobalStyles = createGlobalStyle`
  .swiper-button-next,
  .swiper-button-prev {
    color: red;
  }

  .swiper-button-next::after,
  .swiper-button-prev::after {
    font-size: 24px;
  }

   .swiper-pagination-bullet {
    background-color: #ffcccc;
    opacity: 1;
  }

  .swiper-pagination-bullet-active {
    background-color: red;
  }
`;

const Container = styled.div`
padding: 20px 30px;
  padding-bottom: 200px;
  height: 100%;
  overflow-y: scroll;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 30px;
  @media (max-width: 768px) {
    padding: 20px 12px;
  }
  background: ${({ theme }) => theme.bg};
   overflow-x: hidden;`;

const Section = styled.div`
 max-width: 1400px;
  padding: 32px 16px;
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

// const Img = styled.img`
//  width: 100%;
//   max-width: 1200px;`;

  
const Title = styled.div`font-size: 28px;
  font-weight: 500;
  display: flex;
  justify-content: ${({ center }) => (center ? "center" : "space-between")};
  align-items: center;`;

const CardWrapper = styled.div` display: flex;
  flex-wrap: wrap;
  gap: 32px;
  justify-content: center;
  @media (max-width: 760px) {
    gap: 16px;
  }`;

  const FullWidthSection = styled.div`
  width: 100%;
  position: relative;
  overflow: hidden;
  `;

  const SlideContent = styled.div`
  position : absolute;
  top:50%;
  left:50%;
  transform: translate(-50%,-50%);
  text-align: center;
  color: white;
  z-index: 2;
  `;

  const SlideOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1;
  `;

  const SlideWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 600px;

  @media (max-width: 768px) {
    height: 300px;
  }
`;

  const HeroTitle = styled.h1`
  font-size: 55px;
  font-weight: 1000;
  
  margin-bottom: 12px;
  media (max-width: 768px) {
    font-size: 28px;
  }
  `;

  const HeroParagraph = styled.p`
  font-size: 18px;
  max-width: 600px;
  margin: 0 auto 24px;
  
  @media (max-width: 768px) {
    font-size: 14px;
  }`;

  const HeroButton = styled.button`
  background: red;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
   background: darkred;
   } `
    ;
  


const Home = () => {
  const [loading,setLoading] = useState(false);
  const [products,setProducts] = useState([]);
  const navigate = useNavigate();
  const getProducts = async ()=>{
    setLoading(true);
    await getAllProducts().then((res) => {
      const activeFoods = res.data.filter((food)=>food.status === "Active");
      setProducts(activeFoods);
      setLoading(false);
    });
    
  };

  useEffect(()=>{
    getProducts();
  }, []);

  return (
    <>
    <Container>
      <FullWidthSection>
      <GlobalStyles />
       <Swiper
       modules = {[Navigation, Pagination, Autoplay]}
       spaceBetween = {30}
       slidesPerView={1}
       navigation
       pagination={{ clickable: true }}
       autoplay = {{delay: 3500, disableOnInteraction: false}}
       loop={true}
       style={{ width: '100vw',height:'auto'}}>
        {[1,2,3,4].map((i)=>(
          <SwiperSlide key ={i}>
            <SlideWrapper>
            <img 
            src={require(`../utils/Images/SliderImg${i}.jpg`)}
            alt={`slide-${i}`}
            style={{ width: '100%', height: '600px',objectFit:'cover'}} />
            <SlideOverlay/>
            <SlideContent>
              <HeroTitle>Delicious Meals Delivered to Your Door</HeroTitle>
              <HeroParagraph>Discover a variety of your favorite dishes from the best local restaurants. Fresh, fast, and made just for you.</HeroParagraph>
              <HeroButton onClick={()=>navigate(`/dishes`)} >Browse Dishes</HeroButton>
            </SlideContent>
           </SlideWrapper>
          </SwiperSlide>
        ))}

       </Swiper>
       </FullWidthSection>
      <Section>
       <Title>Food Categories</Title>
       <CardWrapper>
        {category.map((category)=>(
          <ProductCategoryCard category = {category}/>
        ))}
       </CardWrapper>
      </Section>
      <Section>
       <Title>Most Popular</Title>
       {loading ? (<CircularProgress/>
       ):(
         <CardWrapper>
        {products.map((product)=>(
          <ProductsCard product = {product} />
        ))}
       </CardWrapper>)
       }
      
      </Section>

      
    </Container>
    <Footer/>
    </>
    
  )
}

export default Home
