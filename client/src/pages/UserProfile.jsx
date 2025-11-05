import React, { useState } from 'react';
import { Tabs, Tab, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';
import { Details } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import LockIcon from '@mui/icons-material/Lock';
import DeleteIcon from '@mui/icons-material/Delete';
import LogoutIcon from '@mui/icons-material/Logout';
import { useEffect } from 'react';
import { deactivateUserAccount, getFavourite, getUserProfile } from '../api';
import { getOrdersById } from '../api';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/reducers/UserSlice';
import { useNavigate} from 'react-router-dom';
import Footer from '../components/Footer';

const UserProfile = () => {
  const [tab, setTab] = useState(0);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState(null);
  const [favourites, setFavourites] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const BASE_URL = "http://localhost:5000";

  const handleTabChange = (e, newValue) => {
    setTab(newValue);
  };

  const handleLogoutConfirm = () =>{
    setOpenLogoutDialog(false);
    dispatch(logout());
    localStorage.removeItem('foodeli-app-token');
    navigate('/');

    console.log("User logged out");
  }

  const handleDeleteConfirm = async () =>{
    setOpenDeleteDialog(false);
    try{
      const token = localStorage.getItem('foodeli-app-token');
      const { data } = await deactivateUserAccount(token);
      console.log("Account deactivation response:", data);
      dispatch(logout());
      localStorage.removeItem('foodeli-app-token');
      navigate('/');

    }catch(e){
      console.error("Error deleting account:", e.message);
    }
   
  }

  useEffect(()=>{
    // Fetch user data from backend or local storage
    const fetchUserData = async () =>{
      const token = localStorage.getItem('foodeli-app-token'); // Retrieve token from localStorage
      console.log("Retrieved token:", token);
      if (token) {
        try{
          const {data} = await getUserProfile(token);
          console.log("Fetched user data:", data.user);
          setUser(data.user); // Optionally set user data to state

        }catch(e){
          console.error("Error fetching user data:", e.message);
        }
        
      }
    };

    const fetchOrders = async () =>{
      const token = localStorage.getItem('foodeli-app-token');
      if(token){
        try{
          const {data} = await getOrdersById(token);
          console.log("Fetched user orders:", data.orders);
          setOrders(data.orders);

        }catch(e){
        console.error("Error fetching orders:", e.message);
      }
      }
    }

    const fetchFavourites = async () =>{
      const token = localStorage.getItem('foodeli-app-token');
      if(token){
        try{
          const {data} = await getFavourite(token);
          console.log("Fetched favourites:", data.favouriteProducts);
          setFavourites(data.favouriteProducts);
        }catch(e){
          console.error("Error fetching favourites:", e.message);
        }

      }
    }
    fetchUserData();
    fetchOrders();
    fetchFavourites();
  }, []);

 

  return (
    <>
      <Dialog open={openLogoutDialog} onClose={() => setOpenLogoutDialog(false)}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>Are you sure you want to log out?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLogoutDialog(false)} color="primary">Cancel</Button>
          <Button onClick={handleLogoutConfirm} color="error">Yes, Log out</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
  <DialogTitle>Confirm Account Deletion</DialogTitle>
  <DialogContent>This action cannot be undone. Are you sure you want to delete your account?</DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
    <Button onClick={handleDeleteConfirm} color="error">Yes, Delete</Button>
  </DialogActions>
</Dialog>

      <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#f3f3f3', padding: '24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#e0e0e0', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', color: '#666',overflow: 'hidden', }}>
                {user?.img ? (
                  <img src={`${BASE_URL}${user.img}`} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ):(
<PersonIcon fontSize="inherit" style={{ color: '#d35252' }} />
                )}
                
              </div>
              <div style={{ marginLeft: '16px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Hello, {user?.name || "Guest"}</h2>
                <p style={{ color: '#666', margin: 0 }}>{user?.email || "guest@example.com"}</p>
              </div>
            </div>
            <Link to="/editProfile">
              <button
                style={{ backgroundColor: '#ef4444', color: 'white', padding: '8px 16px', borderRadius: '12px', border: 'none', cursor: 'pointer' }}>Edit Profile</button></Link>
          </div>

          <Tabs
            value={tab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="inherit"
            variant="fullWidth"
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: 'red',
              },
            }}
          >
            <Tab icon={<PersonIcon />} label="Details" />
            <Tab icon={<HistoryIcon />} label="Orders" />
            <Tab icon={<FavoriteIcon />} label="Favorites" />
            <Tab icon={<SettingsIcon />} label="Settings" />

          </Tabs>

          <div style={{ marginTop: '24px' }}>
            {tab === 0 && (
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>Profile Details</h3>
                <div style={{ backgroundColor: '#f9f9f9', padding: '16px', borderRadius: '12px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  <p style={{ margin: 0 }}>Name: {user?.name || "Guest"}</p>
                  <p style={{ margin: '8px 0 0' }}>Email: {user?.email || "guest@example.com"}</p>
                  <p style={{ margin: '8px 0 0' }}>Phone: {user?.phone || "Not Provided"}</p>
                  <p style={{ margin: '8px 0 0' }}>Address: {user?.address || "Not Provided"}</p>
                  <p style={{ margin: '8px 0 0' }}>Joined: {new Date(user?.createdAt).toLocaleDateString() || "January 1, 2023"}</p>
                  <p style={{ margin: '8px 0 0' }}>Gender: {user?.gender || "Not Specified"}</p>
                </div>
              </div>
            )}

            {/* {tab === 1 && (
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>Your Orders</h3>
                {orders && orders.length >0 ?(
                  orders.map((order, index)=>(
                     <ul key= {index} style={{ listStyle: 'none', padding: 0 }}>
                      {order.products.map((item)=>(
                          <li 
                          key={item.product._id}
                          style={{ backgroundColor: '#f9f9f9', padding: '16px', borderRadius: '12px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span>{item.product.name}</span>
                    <span style={{ color: '#666' }}>{order.foodStatus}</span>
                  </li>
                      ))}
                
                  
                </ul>

                  ))
                ):(
                  <p style={{ color: '#666' }}>You have no orders yet.</p>
                )}
               
              </div>
            )} */}


{tab === 1 && (
  <div>
    <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '16px' }}>Your Orders</h3>
    {orders && orders.length > 0 ? (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px',
        }}
      >
        {orders.map((order) => (
          <div
            key={order._id}
            style={{
              backgroundColor: '#fff',
              borderRadius: '16px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
              overflow: 'hidden',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.08)';
            }}
          >
            <div style={{ padding: '16px' }}>
              <p style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                Order ID: {order._id.slice(-6).toUpperCase()}
              </p>

              {order.products.map((item) => (
                <div
                  key={item.product._id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px',
                    padding: '8px 0',
                    borderBottom: '1px solid #f0f0f0',
                  }}
                >
                  <span style={{ fontWeight: '500', color: '#333' }}>{item.product.name}</span>
                  <span style={{ color: '#555' }}>LKR {item.product.price.org}</span>
                </div>
              ))}

              <div
                style={{
                  marginTop: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: '14px', color: '#666' }}>
                  Total Items: {order.products.length}
                </span>
                <span
                  style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: order.foodStatus === 'Delivered' ? '#16a34a' : '#f59e0b',
                    backgroundColor:
                      order.foodStatus === 'Delivered'
                        ? 'rgba(22, 163, 74, 0.1)'
                        : 'rgba(245, 158, 11, 0.1)',
                  }}
                >
                  {order.foodStatus}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p style={{ color: '#666' }}>You have no orders yet.</p>
    )}
  </div>
)}

            {/* {tab === 2 && (
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>Favorite Dishes</h3>
                {favourites && favourites.length >0 ?(
                  favourites.map((fav)=>(
                     <div  key = {fav._id} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <div style={{ backgroundColor: '#f0f0f0', padding: '16px', borderRadius: '12px', textAlign: 'center', flex: '1 1 45%', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>{fav.name}  Original: LKR {fav.price.org}</div>
                
                </div>
                  ))
                ):(
                  <p style={{ color: '#666' }}>You have no favorite dishes yet.</p>
                )}
               
              </div>
            )} */}

            {/* {tab === 2 && (
              <div>
                 <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '16px' }}>Favorite Dishes</h3>
                 {favourites && favourites.length > 0 ? (
                  <div style = {}}
              </div>

            )} */}
            
