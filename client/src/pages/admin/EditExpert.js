import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { createTheme} from '@mui/material/styles';
import React, {useState, useRef, useEffect} from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

const theme = createTheme();

export default function EditExpert({ open, user, onClose, onSubmit}) {
    const [firstName, setFirstName] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const handleClose = () => {
        setFirstName("");
        setName("");
        setEmail("");
        onClose();
    }

    useEffect(
        () => {
            console.log("The user", user)

            if(user){
                setFirstName(user.firstname)
                setName(user.name)
                setEmail(user.email)
            }
        }, [user]
    )

    return (<div>
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogContent>
                <Box component="form"  sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="given-name"
                                name="firstName"
                                required
                                fullWidth
                                id="firstName"
                                label="First Name"
                                autoFocus
                                value={firstName}
                                onChange={(event) => setFirstName(event.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                id="name"
                                label="Last Name"
                                name="Name"
                                autoComplete="family-name"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                            />
                        </Grid>
                    </Grid>

                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={(event)=> {
                    event.preventDefault();

                    onSubmit({
                        id: user.id,
                        firstname: firstName,
                        name: name,
                        email: email
                    });
                    handleClose();
                }} autoFocus>
                    Agree
                </Button>
            </DialogActions>
        </Dialog>
    </div>
    );
}