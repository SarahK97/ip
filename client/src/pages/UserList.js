import "../App.css";
import axios from "axios";
import React, {useEffect, useState} from "react";
import UserListComponent from "../components/UserListComponent";
import NavbarEasystep from "../components/NavbarEasystep";
import {authenticationService} from "../services/authetication.service";

export const UserList = ({server}) => {
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        axios
            .get(`${server}/users`)
            .then((response) => {
                setUsers(response.data);
            })
            .catch((error) => {
                console.error("Error fetching users:", error);
            });
    }, []);
    useEffect(() => {
        const subscription = authenticationService.currentUser.subscribe(user => {
            setCurrentUser(user);
        });
        return () => subscription.unsubscribe();
    }, []);

    // Filter users based on the current user's role
    const filteredUsers = currentUser
        ? users.filter(user => user.role === (currentUser.role === 'expert' ? 'userYP' : 'expert'))
        : users.filter(user => user.role === 'expert');
    return (
        <div>
            <NavbarEasystep></NavbarEasystep>
            <div className="container">
                <div className="row">
                    <div className="col-12 d-flex mt-4">
                        {currentUser && currentUser.role === 'expert'
                            ? <h1>Young Professionals</h1>
                            : <h1>Experten</h1>}
                    </div>
                </div>
                    <UserListComponent users={filteredUsers}/>
            </div>
        </div>
    );
};

export default UserList;
