import React from 'react';
import {Navigate} from 'react-router-dom';
import {authenticationService} from '../services/authetication.service';

export const PrivateRoute = ({ role, element }) => {
    const currentUser = authenticationService.currentUserValue;
    const isLoggedIn = !!currentUser;
    const userRole = currentUser?.role;

    if (isLoggedIn && (!role || userRole === role)) {
        return element;
    } else {
        return <Navigate to="/Login" replace />;
    }
};