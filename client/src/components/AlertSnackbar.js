import React, {useState} from "react";
import Snackbar from "@mui/material/Snackbar";
import {Alert} from "@mui/material";

function AlertSnackbar({severityColor, message ,open, handleClose }) {

    return (
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
            <Alert onClose={handleClose} severity={severityColor} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
}

export default AlertSnackbar;