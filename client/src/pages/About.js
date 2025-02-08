import {useNavigate} from 'react-router-dom';
import React from "react";
import step1 from '../Assets/step1.svg';
import step2 from '../Assets/step2.svg';
import ButtonEasystep from '../components/Button';
import NavbarEasystep from "../components/NavbarEasystep";

export const About = () => {
    const navigate = useNavigate();
    const navigateRequest = () => {
        navigate('/Request');
    }

    return (
        <div>
            <NavbarEasystep></NavbarEasystep>
            <div className="container">
                <div className="row">
                    <div className="col-12 d-flex">
                        <h1>Willkommen!</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 d-flex">
                        <p>
                            Du hast auf  <a href="https://easystep.ch/">easystep.ch</a> nachgeschaut und hast jetzt ein Anliegen oder eine Frage zu Deiner Bewerbungs- oder Berufssituation?
                            <br/><br/>Dann helfen wir Dir gerne weiter!
                        </p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 d-flex">
                        <p>
                            1.)Schreib uns Dein Anliegen/ Deine Frage. Unsere erfahrenen Berufsleute, werden Dir bald eine Antwort schreiben.
                        </p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 d-flex">
                        <img src={step1} alt={"step1"} className="img-fluid" />
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 d-flex">
                        <p>
                            2.)Du hast mehr als ein Anliegen? Auch das ist kein Problem: Du kannst mit den Expert*innen Unterhaltungen führen.
                        </p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 d-flex">
                        <img src={step2} alt={"step2"} className="img-fluid" />
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 d-flex justify-content-center">
                        <ButtonEasystep onClick={navigateRequest} text="Los geht's!" />
                    </div>
                </div>
            </div>
        </div>
    );
}