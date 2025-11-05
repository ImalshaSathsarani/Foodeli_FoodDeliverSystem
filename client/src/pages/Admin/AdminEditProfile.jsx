import React from 'react';
import PersonIcon from '@mui/icons-material/Person';
import { CameraAltOutlined } from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { getUserProfile, updateUserProfile } from '../../api';
import Sidebar from '../../components/Sidebar';

const EditProfile = () => {

  const [formData, setFormData] = useState({
    name:"",
    email:"",
    phone:"",
    address:"",
    gender:"",
    img:null,
  });

  const [preview,setPreview] = useState(null); //image preview
  const navigate = useNavigate();

  const token = localStorage.getItem('foodeli-app-token');

  useEffect(()=>{
    const fetchProfile =  async () =>{
      try{
        const { data } = await getUserProfile(token);
        const user = data.user;
        console.log("User profile data for edit profile:", user);

        setFormData({
          name:user.name,
          email:user.email,
          phone:user.phone || "",
          address:user.address || "",
          gender:user.gender || "",
          img:user.img || null,
        });

        setPreview(user.img || null);

      }catch(e){
        console.log("error fetching profile data", e.message);
      }
    };
    if(token) fetchProfile();
  }, [token]);


  const handleChange = (e) =>{
    setFormData({ ...formData, [e.target.name]:e.target.value});
  };

  const handleImageChange = (e) =>{
    const file = e.target.files[0];
    setFormData({...formData, img: file});
    setPreview(URL.createObjectURL(file));
  }

  const handleSubmit = async (e) =>{
    e.preventDefault();
    try{
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("email", formData.email);
      submitData.append("phone", formData.phone);
      submitData.append("address", formData.address);
      submitData.append("gender", formData.gender);
      if(formData.img) submitData.append("img", formData.img);

      const { data } = await updateUserProfile(token, submitData);
      alert(data.message);
      navigate('/adminProfile');

    }catch(e){
      console.log("Error updating profile:", e.message);
    }
  }
  return (
    <div style= {{
        display:'flex',
        height:'100vh'
    }}>
        <Sidebar/>
        <div style={{
            flex:1,
            padding:"40px",
            overflowY:'auto',
            display:'flex',
            justifyContent:'center',
            alignItems:'flex-start',
        }}>
    <div
      style={{
        maxWidth: '800px',
        width:'100%',
        //margin: '40px auto',
        backgroundColor: '#fff',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        padding: '32px',
        //paddingTop:'2px',
       
      }}
    >
      <h2
        style={{
          textAlign: 'center',
          fontSize: '36px',
          marginBottom: '24px',
          color: '#333',
        }}
      >
        Edit Profile
      </h2>

      <div
        style={{
          margin: '0 auto 32px auto',
          borderRadius: '50%',
          backgroundColor: '#f3f3f3',
          height: '120px',
          width: '120px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position:"relative"
        }}
      >
        
        
          {preview ? (
            <img src = {preview.startsWith("blob:") ? preview:`http://localhost:5000${preview}`} 
            alt="Profile" 
            style=
            {{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover' }} />
          ):(
            <PersonIcon style={{ fontSize: 60, color: '#d35252' }} />
          )}
            
              <label htmlFor="imgUpload">
                 <CameraAltOutlined style={{ position: 'absolute', bottom: 0, right: 0,left:100,top:70, fontSize: 20, color: '#d35252', border:'2px solid #d35252', borderRadius:'100%' ,padding:'5px',cursor: "pointer"  }} /></label>
           

        
        <input 
        id = "imgUpload"
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleImageChange}
        />

      </div>

      <form  onSubmit = {handleSubmit}style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {[
          { label: 'Name', name:'name', type: 'text'},
          { label: 'Email', name:'email', type: 'email'},
          { label: 'Phone', name:'phone', type: 'tel'},
          { label: 'Address', name:'address', type: 'text'},
        ].map((field, idx) => (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: '6px', color: 'red' }}>{field.label}:</label>
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              style={{
                padding: '10px 12px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                fontSize: '16px',
              }}
            />
          </div>
        ))}

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ marginBottom: '6px', color: '#555', fontWeight: 'bold' }}>Gender:</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            style={{
              padding: '10px 12px',
              border: '1px solid #ccc',
              borderRadius: '8px',
              fontSize: '16px',
            }}
          >
            <option value="">Select</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <button
          type="submit"
          style={{
            marginTop: '24px',
            backgroundColor: '#ef4444',
            color: '#fff',
            padding: '12px',
            borderRadius: '10px',
            border: 'none',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#dc2626')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#ef4444')}
        >
          Save Changes
        </button>
      </form>
    </div>
    </div>
    </div>
  );
};

export default EditProfile;
