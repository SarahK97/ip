import React, {useState} from 'react';
import NavbarEasystep from "../components/NavbarEasystep";
import ButtonEasystep from "../components/Button";
import axios from 'axios';
import Snackbar from "@mui/material/Snackbar";
import {Alert} from "@mui/material";
import AlertSnackbar from "../components/AlertSnackbar";

export const ResetPassword = ({server}) => {
    const [email, setEmail] = useState('');
    const [result, setResult] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [message, setMessage] = useState(null);
    const [showSnackbar, setShowSnackbar] = useState(false);

    const handleSnackbar = () => {
        const severityColor = result ? "success" : "error";
        return (
            <div>
                <AlertSnackbar severityColor={severityColor}
                               message={message}
                               open={showSnackbar}
                               handleClose={() =>setShowSnackbar(false)}/>
            </div>
        );
    };

    const handleEmailChange = async (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = () => {
        setIsSubmitted(true);
        axios.post(server + '/users/reset', {
            email: email
        }).then(() => {
            setEmail('');
            setResult(true);
            setMessage("Dein Passwort wurde geändert. Du kannst zu deiner Mailbox gehen");
            console.log("success");
        }).catch((error) => {
            console.log(error);
            setResult(false);
            setMessage("Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.");
        });
        setShowSnackbar(true);
    }

    return (
        <div>
            <NavbarEasystep></NavbarEasystep>
            <div className="container">
                <div className="row">
                    <div className="col-12 d-flex">
                        <h1>Passwort vergessen?</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 d-flex">
                        <p>Bitte die E-Mail für das bestehende Konto angeben. Anschliessend erhälst Du eine E-Mail zum zurücksetzen deines Passwortes.</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-md-6 col-lg-4 d-flex">
                        <label htmlFor="email"></label>
                        <input
                            type="email"
                            className="input-text"
                            placeholder="Email"
                            id="email"
                            value={email}
                            onChange={handleEmailChange}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-md-6 col-lg-4 d-flex">
                        <p style={{color: "grey", marginTop: "-30px"}}><a href="/Login">Zurück zum Login</a></p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-md-6 d-flex justify-content-center align-items-center">
                        <ButtonEasystep onClick={handlePasswordChange} text="Senden"/>
                    </div>
                </div>
                {handleSnackbar()}
            </div>
        </div>
    );
};
