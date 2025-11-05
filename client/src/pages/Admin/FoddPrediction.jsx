import React ,{useEffect, useState} from 'react'
import axios from 'axios'
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
const FoddPrediction = () => {

    const [predictions ,setPredictions] = useState([]);

    useEffect(()=>{
        axios.get('https://foodeli-fooddeliversystem-1.onrender.com/predict')
        .then(response =>setPredictions(response.data))
        .catch(error => console.error('Error fetching predictions:', error));
    }, []);
    console.log(predictions);


  return (
    <div style={{display: "flex", height: "100vh",flexDirection:"column"}}>
      <Topbar/>
    <div style = {{ flex: 1, display: "flex"}}>
       <Sidebar/>
       <div style = {{flex:1, padding:'20px'}}>
        <h1 style = {{textAlign: "center", marginBottom: "20px"}}>Food Prediction for Next Day</h1>
         <table style = {{margin : 'auto',width:'50%',border:'1px solid red',borderCollapse:'collapse'}}>
        <thead style= {{padding:'10px'}}>
          <tr style = {{backgroundColor:'rgba(206, 46, 46, 0.1)',textAlign:'center'}}>
            <th style = {{border:'1px solid red' ,padding:'10px'}}>Food Item</th>
            <th style = {{border:'1px solid red',padding:'10px'}}>No: of items will sell on tomorrow</th>
          </tr>
        </thead>
        <tbody>
            {predictions.map((prediction,idx)=>(
 <tr key = {idx} style = {{border:'1px solid red',textAlign:'center'}}>
                <td style = {{border:'1px solid red', padding:'5px'}}>{prediction.food_name}</td>
                <td style = {{border:'1px solid red', padding:'5px'}}>{prediction.predicted_quantity}</td>
            </tr>
            ))}
           
           
        </tbody>
      </table>
       </div>
      

     
    </div>
    </div>
  )
}

export default FoddPrediction
