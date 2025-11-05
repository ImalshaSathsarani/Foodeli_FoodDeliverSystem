import styled ,{ThemeProvider} from "styled-components";
import { BrowserRouter } from 'react-router-dom';
import { lightTheme } from './utils/Themes';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useSelector } from "react-redux";
import { useState } from "react";
import AppContent from "./AppContent";
import AppSnackbar from "./pages/AppSnackbar";

const Container = styled.div``;

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function App() {
  const { currentUser } = useSelector((state) => state.user);
  const [openAuth, setOpenAuth] = useState(false);

  return (
    <ThemeProvider theme={lightTheme}>
      <BrowserRouter>
        <Container>
          <Elements stripe={stripePromise}>
            <AppContent currentUser={currentUser} openAuth={openAuth} setOpenAuth={setOpenAuth} />
          </Elements>
          <AppSnackbar />
        </Container>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
