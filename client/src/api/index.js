import axios from "axios";

const API = axios.create({
    baseURL: "https://foodeli-fooddeliversystem.onrender.com/api",
});

//auth
export const UserSignUp = async (data)=> await API.post("/user/signup",data);
export const UserSignIn = async (data)=>await API.post("/user/signin",data);

//products
export const getAllProducts = async (filter)=> await API.get(`/food?${filter}`,filter);
export const getProductDetails = async (id)=> await API.get(`/food/${id}`);

export const addFoods = async (foods,token)=>{
   //const token = localStorage.getItem("foodeli-app-token");
    console.log("Sending foods to backend:", foods)
    return await API.post('/food/add',foods,{
        headers:{
            Authorization:`Bearer ${token}`,
        }
    });
}

export const uploadFoodImage = async (file)=>{
    const formData = new FormData();
    formData.append('image',file);

    const token = localStorage.getItem("foodeli-app-token");

    const res = await API.post('/food/upload',formData,{
        headers:{
            'Content-Type':'multipart/form-data',
            Authorization:`Bearer ${token}`,
        },
    });

    return res;
} 

export const getCategories =  async ()=>await API.get('food/categories');
export const getPriceRange = async ()=>await API.get('food/price-range');

//cart
export const getCart = async (token)=> await API.get(`user/cart`,{headers: {Authorization:`Bearer ${token}`},
});
export const addToCart = async (token,data)=> await API.post(`/user/cart`,data,{
    headers:{Authorization:`Bearer ${token}`},
});
export const deleteFromCart = async (token,data) => await API.patch(`/user/cart`,data,{
    headers:{Authorization:`Bearer ${token}`}, 
});

//favourites
export const getFavourite = async (token) => await API.get(`/user/favourite`,{
    headers:{Authorization:`Bearer ${token}`},
});
export const addToFavourite = async (token,data) => await API.post(`/user/favourite`,data,{
    headers:{Authorization:`Bearer ${token}`},
});
export const deleteFromFavourite = async (token,data)=> await API.patch(`/user/favourite`,data,{
    headers:{Authorization:`Bearer ${token}`},
});

//Orders

export const placeOrder = async (token,data) => await API.post(`/user/order/`,data,{
    headers:{Authorization:`Bearer ${token}`},
});

export const getOrders = async (token) => await API.get(`user/order/`,{
    headers:{Authorization:`Bearer ${token}`},
});

export const getOrdersById = async(token) => await API.get(`user/myorders/`,{
    headers:{Authorization:`Bearer ${token}`},
});

export const updateOrderFoodStatus = async (orderId,status,token)=>{
    await API.put(`/user/admin/update-order/${orderId}/status`,
        {foodStatus:status },
        {
            headers:{Authorization:`Bearer ${token}`},
        }
);
}

export const getOrderDetails = async (orderId,token) => await API.get(`user/order/${orderId}`,{
    headers:{Authorization:`Bearer ${token}`},
});
//payment
export const createPaymentIntent = async ( token,amount )=> await API.post(`/user/create-payment-intent`,{ amount },{
    headers:{
        Authorization:`Bearer ${token}`,
    },
});

//profile
export const getUserProfile = async (token) => await API.get(`/user/profile`,{
    headers:{Authorization:`Bearer ${token}`},
});

export const updateUserProfile = async (token,data) => await API.put(`/user/update-profile`,data,{
    headers:{Authorization:`Bearer ${token}`,
"Content-Type":"multipart/form-data",
},
    
});

export const changeUserpassword = async (token,data) => await API.put(`/user/change-password`,data,{
    headers:{Authorization:`Bearer ${token}`},
});

export const deactivateUserAccount = async (token,data) => await API.put(`/user/deactivate`,data,{
    headers:{Authorization:`Bearer ${token}`},
})

export const getSummary = async (token)=> await API.get(`/dashboard/summary`,{
    headers:{Authorization:`Bearer ${token}`},
});

export const getSalesChart = async (token) => await API.get(`/dashboard/sales-chart`, {
    headers:{Authorization:`Bearer ${token}`},
});

export const getCustomerChart = async (token) => await API.get(`/dashboard/customer-chart`,{
    headers:{Authorization:`Bearer ${token}`}
});

export const getRecentOrders = async (token) => await API.get(`/dashboard/recent-orders`,{
    headers:{Authorization:`Bearer ${token}`}
});

export const updateFoodStatus = async (token,id) =>{
    return await API.put(`/food/delete/${id}`,{},{
        headers:{
            Authorization:`Bearer ${token}`,
        }
    })
} 

export const updateFood = async(id, data, token) =>{
    return await API.put(`/food/update/${id}`,data,{
        headers:{
            Authorization:`Bearer ${token}`,
        }
    })
}

export const restoreFoodStatus = async(token,id)=>
    await API.put(`/food/restore/${id}`,{},{
        headers:{
            Authorization:`Bearer ${token}`
        }
    }
);

export const sendContactMessage =async(data)=>{
    await API.post(`/contact/email`,data)
}

export const searchFood = async(q,token)=>{
    return await API.get(`/food/search`,{
        params:{ q },
        headers:{
            Authorization:`Bearer ${token}`,
        }
    })
}