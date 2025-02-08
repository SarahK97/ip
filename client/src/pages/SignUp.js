import {useState} from "react";
import Axios from 'axios';
import {v4 as uuidv4} from 'uuid';

export const Signup = ({server}) => {
    const [firstname, setFirstname] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [role, setRole] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();

        // Send the data to the database
        Axios.post(server + '/users/', {
            id: uuidv4(),
            firstname: firstname,
            name: name,
            email: email,
            career: 'expert',
            role: role
        }).then(() => {
            setMessage('Sign up successful. Please go to login.');
            setName('');
            setEmail('');

        }).catch((error) => {
            console.log(error);
            setMessage('Error occurred while signing up. Please try again.');
        });
    };

    return (
        <div>
            <h1>Registrieren</h1>
            <div className="Container">

                <div className="Container-grid">
                    <div className="Container-column1">
                        <br/>
                        <br/>
                        <form onSubmit={handleSubmit}>
                            <label>
                                <input
                                    type="text"
                                    className="input-text"
                                    placeholder="Name"
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                    required
                                /></label>
                            <hr className="text-line"/>
                            <br/>
                            <label>
                                <input
                                    type="text"
                                    className="input-text"
                                    placeholder="Vorname"
                                    value={firstname}
                                    onChange={(event) => setFirstname(event.target.value)}
                                    required
                                />
                            </label>
                            <hr className="text-line"/>
                            <br/>
                            <label>
                                <input
                                    type="email"
                                    className="input-text"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    required
                                />
                            </label>
                            <hr className="text-line"/>
                            <br/>
                            <label>
                                <select
                                    className="input-text"
                                    value={role}
                                    onChange={(event) => setRole(event.target.value)}
                                    required
                                >
                                    <option value="">Rolle auswählen</option>
                                    <option value="admin">Admin</option>
                                    <option value="expert">Expert</option>
                                </select>
                            </label>
                            <hr className="text-line"/>
                            <br/>
                            <center>
                                <button type="submit" onClick={handleSubmit}>Registrieren</button>
                            </center>
                        </form>
                        {message && <div>{message}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};
