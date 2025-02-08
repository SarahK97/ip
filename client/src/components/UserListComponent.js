import React from "react";
import userIcon from "../Assets/userIcon.png";
import '../Styles/UserList.css';
import {useNavigate} from "react-router-dom";

const UserListComponent = ({users}) => {
    const navigate = useNavigate();

    const navigateToProfile = (userId) => {
        navigate(`/profiles/${userId}`);
    }

    return (
        <ul className="user-list">
            {users && users.length > 0 ? (
                users.filter(user => user.firstname && user.name).map((user) => (
                    <div onClick={() => navigateToProfile(user.id)}>
                    <li className="user-item" key={user.id}>
                        <div className="user-icon">
                            <img src={userIcon} alt="User Icon" className="user-icon"/>
                        </div>
                        <div className="user-info mt-3">
                            <h4 className="user-name">{user.firstname} {user.name}</h4>
                            <p>{user.career}</p>
                        </div>
                    </li>
                    </div>
                ))
            ): null}
        </ul>
    );
};

export default UserListComponent;
