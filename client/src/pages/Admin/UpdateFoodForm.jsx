import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import { getProductDetails, updateFood, uploadFoodImage } from "../../api";
import { openSnackbar } from "../../redux/reducers/SnackBarSlice";
import { useDispatch } from "react-redux";

const Form = styled.form`
  max-width: 800px;
  margin: auto;
`;

const FoodCard = styled.div`
  border: 1px solid #ccc;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  background-color: ${({ theme }) => theme.bg};
`;

const Input = styled.input`
  width: 100%;
  margin: 8px -8px;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: red;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
  box-shadow: 0 4px 8px rgba(208, 84, 84, 0.1);
`;

const UpdateFoodForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("foodeli-app-token");
  const dispatch = useDispatch();

  const [food, setFood] = useState({
    name: "",
    desc: "",
    img: "",
    file: null,
    price: { org: "", mrp: "", off: "" },
    ingredients: [""],
    category: [""],
  });

  useEffect(() => {
    const fetchFoodDetails = async () => {
      try {
        const res = await getProductDetails(id);
        const data = res.data;

        setFood({
          name: data.name,
          desc: data.desc,
          img: data.img,
          file: null,
          price: {
            org: data.price?.org || "",
            mrp: data.price?.mrp || "",
            off: data.price?.off || "",
          },
          ingredients: data.ingredients || [""],
          category: data.category || [""],
        });
      } catch (error) {
        console.error("Error fetching food details:", error);
      }
    };

    fetchFoodDetails();
  }, [id]);

  const handleChange = (field, value) => {
    const updatedFood = { ...food };
    if (field === "ingredients") {
      updatedFood.ingredients = value.split(",").map((v) => v.trim());
    } else if (field === "category") {
      updatedFood.category = [value];
    } else if (field.startsWith("price")) {
      const priceKey = field.split(".")[1];
      updatedFood.price[priceKey] = parseFloat(value);
    } else {
      updatedFood[field] = value;
    }
    setFood(updatedFood);
  };

  const handleFileChange = (file) => {
    setFood({ ...food, file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = food.img;
      if (food.file) {
        const res = await uploadFoodImage(food.file);
        imageUrl = res.data.imageUrl;
      }

      const updatedFood = {
        name: food.name,
        desc: food.desc,
        img: imageUrl,
        price: {
          org: parseFloat(food.price.org) || 0,
          mrp: parseFloat(food.price.mrp) || 0,
          off: parseFloat(food.price.off) || 0,
        },
        ingredients: food.ingredients,
        category: food.category,
      };

      const res = await updateFood(id, updatedFood, token);
      //alert(res.data.message);
        dispatch(
                      openSnackbar({
                          message:res.data.message || "Food Updated Successfully",
                          severity:"success",
                      })
                  );
      navigate(`/admin/dishes/${id}`); // redirect to foods list page
    } catch (err) {
      console.error(err);
      alert("Error while updating food item");
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", flexDirection: "column" }}>
      <Topbar />
      <div style={{ flex: 1, display: "flex" }}>
        <Sidebar />
        <div style={{ flex: 1, padding: "20px" }}>
          <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
            Update Food Item
          </h1>
          <Form onSubmit={handleSubmit}>
            <FoodCard>
              <Input
                type="text"
                placeholder="Enter Food Name"
                value={food.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
              />
              <Input
                type="text"
                placeholder="Enter Food Description"
                value={food.desc}
                onChange={(e) => handleChange("desc", e.target.value)}
                required
              />

              {/* Show current image */}
              {food.img && !food.file && (
                <img
                  src={`http://localhost:5000${food.img}`}
                  alt="food"
                  style={{
                    width: "150px",
                    borderRadius: "8px",
                    marginBottom: "10px",
                  }}
                />
              )}

              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e.target.files[0])}
              />

              <Input
                type="number"
                placeholder="Enter Original Price of Food"
                value={food.price.org}
                onChange={(e) => handleChange("price.org", e.target.value)}
                required
              />

              <Input
                type="number"
                placeholder="Enter MRP of Food"
                value={food.price.mrp}
                onChange={(e) => handleChange("price.mrp", e.target.value)}
              />

              <Input
                type="number"
                placeholder="Enter Food Discount (%)"
                value={food.price.off}
                onChange={(e) => handleChange("price.off", e.target.value)}
              />

              <Input
                type="text"
                placeholder="Enter Ingredients (comma separated)"
                value={food.ingredients.join(",")}
                onChange={(e) => handleChange("ingredients", e.target.value)}
                required
              />

              <Input
                type="text"
                placeholder="Enter Category (comma separated)"
                value={food.category.join(",")}
                onChange={(e) => handleChange("category", e.target.value)}
              />

              <div style={{ marginTop: "20px" }}>
                <Button type="submit">Update</Button>
                <Button
                  type="button"
                  style={{ backgroundColor: "gray" }}
                  onClick={() => navigate(`/admin/dishes/${id}`)}
                >
                  Cancel
                </Button>
              </div>
            </FoodCard>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default UpdateFoodForm;
