// import { CircularProgress, Rating } from '@mui/material';
// import React, { useEffect, useState  } from 'react'
// import styled from "styled-components";
// import Button from "../../components/Button";
// import { FavoriteOutlined, FavoriteRounded } from '@mui/icons-material';
// import { useNavigate, useParams } from "react-router-dom";
// import { addToCart, addToFavourite, deleteFromFavourite, getFavourite, getProductDetails } from '../../api';
// import { openSnackbar } from '../../redux/reducers/SnackBarSlice';
// import { useDispatch } from "react-redux";

// const Container = styled.div`
//  padding: 20px 30px;
//   padding-bottom: 200px;
//   height: 100%;
//   overflow-y: scroll;
//   display: flex;
//   align-items: center;
//   flex-direction: column;
//   gap: 30px;
//   @media (max-width: 768px) {
//     padding: 20px 16px;
//   }
//   background: ${({ theme }) => theme.bg};`;


// const Wrapper = styled.div`
//  width: 100%;
//   flex: 1;
//   max-width: 1400px;
//   display: flex;
//   gap: 40px;
//   justify-content: center;
//   @media only screen and (max-width: 700px) {
//     flex-direction: column;
//     gap: 32px;
//   }`;

// const ImageWrapper = styled.div`
//  flex: 0.7;
//   display: flex;
//   justify-content: center;`;

// const Image = styled.img`
//  max-width: 500px;
//   width: 100%;
//   max-height: 500px;
//   border-radius: 12px;
//   object-fit: cover;
//   @media (max-width: 768px) {
//     max-width: 400px;
//     height: 400px;
//   }`;

// const Details = styled.div`
// flex: 1;
//   display: flex;
//   gap: 18px;
//   flex-direction: column;
//   padding: 4px 10px;
//   `;

// const Title  = styled.div`
// font-size: 28px;
//   font-weight: 600;
//   color: ${({ theme }) => theme.text_primary};
//   `;
// const Desc = styled.div`
// font-size: 16px;
//   font-weight: 400;
//   color: ${({ theme }) => theme.text_primary};
//   `;
// const Price = styled.div`
//  display: flex;
//   align-items: center;
//   gap: 8px;
//   font-size: 22px;
//   font-weight: 500;
//   color: ${({ theme }) => theme.text_primary};
//   `;
// const Span = styled.div`
//  font-size: 16px;
//   font-weight: 500;
//   color: ${({ theme }) => theme.text_secondary + 60};
//   text-decoration: line-through;
//   text-decoration-color: ${({ theme }) => theme.text_secondary + 50};
//   `;
// const Percent = styled.div`
// font-size: 16px;
//   font-weight: 500;
//   color: green;
//   `;

// const Ingridents = styled.div`font-weight: 500;
//   diaplay: flex;
//   flex-direction: column;
//   gap: 24px;
//   `;

// const Items = styled.div`
// display: flex;
//   flex-wrap: wrap;
//   gap: 12px;
//   `;
// const Item = styled.div` background: ${({ theme }) => theme.primary + 20};
//   color: ${({ theme }) => theme.primary};
//   font-size: 14px;
//   padding: 4px 12px;
//   display: flex;
//   border-radius: 12px;
//   align-items: center;
//   justify-content: center;
//   `;

// const ButtonWrapper = styled.div`
// display: flex;
//   gap: 16px;
//   padding: 32px 0px;
//   @media only screen and (max-width: 700px) {
//     gap: 12px;
//     padding: 12px 0px;
//   }`
//   ;

// const AdminFoodDetails = () => {
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [favorite, setFavorite] = useState(false);
//   const [favoriteLoading, setFavoriteLoading] = useState(false);
//   const [cartLoading, setCartLoading] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [product, setProduct] = useState();
//   const BASE_URL = "http://localhost:5000";

//   const getproduct = async ()=>{
//     setLoading(true);
//     await getProductDetails(id).then((res)=>{
//       console.log("Recieved product details:",res);
//       setProduct(res.data);
//       setLoading(false);
//     });
//   };

// //   const removeFavourite = async ()=>{
// //     setFavoriteLoading(true);
// //     const token = localStorage.getItem("foodeli-app-token");
// //     await deleteFromFavourite(token,{productId:id})
// //     .then((res)=>{
// //       setFavorite(false);
// //       setFavoriteLoading(false);
// //     })
// //     .catch((err)=>{
// //       setFavoriteLoading(false);
// //       dispatch(
// //         openSnackbar({
// //           message:err.message,
// //           severity: "error",
// //         })
// //       );
// //     });
// //   };

