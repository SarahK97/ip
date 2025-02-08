import React from 'react';
import {useState} from 'react';
import Axios from 'axios';
import DragAndDrop from '../components/DragAndDrop';

export const UploadYP = ({ server }) => {

    const [name, setName] = useState('');
    const [firstname, setFirstname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState("");

    const addUser = () => {
        Axios.post(server + '/users/', {
            name: name,
            firstname: firstname,
            email: email,
            password: password
        }).then(() => {
            console.log("success");
        });
    };

    return (

        <div>
            <h1>Upload Profil</h1>
            <div className="Container">
                <div className="Container-grid">
                    <div className="Container-column1">
                        <label htmlFor="name-input"></label>
                        <br/>
                        <input
                            data-testid="name-input"
                            id="name-input"
                            type="text"
                            className="input-text"
                            placeholder="Name"
                            onChange={(event) => {
                            setName(event.target.value);
                        }}/>
                        <br/>
                        <hr  className="text-line"      />
                        <label htmlFor="vorname-input"></label>
                        <br/>
                        <input
                            data-testid="vorname-input"
                            id="vorname-input"
                            type="text"
                            className="input-text"
                            placeholder="Vorname"
                            onChange={(event) => {
                            setFirstname(event.target.value);
                        }}/>
                        <br/>
                        <hr  className="text-line"      />
                        <label htmlFor="email-input"></label>
                        <br/>
                        <input
                            data-testid="email-input"
                            id="email-input"
                            type="text"
                            className="input-text"
                            placeholder="E-Mail"
                            onChange={(event) => {
                            setEmail(event.target.value);
                        }}/>
                        <br/>
                        <hr  className="text-line"      />
                        <label htmlFor="password-input"></label>
                        <br/>
                        <input
                            type="password"
                            data-testid="password-input"
                            className="input-text"
                            placeholder="Passwort"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                        />
                        <br/>
                        <hr  className="text-line"      />
                        <br/>
                        {/* TODO: <p> Passwort vergessen?</p>*/}
                        <div>
                            <center>
                            <button onClick={addUser}>Speichern</button>
                            </center>
                        </div>
                    </div>
                    <div className="Container-column2">

                    </div>
                    <div className="Container-column3">
                        <DragAndDrop></DragAndDrop>
                    </div>
                </div>
            </div>
        </div>
    );

}