{tab === 2 && (
  <div>
    <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '16px' }}>Favorite Dishes</h3>
    {favourites && favourites.length > 0 ? (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '16px',
        }}
      >
        {favourites.map((fav) => (
          <div
            key={fav._id}
            style={{
              position: 'relative',
              backgroundColor: '#fff',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
            }}
          >
            {fav.img ? (
              <img
                src={`${BASE_URL}${fav.img}`}
                alt={fav.name}
                style={{ width: '100%', height: '120px', objectFit: 'cover' }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '120px',
                  backgroundColor: '#f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  color: '#aaa',
                }}
              >
                No Image
              </div>
            )}

            {/* Heart Icon Overlay */}
            <FavoriteIcon
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                color: '#ff4d6d',
                backgroundColor: 'rgba(255,255,255,0.9)',
                borderRadius: '50%',
                padding: '4px',
                fontSize: '20px',
              }}
            />

            <div style={{ padding: '12px', textAlign: 'center' }}>
              <p
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  margin: '0 0 8px',
                  color: '#333',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                title={fav.name}
              >
                {fav.name}
              </p>
              <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
                Original: LKR {fav.price.org}
              </p>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p style={{ color: '#666' }}>You have no favorite dishes yet.</p>
    )}
  </div>
)}

            {tab === 3 && (
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>Settings</h3>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '20px',
                    width: '100%',
                    maxWidth: '600px'



                  }}>
                    <Link to="/changePassword" style={{ textDecoration: 'none', width: '100%' }}>
                      <button style={{ backgroundColor: '#ddd', padding: '12px', borderRadius: '12px', border: 'none', cursor: 'pointer', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        <LockIcon style={{ color: '#333' }} />
                        Change Password</button>
                    </Link>
                    <button
                      onClick={() => setOpenDeleteDialog(true)}
                      style={{ backgroundColor: '#dc2626', color: 'white', padding: '12px', borderRadius: '12px', border: 'none', cursor: 'pointer', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginLeft: '20px' }}>
                      <DeleteIcon />
                      Delete Account</button>
                  </div>

                  <button
                    onClick={() => setOpenLogoutDialog(true)}
                    style={{ backgroundColor: '#ddd', padding: '12px', borderRadius: '12px', border: 'none', cursor: 'pointer', width: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <LogoutIcon style={{ color: '#333' }} />
                    Log out</button>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default UserProfile;
