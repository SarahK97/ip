import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {authenticationService} from "../services/authetication.service";
import NavbarEasystep from "../components/NavbarEasystep";
import ButtonEasystep from "../components/Button";
import AlertSnackbar from "../components/AlertSnackbar";

export const Login = ({server}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();
    const [result, setResult] = useState(false);
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
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleEmailLogin = async () => {
        try {
            const response = await authenticationService.login(email, password);
            console.log(response); // log the response object
            setResult(true);
            setMessage('Erfolgreiche Anmeldung'); // Update the result state variable
            if (response.role === 'expert') {
                // Redirect to the expert dashboard
                navigate("/Expert/Request");
            } else if (response.role === 'admin') {
                // Redirect to the expert dashboard
                navigate("/Admin/ExpertList");
            }
                else {
                // Redirect to the default dashboard
                navigate("/YP/Request");
            }
        } catch (error) {
            setResult(false);
            if (error === "User not found") {
                setMessage("Ungültige E-Mail");
            } else if (error === "passwords did not match") {
                setMessage("Ungültige E-Mail oder ungültiges Passwort");
            } else {
                setMessage("Es ist ein Fehler aufgetreten");
            }
        }
        setShowSnackbar(true);
    };

    return (
        <div>
            <NavbarEasystep></NavbarEasystep>
            <div className="container">
                <div className="row">
                    <div className="col-12 d-flex">
                        <h1>Login</h1>
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
                        <label htmlFor="password"></label>
                        <input
                            type="password"
                            className="input-text"
                            placeholder="Passwort"
                            id="password"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-md-6 col-lg-4 d-flex">
                        <p style={{color: "grey", marginTop: "-30px"}}><a href="/ResetPassword">Passwort vergessen?</a></p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-md-4 d-flex justify-content-center align-items-center">
                        <ButtonEasystep onClick={handleEmailLogin} text="Login"/>
                    </div>
                </div>
            </div>
            {handleSnackbar()}
        </div>
    );
};
