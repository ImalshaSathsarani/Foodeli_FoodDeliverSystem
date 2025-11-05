
import React ,{useState} from 'react'
import axios from 'axios';
import styled from 'styled-components';



import { addFoods, uploadFoodImage } from '../../api';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';

const Form = styled.form`
max-width: 800px;
margin:auto;

`;

const FoodCard = styled.div`
border:1px solid #ccc;
border-radius: 12px;
padding:20px;
margin-bottom: 20px;
background-color: ${({ theme }) => theme.bg};`;


const Input = styled.input`
width: 100%;
margin : 8px -8px;
padding: 10px;
border-radius: 6px;
border: 1px solid #ccc;`;

const Select = styled.select`
width:100%;
margin: 8px 0;
padding: 10px;
border-radius: 6px;
border: 1px solid #ccc;`;

const Button = styled.button`
  border-radius: 10px;
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: min-content;
  padding: 16px 26px;
  box-shadow: 1px 20px 35px 0px ${({ theme }) => theme.primary + 40};
  border: 1px solid ${({ theme }) => theme.primary};
  @media (max-width: 600px) {
    padding: 8px 12px;
  }

  ${({ type, theme }) =>
    type === "secondary"
      ? `
  background: ${theme.secondary};
border: 1px solid ${({ theme }) => theme.secondary};
  `
      : `
  background: ${theme.primary};
`}

  ${({ isDisabled }) =>
    isDisabled &&
    `
  opacity: 0.8;
  cursor: not-allowed;

  `}
  ${({ isLoading }) =>
    isLoading &&
    `
    opacity: 0.8;
  cursor: not-allowed;
`}
${({ flex }) =>
    flex &&
    `
    flex: 1;
`}

${({ small }) =>
    small &&
    `
padding: 10px 28px;
`}
  ${({ outlined, theme }) =>
    outlined &&
    `
background: transparent;
color: ${theme.primary};
  box-shadow: none;
`}
  ${({ full }) =>
    full &&
    `
  width: 100%;`}
`;


const AddFoodsForm = () => {
  const token  = localStorage.getItem("foodeli-app-token");

    const [foods,setFoods] = useState([
        {
            name: '',
            desc:'',
            img:'',
            file:null,
            price:{org:'',mrp:'',off:''},
            ingredients:[''],
            category:[''],
        },
    ]);

    const handleChange = (index,field,value)=>{
        const updatedFoods = [...foods];
        if(field ==='ingredients'){
            updatedFoods[index][field] = value.split(',').map((v)=>v.trim());
        }else if(field=== 'category'){
            updatedFoods[index][field] = [value];
        }else if(field.startsWith('price')){
            const priceKey = field.split('.')[1];
            updatedFoods[index].price[priceKey] = parseFloat(value);
        }else{
            updatedFoods[index][field] = value;
        }

        setFoods(updatedFoods);
    }

    const handleFileChange = (index,file)=>{
        const updatedFoods = [...foods];
        updatedFoods[index].file = file;
        setFoods(updatedFoods);
    }

    const handleAddMore= ()=>{
        setFoods([
            ...foods,
            {
                name:'',
                desc:'',
                img:'',
                file:null,
                price:{org:'',mrp:'',off:''},
                ingredients:[''],
                category:[''],
                
            }
        ])
    }

    const handleSubmit = async (e)=>{
        e.preventDefault();
        console.log("Submit button clicked");

        try{
            const foodData = await Promise.all(
                foods.map(async(food)=>{
                    let imageUrl = food.img;
                    if(food.file){
                        const res = await uploadFoodImage(food.file);
                        imageUrl = res.data.imageUrl;
                    }

                    return {
                        name: food.name,
                        desc:food.desc,
                        img:imageUrl,
                        price:{
                            org: parseFloat(food.price.org)||0,
                            mrp: parseFloat(food.price.mrp)||0,
                            off: parseFloat(food.price.off)||0,
                        },
                        ingredients:food.ingredients,
                        category:food.category,
                    }
                })
            )

            const res = await addFoods(foodData,token);
            alert(res.data.message);

            //Reset form

            setFoods([
                {
                    name:'',
                    desc:'',
                    img:'',
                    file:null,
                    price:{org:'',mrp:'',off:''},
                    ingredients:[''],
                    category:[''],
                },
            ])

        }catch(err){
            console.error(err);
            alert('Error while adding food items');
        }
    }

  return (
    <>
    <div style={{ display: "flex", height: "100vh",flexDirection:"column" }}><Topbar/>
    <div style = {{flex: 1, display: "flex"}}>
      <Sidebar/>
      <div style = {{flex:1, padding:'20px'}}>
         <h1 style = {{textAlign:'center', marginBottom:'20px'}}>Add New Food Item</h1>
         <Form onSubmit={handleSubmit}>
   {foods.map((food,index)=>(
    <FoodCard key={index}>
        <h3>Food Item {index+1}</h3>
        <Input
        type = "text"
        placeholder='Enter Food Name'
        value = {food.name}
        onChange = {(e)=> handleChange(index,'name',e.target.value)}
        required
        />
        <Input 
        type = "text"
        placeholder = "Enter Food Description"
        value = {food.desc}
        onChange = {(e)=> handleChange(index,'desc',e.target.value)}
        required/>

        <Input 
        type= "file"
        placeholder='Upload Food Image'
        accept="image/*"
        onChange = {(e)=> handleFileChange(index,e.target.files[0])}
        />

        <Input 
        type="number"
        placeholder='Enter Original Price of Food'
        value ={food.price.org}
        onChange={(e)=>handleChange(index,'price.org',e.target.value)}
        required/>

      <Input 
        type="number"
        placeholder='Enter MRP of Food'
        value ={food.price.mrp}
        onChange={(e)=>handleChange(index,'price.mrp',e.target.value)}
        />
         
         <Input
            type="number"
            placeholder="Enter Food Discount (%)"
            value={food.price.off}
            onChange={(e) => handleChange(index, 'price.off', e.target.value)}
          />

          <Input
           type = "text"
           placeholder = " Enter Ingriedients (comma seperated)"
           value = {food.ingredients.join(',')}
           onChange = {(e)=>handleChange(index,'ingredients',e.target.value)}
           required
          />

          {/* <Select
            value={food.category[0]}
            onChange={(e)=>handleChange(index, 'category',e.target.value)}>
                <option value="">Select Category</option>
                {category.map((cat)=>(
                    <option key={cat.name} value = {cat.name}>
                        {cat.name}
                    </option>
                ))}
            </Select> */}
            <Input
            type = "text"
            placeholder = " Enter Category (comma seperated)"
            value = {food.category.join(',')}
            onChange = {(e)=>handleChange(index,'category',e.target.value)}
            />
          
    </FoodCard>

   ))}

   <button type = "button" onClick={handleAddMore} style ={{marginBottom:'20px', padding:'10px 20px', backgroundColor:'red', color:'white', border:'none', borderRadius:'5px', cursor:'pointer', boxShadow: '0 4px 8px rgba(208, 84, 84, 0.1)'}}>
    Add More
   </button>
    <button type = "submit" style ={{padding:'10px 20px', backgroundColor:'red', color:'white', border:'none', borderRadius:'5px', cursor:'pointer',marginLeft:'30px', boxShadow: '0 4px 8px rgba(228, 129, 129, 0.1)'}}>
     Submit</button>

</Form>
      </div>


    </div>
    </div>

</>
  )
 
  }
export default AddFoodsForm
