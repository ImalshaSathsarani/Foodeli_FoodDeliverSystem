import React from 'react'
import { useState } from 'react'
import { changeUserpassword } from '../../api';
import Sidebar from '../../components/Sidebar';

const ChangePassword = () => {

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState(''); 
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) =>{
    e.preventDefault();
    setMessage('');
    setError('');

    if(newPassword !== confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    try{
      const token = localStorage.getItem('foodeli-app-token');
      if(!token){
        setError("User not authenticated");
        return;
      }

      const {data } = await changeUserpassword(token,{
        oldPassword,
        newPassword,
      });

      setMessage(data.message);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');

    }catch(e){
      console.log("Password Change error",e);
      setError(e.response?.data?.message || "An error occurred");
    }
  }
  return (
    
    <div style = {{ display:'flex', height:'100vh'}}>
        <Sidebar/>
        <div style={{ flex:1, padding:'40px', overflowY:"auto"}}>
    
    <div style= {{
        maxWidth: '800px',
        margin: '0px auto',
        backgroundColor:'#fff',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        padding:'32px',
        paddingTop:'2px',
        display:'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    }}>
       
        <h1 style = {{marginBottom: '24px'}}>Change Password</h1>
         {message && <p style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>}
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
     <form onSubmit={handleSubmit} style = {{ width:'100%', maxWidth:'500px'}}>
         <div style = {{ marginBottom: '20px'}}>
        <label style = {{
            display: 'block',
            marginBottom: '10px',
            color: 'red',
            fontWeight: 'bold'
        }}>Current Password:</label>
        <input 
        type="password" 
        placeholder="Enter current password" 
        value={oldPassword}
        onChange={(e)=>setOldPassword(e.target.value)} 
        style = {{
          
            width: '100%',
            padding: '15px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            fontSize: '16px',
            marginBottom: '16px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
        />
      </div>
      <div style = {{marginBottom: '20px'}}>
        <label style = {{
            display: 'block',
            marginBottom: '10px',
            color: 'red',
            fontWeight: 'bold'
        }}>New Password:</label>
        <input 
        type="password" 
        placeholder="Enter new password" 
        value={newPassword}
        onChange={(e)=>setNewPassword(e.target.value)}
        style = {{
           
            width: '100%',
            padding: '15px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            fontSize: '16px',
            marginBottom: '16px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }} />
      </div>
      <div style = {{marginBottom: '20px'}}>
        <label style = {{
            display: 'block',
            marginBottom: '10px',
            color: 'red',
            fontWeight: 'bold'
        }}>Confirm New Password:</label>
        <input 
        type="password" 
        placeholder="Confirm new password" 
        value={confirmPassword}
        onChange={(e)=>setConfirmPassword(e.target.value)}
        style = {{
            width: '100%',
            padding: '15px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            fontSize: '16px',
           
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }} />
      </div>
      <button 
       type = "submit" 
       style = {{
        padding:'12px 24px',
        backgroundColor: '#d35252',
        color:'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        cursor: 'pointer',
        marginLeft: '35%',
      }}> Update Password

      </button>
        </form>  
     
    </div>
    </div>
    </div>
  )
}

export default ChangePassword
