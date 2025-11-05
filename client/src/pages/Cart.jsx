import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { openSnackbar } from '../redux/reducers/SnackBarSlice';
import { addToCart, deleteFromCart, placeOrder ,getCart, createPaymentIntent} from '../api';
import { CircularProgress } from '@mui/material';
import { DeleteOutline } from '@mui/icons-material';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Footer from '../components/Footer';

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
  `;

const Section = styled.div`
 width: 100%;
  max-width: 1400px;
  padding: 32px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 22px;
  gap: 28px;`;

const Title = styled.div`
 font-size: 28px;
  font-weight: 500;
  display: flex;
  justify-content: ${({ center }) => (center ? "center" : "space-between")};
  align-items: center;`;

const Wrapper = styled.div`
display: flex;
  gap: 32px;
  width: 100%;
  padding: 12px;
  @media (max-width: 750px) {
    flex-direction: column;
  }`;

const Left = styled.div`
flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  @media (max-width: 750px) {
    flex: 1.2;
  }`
  ;

const Table = styled.div`
font-size: 16px;
  display: flex;
  align-items: center;
  gap: 30px;
  ${({ head }) => head && `margin-bottom: 22px`}`;

const TableItem = styled.div`
 ${({ flex }) => flex && `flex: 1; `}
  ${({ bold }) =>
    bold &&
    `font-weight: 600; 
  font-size: 18px;`}`;


const Counter = styled.div`
 display: flex;
  gap: 12px;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.text_secondary + 40};
  border-radius: 8px;
  padding: 4px 12px;`;

const Product = styled.div`
 display: flex;
  gap: 16px;`;

const Img = styled.img`
height: 85px;
width: 85px;`;

const Details = styled.div`
max-width: 130px;
  @media (max-width: 700px) {
    max-width: 60px;
  }`;

const Protitle = styled.div`
  color: ${({ theme }) => theme.primary};
  font-size: 16px;
  font-weight: 500;`;

const ProDesc = styled.div`
font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_primary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;`;

// const ProSize = styled.div`
// font-size: 14px;
//   font-weight: 500;`;


const Right = styled.div`
flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  @media (max-width: 750px) {
    flex: 0.8;
  }
  `;

const Subtotal = styled.div`
font-size: 22px;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  `;
const Delivery = styled.div`
font-size: 18px;
  font-weight: 500;
  display: flex;
  gap: 6px;
  flex-direction: column;`
  ;


  


