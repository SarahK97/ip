import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {Request} from './pages/Request';
import {UploadYP} from "./pages/UploadYP";
import {About} from "./pages/About";
import {ExpertRequestsList} from "./pages/ExpertRequestsList";
import { YPRequestsList } from './pages/YPRequestList';
import {Login} from "./pages/Login";
import {ChatYPExpert} from './pages/ChatYPExpert';
import EditProfile from "./pages/EditProfile";
import Profile from "./pages/Profile";
import {PrivateRoute} from "./components/PrivateRoute";
import UserList from "./pages/UserList";
import ExpertList from "./pages/admin/ExpertList";
import {ResetPassword} from "./pages/ResetPassword";
import {Signup} from "./pages/SignUp";
import {AboutEasystepConnect} from "./pages/AboutEasystepConnect";

// Import Font from Google
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600;700&display=swap';
document.head.appendChild(link);

require('dotenv').config();

export const SERVER_ADDRESS = process.env.SERVER_ADDRESS || "http://localhost:3001";
//export const SERVER_ADDRESS = "http://86.119.46.224:3001";

const App = () => {

    return (
        <div className="App">
            {/* Everything in Router can use the react-router-dom functionality --> access to react-router-dom stuff */}
            <Router>
                {/* Routes is used to define all routes */}
                <Routes>
                    <Route path="/" element={<About/>}/>
                    <Route path="/About" element={<AboutEasystepConnect/>}/>
                    <Route path="/Request" element={<Request server={SERVER_ADDRESS}/>}/>
                    <Route path="/UploadYP" element={<UploadYP server={SERVER_ADDRESS}/>}/>
                    <Route path="/About" element={<About/>}/>
                    <Route path="/ChatYPExpert/:requestid" element={<PrivateRoute element={<ChatYPExpert server={SERVER_ADDRESS}/>}/>}/>
                    <Route path="/Login" element={<Login server={SERVER_ADDRESS}/>}/>
                    <Route path="/Expert/Request" element={<PrivateRoute role="expert" element={<ExpertRequestsList server={SERVER_ADDRESS}/>}/>}/>
                    <Route path="/YP/Request" element={<PrivateRoute role="userYP" element={<YPRequestsList server={SERVER_ADDRESS}/>}/>}/>
                    <Route path="/Profiles" element={<UserList server={SERVER_ADDRESS}/>}/>
                    <Route path="/Profiles/:userId" element={<Profile server={SERVER_ADDRESS}/>}/>
                    <Route path="/EditProfile/:userId" element={<PrivateRoute element={<EditProfile server={SERVER_ADDRESS}/>}/>}/>
                    <Route path="/Admin/ExpertList" element={<PrivateRoute role="admin" element={<ExpertList server={SERVER_ADDRESS} role="expert"/>}/>}/>
                    <Route path='*' element={<h1>PAGE NOT FOUND</h1>}/>
                    <Route path="/ResetPassword" element={<ResetPassword server={SERVER_ADDRESS}/>}/>
                    <Route path="/SignUp" element={<Signup server={SERVER_ADDRESS}/>}/>
                </Routes>
            </Router>

        </div>
    );
}

export default App;
