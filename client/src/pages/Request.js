import React, {useState, useEffect} from 'react';
import Axios from 'axios';
import NavbarEasystep from "../components/NavbarEasystep";
import ButtonEasystep from "../components/Button";
import {v4 as uuidv4} from 'uuid';
import {authenticationService} from "../services/authetication.service";
import AlertSnackbar from "../components/AlertSnackbar";


export const Request = ({server}) => {
    // Never change states manually --> always use setState!
    const [question, setQuestion] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState(null);
    const [isValid, setIsValid] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const [currentUser, setCurrentUser] = useState(null);
    const [currentUserCareer, setCurrentUserCareer] = useState('');
    const [result, setResult] = useState(false);

    let severityColor = result ? "success" : "error";


    useEffect(() => {
        const subscription = authenticationService.currentUser.subscribe(user => {
            setCurrentUser(user);
        });
        return () => subscription.unsubscribe();
    }, []);

    const addRequest = () => {
        setIsSubmitted(true);
        return new Promise((resolve, reject) => {
            if(question===''){
                setResult(false);
                setMessage('Bitte geben Sie Ihr Anliegen ein, bevor Sie Ihre Anfrage absenden.');
                return;
            }
            if(!currentUser && email===''){
                setResult(false);
                setMessage('Bitte geben Sie Ihre Email ein, bevor Sie Ihre Anfrage absenden.');
                return;
            }
            if (currentUserCareer === '' ) {
                setResult(false);
                setMessage('Bitte geben Sie ein Betreff ein, bevor Sie Ihre Anfrage absenden.');
                return;
            }
            Axios.post(server + '/requests/', {
                id: uuidv4(),
                question: question,
                email: currentUser && currentUser.email || email,
                user_career: currentUserCareer
            }).then(() => {
                setQuestion('');
                setEmail('');
                setCurrentUserCareer('');
                console.log("success");
                setResult(true);
                setMessage("Danke für dein Anliegen, ein Experte wird dir in den folgeden Tagen antworten!");
                resolve();
            }).catch(error => {
                reject(error);
                setResult(false);
                setMessage("Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.");
            });
        });
    };

    function isValidEmail(email) {
        return /\S+@\S+\.\S+/.test(email);
    }

    const handleChange = (event) => {
        if (!isValidEmail(event.target.value)) {
            setIsValid('Die E-Mail-Adresse ist ungültig.');
        } else {
            setIsValid(null);
        }
        setEmail(event.target.value);
    };


    return (

        <div>
            <NavbarEasystep></NavbarEasystep>
            <div className="container">
                <div className="row">
                    <div className="col-12 d-flex">
                        <h1>Neues Anliegen</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 d-flex">
                        <p>Guten Tag! Schreib uns Dein Anliegen! Wir Expertinnen und Experten beantworten die Anliegen
                            in der Reihenfolge, in der sie bei uns eintreffen .<br/><br/>
                            Bitte hinterlasse hier deine E-Mail-Adresse – damit dich unsere Antwort erreicht – und den Betreff – damit wir unsere Antwort präzise ausrichten können.</p>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-12 col-md-6 d-flex">
                        <textarea className="input-box-request" placeholder="Deine Anfrage..." rows={5} value={question}
                                  onChange={(event) => {
                                      setQuestion(event.target.value);
                                  }}/>
                    </div>
                    <div className="col-12 col-md-6">
                        <p>Brauchst Du Hilfe beim Ausfüllen?</p>
                        <ul>
                            <li>Begrüssung</li>
                            <li>Was ist das Kernthema deines Anliegens?</li>
                            <li>Wenn Du Deinem Anliegen einen Titel geben würdest, wie lautet der?</li>
                            <li>Bei welchem Ziel können wir dich unterstützen?</li>
                            <li>Was müssen wir wissen, um Dein Anliegen verstehen zu können?</li>
                            <li>Hast du eine Datei, die Du angefügt möchtest?</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="container">
                {!currentUser && <>

                    <div className="row">
                        <div className="col-12 col-md-6 d-flex">
                            <input
                                type="text"
                                className="input-text"
                                style={{marginTop: "-20px"}}
                                placeholder="Deine Email Adresse" value={email} onChange={handleChange}/>
                        </div>
                    </div>
                </>}
                <div className="row">
                    <div className="col-12 col-md-6 d-flex">
                        {isValid && <h3>{isValid}</h3>}
                    </div>
                </div>
                <>
                    <div className="row">
                        <div className="col-12 col-md-6 d-flex">
                            <input
                                type="text"
                                className="input-text"
                                placeholder="Dein Betreff"
                                value={currentUserCareer}
                                onChange={(event) => {
                                    setCurrentUserCareer(event.target.value);
                                }}/>
                        </div>
                    </div>
                </>
                <div className="row">
                    <div className="col-12 col-md-6 d-flex justify-content-center align-items-center">
                        <ButtonEasystep onClick={addRequest} text="Senden"/>
                    </div>
                </div>
                <AlertSnackbar severityColor={severityColor} message={message} open={isSubmitted}
                               handleClose={() =>setIsSubmitted(false)}/>
            </div>
        </div>
    );
}
