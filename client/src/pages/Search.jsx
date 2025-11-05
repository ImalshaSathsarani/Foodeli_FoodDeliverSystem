// import { SearchRounded } from '@mui/icons-material'
// import React, { useState } from 'react'
// import { searchFood } from '../api';
// import ProductsCard from '../components/cards/ProductsCard';

// const Search = () => {
//   const [query, setQuery] = useState("");
//   const [results,setResults] = useState([]);
//   const token = localStorage.getItem("foodeli-app-token");

//   const handleSearch = async (e) =>{
//       const value = e.target.value;
//       setQuery(value);

//       if(value.trim().length >1){
//         try{
//             const res = await searchFood(value, token);
//             setResults(res.data.data);
//         } catch(e){
//             console.error("Search failed:",e);
//         }
        
//       }else{
//         setResults([]);
//       }
//   }

//   return (
//     <div 
//       style={{
//         display: "flex",
//         justifyContent: "center",
//         marginTop: "100px",
//       }}
//     >
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           backgroundColor: "#f1f3f4",
//           borderRadius: "40px",
//           padding: " 20px",
//           width: "700px",
//           boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
//         }}
//       >
//         <SearchRounded sx={{ color: "red", fontSize: "28px", marginRight: "10px" }} />
//         <input
//           type="text"
//           placeholder="Search for delicious food..."
//           value={query}
//           onChange={handleSearch}
//           style={{
//             flex: 1,
//             border: "none",
//             outline: "none",
//             background: "transparent",
//             fontSize: "16px",
//             color: "#333",
//           }}
//         />
//       </div>
//       <div style={{display:'flex',flexWrap:'wrap',gap:'20px',marginTop:'40px',justifyContent:'center'}}>
        
        
// {results.length > 0 ? (
//     results.map((product)=><ProductsCard key={product._id} product={product} />)
// ):(
//     query && <p>No matching foods found</p>
// )}

//       </div>
//     </div>
//   )
// }

// export default Search

import { SearchRounded } from '@mui/icons-material';
import React, { useState, useEffect } from 'react';
import ProductsCard from '../components/cards/ProductsCard';
import styled from 'styled-components';
import { searchFood as searchFoodAPI } from '../api';

const SearchWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 100px;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  background-color: #f1f3f4;
  border-radius: 40px;
  padding: 15px 25px;
  width: 700px;
  max-width: 90%;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 16px;
  color: #333;
`;

const ResultsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 30px;
  justify-content: center;
  width: 90%;
`;

const Message = styled.p`
  margin-top: 20px;
  font-size: 18px;
  color: #555;
`;

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim().length > 1) {
      setLoading(true);
      try {
        const token = localStorage.getItem("foodeli-app-token");
        const res = await searchFoodAPI(value, token);
        setResults(res.data.filter(f => f._id)); // structured response
      } catch (err) {
        console.error("Search failed", err);
        setResults([]);
      }
      setLoading(false);
    } else {
      setResults([]);
    }
  };

  return (
    <SearchWrapper>
      <SearchBox>
        <SearchRounded sx={{ color: "red", fontSize: "28px", marginRight: "10px" }} />
        <SearchInput
          type="text"
          placeholder="Search for delicious food..."
          value={query}
          onChange={handleSearch}
        />
      </SearchBox>

      {loading && <Message>Searching...</Message>}

      <ResultsContainer>
        {results.length > 0
          ? results.map((product) => product && product._id? <ProductsCard key={product._id} product={product} />:null)
          : query.length > 1 && !loading && <Message>No matching foods found</Message>}
      </ResultsContainer>
    </SearchWrapper>
  );
};

export default Search;

