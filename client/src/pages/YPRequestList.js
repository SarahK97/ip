import axios from "axios";
import React, { useEffect, useState } from "react";
import NavbarEasystep from "../components/NavbarEasystep";
import RequestTable from "../components/RequestTable";
import {authenticationService} from "../services/authetication.service";
import ButtonEasystep from "../components/Button";


export const YPRequestsList = ({ server }) => {
    const [currentUserEmail, setCurrentUserEmail] = useState(null);

    const RequestList = ({ server }) => {
        const [requests, setRequests] = useState([]);
      
        useEffect(() => {
            axios.get(server + `/requests/userYP/${currentUserEmail}`)
                .then(res => {
                    const requests = res.data;
                    setRequests(requests);
                })
        }, [])

        function refreshPage() {
            window.location.reload(false);
        }
      
        return (
          <div>
            {
              requests
                .map(request =>
                    <div className="row">
                        <div className="col-12 col-md-6 d-flex justify-content-start" key={request.id}>
                            <RequestTable obj={request}/>
                        </div>
                        <div className="col-12 col-md-6 d-flex justify-content-start">
                            <ButtonEasystep
                                onClick={() => {
                                    axios.delete(server + `/requests/${request.id}`)
                                    .then(() => {
                                        refreshPage();
                                        console.log("success");
                                    })
                                }}
                                text="Beenden *"
                            />
                        </div>
                    </div>
                )
            }
          </div>
        )
    }

    useEffect(() => {
        const subscription = authenticationService.currentUser.subscribe(user => {
            console.log('currentUser updated in Navbar:', user);
            setCurrentUserEmail(user.email);
        });
        return () => subscription.unsubscribe();
    }, [])

    return (
        <div>
            <NavbarEasystep></NavbarEasystep>
            <div className="container">
                <div className="row">
                    <div className="col-12 col-md-6 d-flex">
                        <h1>Meine Anliegen</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <RequestList server={server}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <p>Wenn für dich das Anliegen erledigt ist, kannst Du <b>«Beenden»</b> drücken. Der gesamte Austausch zu diesem Anliegen wird dann <b>gelöscht.</b></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

