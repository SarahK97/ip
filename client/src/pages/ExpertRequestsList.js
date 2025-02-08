import React from "react";
import RequestList from "../components/RequestList";
import NavbarEasystep from "../components/NavbarEasystep";

export const ExpertRequestsList = ({ server }) => {
    return (
        <div>
            <NavbarEasystep></NavbarEasystep>
            <div className="container">
                <div className="row">
                    <div className="col-12 d-flex">
                        <h1>Offene Anliegen</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-md-6">
                        <RequestList server={server}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