// //   const addFavourite = async ()=>{
// //     setFavoriteLoading(true);
// //     const token = localStorage.getItem("foodeli-app-token");
// //     await addToFavourite(token,{productId:id})
// //     .then((res)=>{
// //       setFavorite(true);
// //       setFavoriteLoading(false);
// //     })
// //     .catch((err)=>{
// //       setFavoriteLoading(false);
// //       dispatch(
// //         openSnackbar({
// //           message:err.message,
// //           severity: "error", 
// //         })
// //       );
// //     });
// //   };

// //   const checkFavourite = async ()=>{
// //     setFavoriteLoading(true);
// //     const token = localStorage.getItem("foodeli-app-token");
// //     await getFavourite(token,{productId:id})
// //     .then((res)=>{
// //       const isFavorite = res.data?.some((favorite)=>favorite._id === id);

// //       setFavorite(isFavorite);
// //       setFavoriteLoading(false);
// //     })
// //     .catch((err)=>{
// //       setFavoriteLoading(false);
// //       dispatch(
// //         openSnackbar({
// //           message:err.message,
// //           severity: "error",
// //         })
// //       );
// //     });
// //   };

//   useEffect(()=>{
//     getproduct();
//     //checkFavourite();
//   },[]);

//   const addCart = async () =>{
//     setCartLoading(true);
//     const token = localStorage.getItem("foodeli-app-token");
//     await addToCart(token ,{productId:id,quantity:1})
//     .then((res)=>{
//       setCartLoading(false);
//       navigate("/cart");
//     })
//     .catch((err)=>{
//       setCartLoading(false);
//       dispatch(
//         openSnackbar({
//           message:err.message,
//           severity: "error",
//         })
//       );
//     });
//   };

//   return (
//     <Container>
//       {loading? (
//         <CircularProgress/>
//       ):(
//         <Wrapper>
//         <ImageWrapper>
//           <Image src ={`${BASE_URL}${product?.img}`}/>
//         </ImageWrapper>
//         <Details>
//           <div>
//             <Title>{product?.name}</Title>
            
//           </div>
//           <Rating value = {3.5} />
//           <Price>
//            Rs. {product?.price?.org} <Span>Rs.{product?.price?.mrp}</Span>
//             {" "}
//             <Percent>( {product?.price?.off}% off)</Percent>
//           </Price>
//           <Desc>{product?.desc}</Desc>
//           <Ingridents>
//             Ingriedients
//             <Items>
//               {product?.ingredients?.length>0 &&
//               product?.ingredients.map((ingredient)=>(
//                  <Item key ={ingredient}>{ingredient} </Item>
                
//               ))}
              
//             </Items>
//           </Ingridents>

//           <ButtonWrapper>
//             <Button 
//             text = "Update Food Details" 
//             full 
//             outlined
//             isLoading={cartLoading}
//             onClick={() =>addCart()}
//             / >
//             <Button text = "Delete Food" full / >
//             {/* <Button 
//             leftIcon = {
//               favorite? (
//                 <FavoriteRounded sx ={{ fontSize:"22px", color:"red"}}/>
//               ):(
//                 <FavoriteOutlined sx = {{fontSize:"22px"}} />
//               )
             
//             }
//             full 
//             outlined
//             isLoading={favoriteLoading}
//             onClick={()=>(favorite?removeFavourite():addFavourite())} /> */}
//           </ButtonWrapper>
//         </Details>
//       </Wrapper>
//       )}
      
//     </Container>
//   );
// };

// export default AdminFoodDetails;
import { CircularProgress, Rating } from '@mui/material';
import React, { useEffect, useState } from 'react';
import styled from "styled-components";
import Button from "../../components/Button";
import { useNavigate, useParams } from "react-router-dom";
import { addToCart, getProductDetails, restoreFoodStatus, updateFoodStatus } from '../../api';
import { openSnackbar } from '../../redux/reducers/SnackBarSlice';
import { useDispatch } from "react-redux";
import Topbar from "../../components/Topbar";
import Sidebar from "../../components/Sidebar";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const Content = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const Main = styled.div`
  flex: 1;
  padding: 20px 30px;
  overflow-y: auto;
  background: ${({ theme }) => theme.bg};
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 30px;
`;

const Wrapper = styled.div`
  width: 100%;
  max-width: 1400px;
  display: flex;
  gap: 40px;
  justify-content: center;
  @media only screen and (max-width: 700px) {
    flex-direction: column;
    gap: 32px;
  }
`;

const ImageWrapper = styled.div`
  flex: 0.7;
  display: flex;
  justify-content: center;
`;

