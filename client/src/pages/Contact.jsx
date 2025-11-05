import React, { useState } from "react";
import styled from "styled-components";
import Footer from "../components/Footer";
import { openSnackbar } from "../redux/reducers/SnackBarSlice";
import { useDispatch } from "react-redux";
import { sendContactMessage } from "../api";
import { Token } from "@mui/icons-material";

const Container = styled.div`
  padding: 40px 20px;
  min-height: auto;
  background: ${({ theme }) => theme.bg};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Wrapper = styled.div`
  max-width: 1200px;
  width: 100%;
  display: flex;
  gap: 50px;
  flex-wrap: wrap;
  justify-content: center;
`;

const Left = styled.div`
  flex: 1;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: ${({ theme }) => theme.card};
  border-radius: 12px;
  box-shadow: 0px 4px 12px rgba(0,0,0,0.08);
  padding: 24px;
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 16px;
  color: ${({ theme }) => theme.text_secondary};
`;

const Right = styled.div`
  flex: 1;
  min-width: 300px;
  background: ${({ theme }) => theme.card};
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0px 4px 12px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  outline: none;
  font-size: 14px;
  margin-left:10px;
`;

const TextArea = styled.textarea`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  outline: none;
  font-size: 14px;
  resize: none;
  height: 120px;
  width:385px;
  margin-left:10px;
  margin-top:10px;
`;

const Button = styled.button`
  background: red;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: 0.3s;
  margin-left:10px;

  &:hover {
    background: darkred;
  }
`;

const Contact = () => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading,setLoading] =useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit =  async (e) => {
    e.preventDefault();
      const token = localStorage.getItem("foodeli-app-token")

    try{
       setLoading(true);
        await sendContactMessage(form);

          //const token = localStorage.getItem("foodeli-app-token")

           dispatch(
        openSnackbar({
          message: "Message sent successfully!",
          severity: "success",
        })
      );

       setForm({ name: "", email: "", message: "" });

    }catch(err){
         dispatch(
      openSnackbar({
        message: err.response?.data?.error||"Failed to send message!",
        severity: "error",
      })
    );
    console.log("Error sending message:",err.message)
    } finally{
        setLoading(false);
    }
    

    
    
  };

  return (
    <>
      <Container>
        <Wrapper>
          {/* Left Section */}
          <Left>
            <Title>Contact Us</Title>
            <Info>
              <p><strong>Phone:</strong> +94 77 123 4567</p>
              <p><strong>Email:</strong> support@foodeli.com</p>
              <p><strong>Address:</strong> Colombo, Sri Lanka</p>
            </Info>
          </Left>

          {/* Right Section (Form) */}
          <Right>
            <Title>Send us a message</Title>
            <form onSubmit={handleSubmit}>
              <Input
                type="text"
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                required
              />
              <Input
                type="email"
                name="email"
                placeholder="Your Email"
                value={form.email}
                onChange={handleChange}
                required
              />
              <TextArea
                name="message"
                placeholder="Your Message"
                value={form.message}
                onChange={handleChange}
                required
              />
              <Button type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </Right>
        </Wrapper>
      </Container>
      <Footer />
    </>
  );
};

export default Contact;
