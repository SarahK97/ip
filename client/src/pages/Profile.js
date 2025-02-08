import React, {useEffect, useState} from 'react';
import NavbarEasystep from '../components/NavbarEasystep';
import edit from '../Assets/edit.svg';
import userIcon from '../Assets/userIcon.png';
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import {authenticationService} from "../services/authetication.service";
import {Button} from "@mui/material";
import {Delete, Edit} from "@mui/icons-material";
import DeleteExpert from "../components/DeleteExpert";
import AlertSnackbar from "../components/AlertSnackbar";

const Profile = ({server}) => {
    const [name, setName] = useState('');
    const [firstname, setFirstname] = useState('');
    const [email, setEmail] = useState('');
    const [career, setCareer] = useState('');
    const {userId} = useParams();
    const [pdfFilesUrl, setPdfFilesUrl] = useState([]);
    const [aboutMe, setAboutMe] = useState('');
    const [currentPdf, setCurrentPdf] = useState(null);
    const currentUserId = authenticationService.currentUserValue.id;
    const [deleteAccount, setDeleteAccount]=React.useState(false);
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [result, setResult] = useState(true);
    const [showSnackbar, setShowSnackbar] = useState(false);

    const openDeleteAccount = () => setDeleteAccount(true);
    const closeDeleteAccount = () => setDeleteAccount(false);


    useEffect(() => {
        axios.get(server + `/users/${userId}`)
            .then(res => {
                const user = res.data;
                setName(user.name);
                setFirstname(user.firstname);
                setEmail(user.email);
                setCareer(user.career);
                setPdfFilesUrl([].concat(...JSON.parse(user.pdfFilesUrl || "[]")));
                setAboutMe(user.aboutMe);
            })
    }, []);

    const editProfilePath = `/EditProfile/${currentUserId}`;
    const openPdf = (url) => {
        setCurrentPdf(url);
    }
    const extractFileName = (url) => {
        return url.split('/').pop();
    }

    const submitDeleteAccount = () => {
        // Send the data to the database
        axios.delete(server + `/users/${userId}`).then(() => {
            setMessage("Your account has been deleted");
            setResult(true);
            closeDeleteAccount();
            handleSnackbar();
            authenticationService.logout();
            navigate("/");
        }).catch((error) => {
            setMessage("Some error occur. Please try again");
            setResult(false);
            console.log(error);
        });
        setShowSnackbar(true);
    };

    const handleSnackbar = () => {
        const severityColor = result ? "success" : "error";
        return (
            <div>
                <AlertSnackbar severityColor={severityColor} message={message}
                               open={showSnackbar}
                               handleClose={() => setShowSnackbar
                               (false)}/>
            </div>
        );
    };

    return (
        <div>
            <DeleteExpert open={deleteAccount} onSubmit={() => {
                submitDeleteAccount()
            }} params={""} onClose={closeDeleteAccount} />
            <NavbarEasystep/>
            <div className="container">
                <div className="row">
                    <div className="col-12 d-flex">
                        <div>
                            <h1>
                                {firstname} {name}
                            </h1>
                            <p>{email}</p>
                        </div>
                        {(currentUserId === userId) ? (
                            <a href={editProfilePath}>
                                <img src={edit} alt={'edit'} className="editProfile img-fluid"/>
                            </a>
                        ) : null}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button variant="contained" onClick={openDeleteAccount} startIcon={<Delete />} color="error" > Delete Account</Button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 d-flex">
                        <h4>Über mich:</h4>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 d-flex">
                        <p>{aboutMe}</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 d-flex">
                        <h4>Mein Studium / Beruf:</h4>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 d-flex">
                        <p>{career}</p>
                    </div>
                </div>
                <div className="row">
                    <h4>Meine Dateien</h4>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="d-flex flex-column">
                            {pdfFilesUrl && pdfFilesUrl.length > 0 ? (
                                pdfFilesUrl.map((url, index) => (
                                    <div key={index}>
                                        <a href="#!" onClick={() => openPdf(url)}>{extractFileName(url)}</a>
                                    </div>
                                ))
                            ) : (
                                <p>keine Dateien vorhanden.</p>
                            )}
                            {currentPdf && (
                                <iframe src={currentPdf} width="100%" height="500px" />
                            )}
                        </div>
                    </div>
                </div>
                {handleSnackbar()}
            </div>
        </div>
    );
};

export default Profile;