const Image = styled.img`
  max-width: 500px;
  width: 100%;
  max-height: 500px;
  border-radius: 12px;
  object-fit: cover;
`;

const Details = styled.div`
  flex: 1;
  display: flex;
  gap: 18px;
  flex-direction: column;
  padding: 4px 10px;
`;

const Title = styled.div`
  font-size: 28px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
`;

const Desc = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_primary};
`;

const Price = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 22px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_primary};
`;

const Span = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_secondary + 60};
  text-decoration: line-through;
`;

const Percent = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: green;
`;

const Ingridents = styled.div`
  font-weight: 500;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Items = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const Item = styled.div`
  background: ${({ theme }) => theme.primary + 20};
  color: ${({ theme }) => theme.primary};
  font-size: 14px;
  padding: 4px 12px;
  border-radius: 12px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 16px;
  padding: 32px 0px;
  @media only screen and (max-width: 700px) {
    gap: 12px;
    padding: 12px 0px;
  }
`;

const AdminFoodDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cartLoading, setCartLoading] = useState(false);
  const [ deleteLoading, setDeleteLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState();
  const BASE_URL = "http://localhost:5000";
  const token = localStorage.getItem("foodeli-app-token");

  const getproduct = async () => {
    setLoading(true);
    await getProductDetails(id).then((res) => {
      setProduct(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    getproduct();
  }, []);

  const addCart = async () => {
    setCartLoading(true);
   
    await addToCart(token, { productId: id, quantity: 1 })
      .then(() => {
        setCartLoading(false);
        navigate("/cart");
      })
      .catch((err) => {
        setCartLoading(false);
        dispatch(
          openSnackbar({
            message: err.message,
            severity: "error",
          })
        );
      });
  };

  const handleFoodDelete = async()=>{

       if(!window.confirm("Are you sure you want to delete this food item?")) return;

       setDeleteLoading(true);
       await updateFoodStatus(token,id) 
        .then((res)=>{
            setDeleteLoading(false);
            dispatch(
                openSnackbar({
                    message:res.data.message || "Food deleted Successfully",
                    severity:"success",
                })
            );
            navigate("/allFoods");
        })
        .catch((err)=>{
            setDeleteLoading(false);
            dispatch(
                openSnackbar({
                    message:err.message,
                    severity:"error",
                })
            )
        })
  }


  const handleFoodRestore = async ()=>{
    if(!window.confirm("Are you sure you want to restore this food item?")) return;

    setDeleteLoading(true);
    await restoreFoodStatus(token,id)
     .then((res)=>{
        setDeleteLoading(false);
        dispatch(
            openSnackbar({
                message:res.data.message || "Food Restored Successfully",
                severity:'Success',
            })
        );
        getproduct();
     })
     .catch((err)=>{
        setDeleteLoading(false);
        dispatch(
            openSnackbar({
                message:err.message,
                severity:"error",
            })
        )
     })
  }

  return (
    <Container>
      <Topbar />
      <Content>
        <Sidebar />
        <Main>
          {loading ? (
            <CircularProgress />
          ) : (
            <Wrapper>
              <ImageWrapper>
                <Image src={`${BASE_URL}${product?.img}`} />
              </ImageWrapper>
              <Details>
                <Title>{product?.name}</Title>
                <Rating value={3.5} />
                <Price>
                  Rs. {product?.price?.org} <Span>Rs.{product?.price?.mrp}</Span>
                  <Percent>({product?.price?.off}% off)</Percent>
                </Price>
                <Desc>{product?.desc}</Desc>
                <Ingridents>
                  Ingredients
                  <Items>
                    {product?.ingredients?.length > 0 &&
                      product?.ingredients.map((ingredient) => (
                        <Item key={ingredient}>{ingredient}</Item>
                      ))}
                  </Items>
                </Ingridents>
                <ButtonWrapper>
                  <Button
                    text="Update Food Details"
                    full
                    outlined
                    isLoading={cartLoading}
                    onClick={() => navigate(`/adminUpdateFood/${id}`)}
                  />

                  {product?.status === "Active"?(
                     <Button 
                  text="Delete Food" 
                  full
                  isLoading={deleteLoading}
                  onClick={handleFoodDelete} />
                  ):(
                     <Button 
                  text="Restore Food" 
                  full
                  isLoading={deleteLoading}
                  onClick={handleFoodRestore} />
                  )}
                 
                </ButtonWrapper>
              </Details>
            </Wrapper>
          )}
        </Main>
      </Content>
    </Container>
  );
};

export default AdminFoodDetails;
