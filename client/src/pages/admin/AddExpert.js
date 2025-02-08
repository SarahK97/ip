import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme} from '@mui/material/styles';
import React, {useState} from "react";
import {Add} from "@mui/icons-material";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

const theme = createTheme({
    palette: {
        background: {
            default: "#ffffff"
        },
    }
});

export default function AddExpert({ open, onClose, onSubmit}) {
    const [firstName, setFirstName] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const handleClose = () => {
        setFirstName("");
        setName("");
        setEmail("");
        onClose();
    }


    return (<div>
            <Dialog
                open={open}
                onClose={onClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                    <Box component="form"  sx={{ mt: 3 }}>
                        <Grid container spacing={1}>
                            <Grid item xs={12} >
                                <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                                    <PersonAddAlt1Icon />
                                </Avatar>
                                <Typography component="h1" variant="h5">
                                    Neu Expert
                                </Typography>
                            </Grid>
                        </Grid>
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
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        color="success"
                        onClick={(event)=> {
                            event.preventDefault();

                            onSubmit({
                                firstname: firstName,
                                name: name,
                                email: email
                            });
                            handleClose();
                        }}
                        startIcon={<Add />}
                    >
                        Add
                    </Button>
                    <Button
                        fullWidth
                        variant="contained"
                        color="error"
                        sx={{ mt: 3, mb: 2 }}
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

