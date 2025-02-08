import React from "react";
import NavbarEasystep from "../components/NavbarEasystep";

export const AboutEasystepConnect = () =>
{
    return (
        <div>
            <NavbarEasystep></NavbarEasystep>
            <div className="container">
                <div className="row">
                    <div className="col-12 d-flex">
                        <h1>About</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 d-flex">
                        <p>
                            Easystep Connect ist eine Erweiterung von <a href="https://easystep.ch/">easystep.ch</a>:
                            auf Easystep Connect geben dir erfahrene Berufsleute aus Gestaltung & Kunst Antworten <b>zu
                            deinen konkreten Fragen oder Anliegen</b> rund ums Thema Berufseinstieg.
                            Auf easystep.ch findest Du generelle Tipps und Tricks zum Thema Berufseinstieg in Gestaltung
                            und Kunst; egal ob Du ein Praktikum oder eine feste Anstellung suchst oder allein loslegen
                            möchtest.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}