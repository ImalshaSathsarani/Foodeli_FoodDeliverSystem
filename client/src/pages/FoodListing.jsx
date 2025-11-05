import React, { useEffect, useState } from 'react'
import ProductsCard from '../components/cards/ProductsCard'
import styled from "styled-components";
import {  filter} from '../utils/data';
import { CircularProgress, Slider } from '@mui/material';
import { getAllProducts, getCategories, getPriceRange } from '../api';
import Footer from '../components/Footer';


const Container = styled.div`
  padding: 20px 30px;
  display: flex;
  align-items: flex-start;   // 👈 align to the top
  flex-direction: row;
  gap: 30px;
  min-height: 100vh;    
  @media (max-width: 700px) {
    flex-direction: column;
    padding: 20px 12px;
  }
  background: ${({ theme }) => theme.bg};
  `;
const Filters = styled.div`
padding: 20px 16px;
  flex: 1;
  width: 100%;
  max-width: 300px;
  @media (max-width: 700px) {
    max-width: 440px;
  }`;

const Menu = styled.div`
 display: flex;
  flex-direction: column;
  gap: 4px;`;

const Products = styled.div`
 flex: 1;
  padding: 20px 0px;`;

const CardWrapper = styled.div`
display: flex;
  flex-wrap: wrap;
  gap: 32px;
  justify-content: center;
  @media (max-width: 760px) {
    gap: 16px;
  }`;

  const FilterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 12px;`;

  const Title = styled.div`
  font-size: 20px;
  font-weight: 500;`;

  const Item = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;`;

  const Selectableitem = styled.div`
  cursor: pointer;
  display: flex;
  border: 1px solid ${({ theme }) => theme.text_secondary + 50};
  color: ${({ theme }) => theme.text_secondary + 90};
  border-radius: 8px;
  padding: 2px 8px;
  font-size: 16px;
  width: fit-content;
  ${({ selected, theme }) =>
    selected &&
    `
  border: 1px solid ${theme.text_primary};
  color: ${theme.text_primary};
  background: ${theme.text_primary + 30};
  font-weight: 500;
  `}`;

const FoodListing = () => {
  const [loading,setLoading] = useState(false);
  const [products , setProducts] = useState([]);
  const [priceRange,setPriceRange] = useState([0,1000]);//Default proce range
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [priceRangeLimits, setPriceRangeLimits] = useState([0, 1000]);

  const getFilteredProductsData = async() =>{
    setLoading(true);

    await getAllProducts(
      selectedCategories.length > 0 ?`minPrice =${priceRange[0]}&maxPrice=${priceRange[1]}&categories=${selectedCategories.join(",")}`:`minPrice=${priceRange[0]}&maxPrice=${priceRange[1]}`
    ).then((res)=>{
      const activeFoods = res.data.filter(food=> food.status === "Active");
      setProducts(activeFoods);
      setLoading(false);
    });
  };

  useEffect(()=>{
    getFilteredProductsData();
  },[priceRange, selectedCategories]);

  useEffect(()=>{
    const fetchFilters = async ()=>{
      try{
        const categoryRes = await getCategories();
        setCategories(categoryRes.data);

        const priceRes = await getPriceRange();
        const {min,max} = priceRes.data;
        setPriceRangeLimits([min,max]);
        setPriceRange([min,max]);
      }catch(e){
        console.log("Failed to fetch filters:",e);
      }
    };
    fetchFilters();
  },[]);

  return (
    <>
    <Container>
      <Filters>
        <Menu>
      
<FilterSection>
  <Title>Filter by Price</Title>
  {/* {filters.value === "price" ? (
    <Slider  
    aria-label="Price"
    defaultValue={priceRange}
    min={0}
    max={10000}
    valueLabelDisplay="auto"
    marks={[
      { value: 0, label: "Rs.0" },
      { value: 10000, label: "Rs.10000" },
    ]}
    onChange={(e,newValue)=> setPriceRange(newValue)}
    />
  ):filters.value === "category" ?(
    <Item>
      {filters.items.map((item)=>(
        <Selectableitem 
        key ={item}
        selected ={selectedCategories.includes(item)}
        onClick={()=>
          setSelectedCategories((prevCategories)=>
          prevCategories.includes(item)? prevCategories.filter(
            (category)=>category !==item
          )
        :[...prevCategories,item]
      )
        }
        >{item}</Selectableitem>
      ))}
    </Item>
  ):null} */}

  <Slider
   aria-label='Price'
   min={priceRangeLimits[0]}
   max={priceRangeLimits[1]}
   value={priceRange}
   valueLabelDisplay='auto'
   onChange={(e,newValue)=> setPriceRange(newValue)}
   marks={[
    { value: priceRangeLimits[0], label: `Rs.${priceRangeLimits[0]}` },
    { value: priceRangeLimits[1], label: `Rs.${priceRangeLimits[1]}` },
   ]}
  >

  </Slider>
</FilterSection>
<FilterSection>
  <Title>Filte by Categories</Title>
  <Item>
    {categories.map((item)=>(
      <Selectableitem
      key ={item}
      selected={selectedCategories.includes(item)}
      onClick={()=>
        setSelectedCategories((prev)=>
         prev.includes(item)
         ? prev.filter((cat)=> cat!==item)
        : [...prev, item]
        )
        }
        >{item}

      </Selectableitem>

    ))}
  </Item>
</FilterSection>
      
        </Menu>
      </Filters>
      <Products>
        <CardWrapper>
          {loading ? (
            <CircularProgress/>
          ):(
            <>
            {products.map((product)=>(
             <ProductsCard key = {product._id} product = {product}/>
            ))}
           
            </>
          )}
          
          </CardWrapper>
      </Products>
    </Container>
    <Footer/>
    </>
  )
}

export default FoodListing
