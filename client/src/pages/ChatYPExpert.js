import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useParams} from 'react-router-dom';
import Request from '../components/RequestInChat';
import Answer from '../components/AnswerInChat';
import {authenticationService} from "../services/authetication.service";
import { v4 as uuidv4 } from 'uuid';
import NavbarEasystep from "../components/NavbarEasystep";
import ButtonEasystep from "../components/Button";

export const ChatYPExpert = ({server}) => {
    // Never change states manually --> always use setState!
    const [request, setRequest] = useState('');
    const [answer, setAnswer] = useState('');
    const [answerDisplay, setAnswerdisplay] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [currentUserRole, setCurrentUserRole] = useState(null);
    const [userCareer, setUserCareer] = useState('');
    const [requestnr, setRequestnr] = useState('');
    const {requestid} = useParams();

    useEffect(() => {
        const subscription = authenticationService.currentUser.subscribe(user => {
            console.log('currentUser updated in Navbar:', user);
            setCurrentUserId(user.id);
            setCurrentUserRole(user.role);
        });

        Promise.all([
            axios.get(server + `/requests/${requestid}`),
            axios.get(server + `/answers/${requestid}`)
        ])
        .then(([resRequest, dataAnswer]) => {
            const request = resRequest.data[0];
            const answers = dataAnswer.data;
            setRequest(request);
            setAnswerdisplay(answers);
            setUserCareer(request.user_career);
            setRequestnr(request.nr);
            console.log(request)
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

        return () => subscription.unsubscribe();
    }, []);

    console.log(request);
    
    function refreshPage() {
        window.location.reload(false);
    }

    const addAnswer = () => {
        axios.post(server + '/answers/', {
            id: uuidv4(),
            id_request: request.id,
            text: answer,
            id_user: currentUserId,
            type_user: currentUserRole
        }).then(() => {
            setAnswer('');
            refreshPage();
            console.log("success");
        });
    };

    const handleCloseChat = () => {
        if(currentUserRole === 'userYP') {
            window.location.href='/YP/Request'
        } else {
            window.location.href='/Expert/Request'
        }
    }

    
    const renderBubble = (answer) => {
        if (answer.type_user === 'userYP') {
            return <Request description={answer.text}/>;
        } else {
            return <Answer description={answer.text}/>;
        }
    }

    return (
        <div>
            <NavbarEasystep></NavbarEasystep>
            <div className="container">
                <div className="row">
                    <div className="col-6 d-flex">
                        <h1>Anliegen {requestnr} : {userCareer} </h1>
                    </div>
                    <div className="col-6 d-flex justify-content-end">
                        <button className="closepagebutton" onClick={handleCloseChat}>x</button>
                    </div>
                </div>
                <div data-testid="request-elem" className="row">
                    <Request description={request.question}/>
                </div>
                        {
                            answerDisplay
                                .map(answer =>
                                    <div key={answer.id}>
                                        <div className="row">
                                            {renderBubble(answer)}
                                        </div>
                                    </div>
                                )
                        }
                </div>
                <div className="row">
                    <div className="col-12 d-flex justify-content-center">
                        <textarea
                            className="input-box-request"
                            rows={5}
                            value={answer}
                            onChange={(event) => {
                            setAnswer(event.target.value);}}
                            placeholder="Schreibe eine Nachricht..."
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 d-flex justify-content-center">
                        <ButtonEasystep onClick={addAnswer} text="Antworten"/>
                    </div>
                </div>
        </div>
    );
}