const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();
  const [loading,setLoading] =useState(false);
  const [reload,setReload] = useState(false);
  const [products,setProducts] = useState([]);
  const [buttonLoad, setButtonLoad] = useState(false);
  const [deliveryDetails,setDeliveryDetails] = useState({
    firstName:"",
    lastName:"",
    emailAddress:"",
    phoneNumber:"",
    completeAddress:"",
  });
  const BASE_URL = "http://localhost:5000";


  const getProducts = async ()=>{
    setLoading(true);
    const token = localStorage.getItem("foodeli-app-token");
    await getCart(token).then((res)=>{
      setProducts(res.data.cartItems);
      setLoading(false);
    });
  };

  const calculateSubtotal = () =>{
    return products.reduce(
      (total,item)=> total+item.quantity*item?.product?.price.org,0
    );
  };

  const convertAddressToString = (addressObj) =>{
    //Convert address objext to a string 
    return `${addressObj.firstName} ${addressObj.lastName} ,${addressObj.completeAddress},${addressObj.phoneNumber},${addressObj.emailAddress}`;
  };

  const PlaceOrder = async() =>{
    setButtonLoad(true);
    try{

      console.log("[1] Starting place order process");

      const isDeliveryDetailsFilled = 
      deliveryDetails.firstName &&
      deliveryDetails.lastName &&
      deliveryDetails.emailAddress &&
      deliveryDetails.phoneNumber &&
      deliveryDetails.completeAddress;

      if(!isDeliveryDetailsFilled){
        console.log("[2] Delivery details validation failed");
        dispatch(
          openSnackbar({
            message:"Please fill all delivery details",
            severity:"error",
          })
        );
        return;
      }

      if(!stripe || !elements){
        console.log("[3] Stripe not initialized");
      console.log("Stripe:", stripe);
      console.log("Elements:", elements);
        dispatch(openSnackbar({message :"Stripe in not initialized." , severity:"error"}));
        setButtonLoad(false);
        return;
      }


      console.log("[4] Creating payment intent");
      const token = localStorage.getItem("foodeli-app-token");
      const totalAmount = calculateSubtotal().toFixed(2);
      const response = await createPaymentIntent(token, totalAmount*100);
      console.log("[5] Payment intent response:", response);
      const { clientSecret} = response.data;
      console.log("[6] Client secret received");

     
      console.log("[7] Confirming payment");
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret,{
        payment_method:{
          card:elements.getElement(CardElement),
          billing_details:{
            name: `${deliveryDetails.firstName} ${deliveryDetails.lastName}`,
            email: deliveryDetails.emailAddress,
            phone: deliveryDetails.phoneNumber,
            address:{
              line1: deliveryDetails.completeAddress,
            },
          }
        }
      });

      if(error){
        console.log("[8] Payment error:", error);
        dispatch(
          openSnackbar({
            message: error.message,
            severity: "error",
          })
        );
        setButtonLoad(false);
      
      }else if (paymentIntent.status === "succeeded"){
        console.log("[9] Payment succeeded, placing order");
      const orderDetails = {
        products,
        address: convertAddressToString(deliveryDetails),
        totalAmount,
      };

      await placeOrder(token, orderDetails);
      dispatch(
        openSnackbar({
          message:"Order placed successfully",
          severity:"success",
        })
      );
      setButtonLoad(false);
      setReload(!reload);
    }


    }catch(err){
      dispatch(
        openSnackbar({
          message:"Failed to place order.Please try again",
          severity:"error",
        })
      );
      setButtonLoad(false);
    }
  };

  useEffect(() =>{
    getProducts();
  }, [reload]);

  const addCart =  async (id) => {
    const token = localStorage.getItem("foodeli-app-token");
    await addToCart(token, {productId:id,quantity:1})
    .then((res)=>{
      setReload(!reload);
    })
    .catch((err) =>{
      setReload(!reload);
      dispatch(
        openSnackbar({
          message: err.message,
          severity: "error",
    })
  );
});
 };

 const removeCart = async (id,quantity,type) =>{
  const token = localStorage.getItem("foodeli-app-token");
  let qnt = quantity > 0 ?1 :null;
  if(type === "full") qnt = null;
  await deleteFromCart(token,{
    productId:id,
    quantity: qnt,
  })
  .then((res)=>{
    setReload(!reload);
  })
  .catch((err)=>{
    setReload(!reload);
    dispatch(
      openSnackbar({
        message: err.message,
        severity: "error",
    })
  );
  });
 };

 const handleInputChange = (e)=>{
  const { name, value} = e.target;
  setDeliveryDetails((prevDetails) => ({
    ...prevDetails,
    [name]: value,
  }));
 }

  return (
    <>
    <Container>
      <Section>
        <Title>Your Shopping Cart</Title>
        {loading ? (
          <CircularProgress />
        ):(
          <>
          {products.length === 0?(
            <>Cart Is Empty</>
          ):(
            <Wrapper>
            <Left>
              <Table>
                <TableItem bold flex>Product</TableItem>
                <TableItem bold>Price</TableItem>
                <TableItem bold>Quantity</TableItem>
                <TableItem bold>Subtotal</TableItem>
                <TableItem bold></TableItem>
              </Table>
              {products.map((item)=>(
                <Table>
                <TableItem flex>
                  <Product>
                    <Img src = {`${BASE_URL}${item?.product?.img}`}/>
                    <Details>
                      <Protitle>{item?.product?.name}</Protitle>
                      <ProDesc>{item?.product?.desc}</ProDesc>
                      {/* <ProSize>xl</ProSize> */}
                    </Details>
                  </Product>
                  </TableItem>
                <TableItem >Rs.{item?.product?.price?.org}</TableItem>
                <TableItem >
                  <Counter>
                    <div style={{
                              cursor: "pointer",
                              flex: 1,
                            }}
                            onClick={()=>removeCart(item?.product?._id,item?.quantity-1)

                            } >
                      -
                      </div>
                     {item.quantity} {" "}
                      <div
                     style={{
                      cursor: "pointer",
                      flex: 1,
                    }}
                    onClick={() => addCart(item?.product?._id)}>
                      +
                      </div>
                      </Counter>
                      </TableItem>
                <TableItem >
                  {" "}
                  Rs.
                  {(item.quantity*item?.product?.price?.org).toFixed(2)}
                </TableItem>
                <TableItem >
                  <DeleteOutline  sx={{ color: "red" }}
                          onClick={() =>
                            removeCart(
                              item?.product?._id,
                              item?.quantity - 1,
                              "full"
                            )
                          } />
                </TableItem>
              </Table>
              ))}
              
            </Left>
            <Right>
              <Subtotal>Subtotal : Rs.{calculateSubtotal().toFixed(2)}</Subtotal>
              <Delivery>Delivery Details:
                <div>
                  <div 
                  style ={{
                    display : "flex",
                    gap:"6px",
                  }}>
                    <TextInput
                     small 
                     placeholder = "First Name"
                     value = {deliveryDetails.firstName}
                     
                     
                     handleChange={(e)=>
                      setDeliveryDetails({
                        ...deliveryDetails,
                        firstName:e.target.value,
                      })
                     }
                     //handleChange={handleInputChange}
                     />
                    <TextInput 
                    small 
                    placeholder = "Last Name"
                    value={deliveryDetails.lastName}
                    handleChange={(e)=>
                      setDeliveryDetails({
                        ...deliveryDetails,
                        lastName:e.target.value,
                      })
                     }

                   //handleChange={handleInputChange}
                    />
                  </div>
                  <TextInput
                   small 
                   placeholder = "Email Address"
                   value={deliveryDetails.emailAddress}
                       
                   handleChange={(e) =>
                          setDeliveryDetails({
                            ...deliveryDetails,
                            emailAddress: e.target.value,
                          })
                        }
                   
                  // handleChange={handleInputChange}
                   
                   />
                  <TextInput
                   small 
                   placeholder = "Phone no. +91 XXXXX XXXXX"
                   value={deliveryDetails.phoneNumber}


                        handleChange={(e) =>
                          setDeliveryDetails({
                            ...deliveryDetails,
                            phoneNumber: e.target.value,
                          })
                        }

                        //handleChange={handleInputChange}
                   />
                  <TextInput 
                  small
                  textArea
                  rows="5"
                  placeholder = "Complete Address (Address, State, Country, Pincode)"
                  value={deliveryDetails.completeAddress}

                  handleChange={(e) =>
                    setDeliveryDetails({
                      ...deliveryDetails,
                      completeAddress: e.target.value,
                    })
                  }
                  //handleChange={handleInputChange}

                   />
                </div>
              </Delivery>
              <Delivery>Payment Details:
                <div>
                {/* <TextInput
                 small
                  placeholder = "Card Number"
                  handleChange={handleInputChange}/>
                  <div 
                  style ={{
                    display : "flex",
                    gap:"6px",
                  }}>
                    <TextInput 
                    small 
                    placeholder = "Expiry Date"
                    handleChange={handleInputChange}
                    />
                    <TextInput 
                    small 
                    placeholder = "CVV"
                    handleChange={handleInputChange}/>
                  </div>
                  <TextInput
                   small
                    placeholder = "Card Holder Name"
                    handleChange={handleInputChange}/>
                 
                   */}
                   <CardElement 
                   options= {{
                    style:{
                      base:{
                        color:"#000",
                        fontSize:"16px",
                        fontFamily:"Arial, sans-serif",
                        fontSmoothing:"antialiased",
                        padding:"12px 14px",
                        backgroundColor: "#fff",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        "::placeholder": {
                          color: "#aab7c4"
                        }
                      },
                      invalid:{
                        color:"#fa755a",
                        iconColor:"#fa755a",
                      },
                    },
                    hidePostalCode: true,
                   }} />
                </div>
              </Delivery>
              <Button 
              text = "Place Order"
              small
              onClick={PlaceOrder}
              isLoading={buttonLoad}
              isDisabled={buttonLoad}></Button>
            </Right>
          </Wrapper>
          )}
          </>
        )}
       
      </Section>
    </Container>
    <Footer/>
    </>
  )
}

export default Cart
