import React, {useState, useEffect} from 'react';
import {authenticationService} from "../services/authetication.service";
import axios from "axios";
import NavbarEasystep from "../components/NavbarEasystep";
import FileDropZone from "../components/FileDropZone";
import ButtonEasystep from "../components/Button";
import {useParams} from "react-router-dom";


const EditProfile = ({server}) => {
    const token = sessionStorage.getItem("token");
    const [name, setName] = useState("");
    const [firstname, setFirstname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const [career, setCareer] = useState("")
    const [aboutMe, setAboutMe] = useState("");
    const [pdfFiles, setPdfFiles] = useState([]);
    const [uploadedFilenames, setUploadedFilenames] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);
    const {userId} = useParams();

    useEffect(() => {
        const subscription = authenticationService.currentUser.subscribe(user => {
            setCurrentUserId(user.id);
        });

        axios.get(server + `/users/${userId}`)
            .then(response => {
                console.log("Response data: ", response.data);
                const data = response.data;
                if (data) {
                    setName(data.name || "");
                    setFirstname(data.firstname || "");
                    setEmail(data.email || "");
                    setCareer(data.career || "");
                    setPassword(data.password || "");
                    setAboutMe(data.aboutMe || "");
                    const pdfFilesArray = data.pdfFiles ? JSON.parse(data.pdfFiles) : [];
                    setPdfFiles(pdfFilesArray);
                    setUploadedFilenames(pdfFilesArray);

                }
            })
            .catch(error => {
                alert("Failed to fetch user data. Please try again later.");
            });

        return () => subscription.unsubscribe();
    }, [userId]);

    const handleFileUpload = (filename) => {
        setUploadedFilenames([...uploadedFilenames, filename]);
    };


    const handleUpdate = async () => {
        try {
            await axios.put(
                `${server}/users/${userId}`,
                {
                    name: name,
                    firstname: firstname,
                    email: email,
                    career: career,
                    password: password,
                    aboutMe: aboutMe,
                    pdfFiles: JSON.stringify(uploadedFilenames),

                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert("Profil erfolgreich aktualisiert!");
        } catch (err) {
            console.error(err);
            alert("Aktualisierung der Benutzerdaten fehlgeschlagen. Bitte versuchen Sie es später noch einmal.");
        }
    };
    const PdfFile = ({url, onRemove}) => {
        return (
            <div>
                <a href={url} target="_blank">{url}</a>
                <button onClick={() => onRemove(url)}>X</button>
            </div>
        );
    };
    const handleFileRemove = (url) => {
        setUploadedFilenames(uploadedFilenames.filter(fileUrl => fileUrl !== url));
    };


    return (
        <div>
            <NavbarEasystep></NavbarEasystep>
            <div className="container">
                <div className="row">
                    <div className="col-12 d-flex">
                        <h1>Mein Profil</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-md-8">
                        <div className="row">
                            <div className="col-12">
                                <h2>Meine Angaben</h2>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <input
                                    type="text"
                                    className="input-text"
                                    placeholder="Name"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <input
                                    type="text"
                                    className="input-text"
                                    placeholder="Firstname"
                                    value={firstname}
                                    onChange={e => setFirstname(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <input
                                    type="text"
                                    className="input-text"
                                    placeholder="Email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <input
                                    type="password"
                                    className="input-text"
                                    placeholder="Password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <h2>Mein Studium/ Beruf</h2>
                                <input
                                    type="text"
                                    className="input-text"
                                    placeholder="Career"
                                    value={career}
                                    onChange={e => setCareer(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <h2>Über mich</h2>
                                <textarea
                                    className="input-box-request w-100"
                                    placeholder=" "
                                    rows={5}
                                    value={aboutMe}
                                    onChange={e => setAboutMe(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <h2>Meine Dateien</h2>
                                <p>
                                    Füge Dateien hinzu, um dein Profil für Expert*innen attraktiver zu gestalten.
                                </p>
                                <FileDropZone server={server} userId={userId} onFileUpload={handleFileUpload} />
                                {uploadedFilenames.map(url => (
                                    <PdfFile url={url} onRemove={handleFileRemove} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12 d-flex justify-content-center align-items-center">
                <ButtonEasystep onClick={handleUpdate} text="Speichern" />
            </div>
            <br></br>
        </div>
    );
};


export default EditProfile;
