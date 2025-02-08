import {BehaviorSubject} from 'rxjs';
import {handleResponse} from '../helpers/handleResponse';
import {SERVER_ADDRESS} from '../App';
import axios from 'axios';

const currentUserSubject = new BehaviorSubject(JSON.parse(sessionStorage.getItem('currentUser')));

export const authenticationService = {
    login,
    logout,
    getStoredUser,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue() {
        return currentUserSubject.value
    }
};

function getStoredUser() {
    const user = sessionStorage.getItem('currentUser');
    if (user) {
        return JSON.parse(user);
    } else {
        return null;
    }
}

export const setAuthToken = (token) => {
    if (token) {
        // Apply authorization token to every request if logged in
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        // Delete auth header
        delete axios.defaults.headers.common['Authorization'];
    }
};
function login(email, password) {
    console.log(`Login function called`);
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password})
    };

    return fetch(`${SERVER_ADDRESS}/users/login`, requestOptions)
        .then(handleResponse)
        .then(data => {
            const {token, user} = data;
            console.log("Login successful. Received user data:");
            console.log(user);

            if (!currentUserSubject.value) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                sessionStorage.setItem('token', JSON.stringify(token));
                sessionStorage.setItem('currentUser', JSON.stringify(user));
                console.log('currentUser stored in sessionStorage:', user);
                currentUserSubject.next(user);
                console.log('currentUserSubject updated:', currentUserSubject.value);
                setAuthToken(token);
            }
            return user;

        }).catch(error => {
            console.error(`Login failed with error:`);
            console.error(error);
            throw error;
        });
}
function logout() {
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('token');
    currentUserSubject.next(null);
}
