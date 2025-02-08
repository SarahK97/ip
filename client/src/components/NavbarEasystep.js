import React, {useEffect, useState} from 'react';
import {Navbar, Nav, NavDropdown, Button, Offcanvas} from 'react-bootstrap';
import Login from '../Assets/Login.png';
import {authenticationService} from "../services/authetication.service";
import "./Components.css";
import {useNavigate} from 'react-router-dom';

export default () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);
    useEffect(() => {
        console.log('useEffect triggered');
        const subscription = authenticationService.currentUser.subscribe(user => {
            console.log('currentUser updated in Navbar:', user);
            setCurrentUser(user);
            setCurrentUserId(user.id);
        });
        return () => subscription.unsubscribe();
    }, []);

    const [showSidebar, setShowSidebar] = useState(false);
    const handleSidebarClose = () => setShowSidebar(false);
    const handleSidebarShow = () => setShowSidebar(true);
    const handleLogout = () => {
        authenticationService.logout();
    };

    const navigate = useNavigate();
    const navigateToMyProfile = () => {
        navigate(`/profiles/${currentUserId}`);
    }

    return (
        <>
            <Navbar>
                <Button className="burger" onClick={handleSidebarShow}>
                    <span className="navbar-toggler-icon"></span>
                </Button>
                <Navbar.Brand className="brand-text" href="/">Easystep Connect</Navbar.Brand>
                <Nav className="ml-auto align-items-center justify-content-end">
                    <NavDropdown align="end" title={<img src={Login} alt="user" className="loginPicture"/>}>
                        {(currentUser) ? (
                            <>
                                <NavDropdown.Item onClick={navigateToMyProfile}>Mein Profil</NavDropdown.Item>
                                <NavDropdown.Item href="/" onClick={handleLogout}>Logout</NavDropdown.Item>

                            </>
                        ) : <NavDropdown.Item href="/Login">Login</NavDropdown.Item>}

                    </NavDropdown>
                </Nav>
            </Navbar>
            <Offcanvas className="sidebar" show={showSidebar} onHide={handleSidebarClose}>
                <Offcanvas.Header className="closeButton" closeButton></Offcanvas.Header>
                <Offcanvas.Body>
                    {(currentUser && currentUser.role === 'userYP') ? (
                        <>
                            <Nav.Link className="menu-text" href="/YP/Request">
                                Meine Anliegen </Nav.Link>
                            <br/>
                            <hr className="nav-line"/>
                        </>
                    ) : null}
                    {(currentUser && currentUser.role === 'expert') ? null :  
                    <>
                        <br/>
                        <Nav.Link className="menu-text" href="/Request">Neues Anliegen</Nav.Link>
                        <br/>
                        <hr className="nav-line"/>
                        <br/>
                        <Nav.Link className="menu-text" href="/Profiles">
                            Unsere Experten</Nav.Link>
                        <br/>
                    </>}
                    {(currentUser && currentUser.role === 'expert') ? (
                        <>
                            <br/>
                            <Nav.Link className="menu-text" href="/Expert/Request">Alle Anliegen</Nav.Link>
                            <br/>
                            <hr className="nav-line"/>
                            <br/>
                            <Nav.Link className="menu-text" href="/Profiles">
                                Young Professionals </Nav.Link>
                            <br/>
                        </>
                    ) : null}
                    <hr className="nav-line"/>
                    <br/>
                    <Nav.Link className="menu-text" href="/About">Über uns</Nav.Link>
                    <br/>
                    <hr className="nav-line"/>
                    <br/>
                    <Nav.Link className="menu-text" href="https://easystep.ch/">Easystep</Nav.Link>
                    <br/>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );

}
