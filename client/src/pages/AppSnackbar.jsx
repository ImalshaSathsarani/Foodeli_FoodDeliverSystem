import { useDispatch, useSelector } from "react-redux"
import { closeSnackbar } from "../redux/reducers/SnackBarSlice";
import { Alert, Snackbar } from "@mui/material";

  const AppSnackbar = () => {
    const dispatch = useDispatch();
    const { open, message, severity } = useSelector((state)=> state.snackbar);

    const handleClose = (event,reason) => {
        if(reason === "clickaway") return;
        dispatch(closeSnackbar());
    };

    return(
        <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
            <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>

        
    )


  }

  export default AppSnackbar;