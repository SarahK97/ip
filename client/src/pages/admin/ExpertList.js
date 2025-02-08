import "../admin/expert.css";
import axios from "axios";
import React, {useEffect, useState} from "react";
import useAuthenticatedFetch from "../../helpers/useAuthenticatedFetch";
import NavbarEasystep from "../../components/NavbarEasystep";
import {Delete, Edit, Add} from '@mui/icons-material';
import {Button} from "@mui/material";
import {DataGrid} from '@mui/x-data-grid';
import AddExpert from "./AddExpert";
import EditExpert from "./EditExpert";
import DeleteExpert from "../../components/DeleteExpert";
import Axios from "axios";
import {v4 as uuidv4} from "uuid";
import AlertSnackbar from "../../components/AlertSnackbar";


export const ExpertList = ({ server }) => {
    const [users, setUsers] = useState([]);
    const [rowSelectionModel, setRowSelectionModel] = useState([]);

    const [addExpertOpen, setAddExpert] = React.useState(false);
    const [editExpertOpen, setEditExpert] = React.useState(false);
    const [deleteExpertOpen, setDeleteExpert] = React.useState(false);
    const { data: usersData, error } = useAuthenticatedFetch("/users", server);
    const [userIdToDelete, setUserIdToDelete] = useState(null);
    const [userToEdit, setUserToEdit] = useState(null);
    const [message, setMessage] = useState("");
    const [result, setResult] = useState(true);
    const [showSnackbar, setShowSnackbar] = useState(false);

    const fetchData = () => {
        return axios
            .get(`${server}/users?role=expert`)
            .then((response) => {
                setUsers(response.data);
            })
            .catch((error) => {
                console.error("Error fetching users:", error);
            });
    };

    const submitDeleteExpert = (userId) => {
        // Send the data to the database
        axios.delete(server + `/users/${userId}`).then(() => {
            setMessage("Expert deleted");
            setResult(true);
            fetchData().then(() => {
                closeDeleteExpert()
            })


        }).catch((error) => {
            setMessage("Some error occur. Please try again");
            setResult(false);
            console.log(error);
        });
        setShowSnackbar(true);
    };

    const submitEditExpert = (userData) => {
        setMessage("Expert edited");
        setResult(true);
        axios.put(server + `/users/experts/${userData.id}`, userData).then(() => {
            setMessage("Expert edited");
            setResult(true);
            handleSnackbar();
            fetchData().then(() => {
                closeEditExpert()
            })

        }).catch((error) => {
            setMessage("Some error occur. Please try again");
            setResult(false);
            console.log(error);
        });
        setShowSnackbar(true);
    };

    const submitAddExpert = (userData) => {
        Axios.post(server + '/users', {
            id: uuidv4(),
            firstname: userData.firstname,
            name: userData.name,
            email: userData.email,
            role: 'expert',
            career: 'expert',
        }).then(() => {
            setMessage("Expert added");
            setResult(true);
            fetchData().then(() => {
                closeAddExpert()
            })

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

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    useEffect(() => {
        fetchData()
    }, []);

    const openAddExpert = () => setAddExpert(true);
    const closeAddExpert = () => setAddExpert(false);

    const openEditExpert = () => setEditExpert(true);
    const closeEditExpert = () => setEditExpert(false);

    const openDeleteExpert = () => setDeleteExpert(true);
    const closeDeleteExpert = () => setDeleteExpert(false);


    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'firstname', headerName: 'First name', width: 250},
        { field: 'name', headerName: 'Last name', width: 250 },
        { field: 'email', headerName: 'E-Mail', width: 200 },
        {
            field: 'actions',
            headerName: 'Actions',
            sortable: false,
            width: 160,
            valueGetter: (params) => params,
            renderCell: (params) => {
                return (
                    <div>
                        <Button onClick={() => {
                            const user = params.value.row;
                            setUserToEdit(user)
                            openEditExpert()
                        }} startIcon={<Edit/>}/>
                        <Button onClick={() => {
                            console.log("params", params.value.row);
                            setUserIdToDelete(params.value.row.id)
                            openDeleteExpert()
                        }} startIcon={<Delete/>} color="error"/>
                    </div>
                )
            }
        },
    ];

    return (
        <div>
            <DeleteExpert open={deleteExpertOpen} onSubmit={() => {
                submitDeleteExpert(userIdToDelete)
            }} params={""} onClose={closeDeleteExpert} />
            <EditExpert open={editExpertOpen} user={userToEdit} onSubmit={submitEditExpert} params={""} onClose={closeEditExpert} />
            <AddExpert open={addExpertOpen} onSubmit={submitAddExpert} params={""} onClose={closeAddExpert} />
            <NavbarEasystep></NavbarEasystep>
            <div className="container">
            <div className="table-responsive">
                <div className="table-wrapper">
                    <div className="table-title">
                        <div className="row">
                            <div className="col-12 col-md-6 d-flex">
                                <h2>Manage <b>Experts</b></h2>
                            </div>
                            <div className="col-12 col-md-6 d-flex">
                                <Button onClick={openAddExpert} variant="contained" startIcon={<Add />} color="success">Add New Expert</Button>
                            </div>
                        </div>
                    </div>
                    <DataGrid
                        rows={users}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 5 },
                            },
                        }}
                        pageSizeOptions={[5, 10, 20, 50]}
                        disableRowSelectionOnClick
                        onRowSelectionModelChange={(newRowSelectionModel) => {
                            setRowSelectionModel(newRowSelectionModel);
                        }}
                        rowSelectionModel={rowSelectionModel}
                        checkboxSelection
                    />
                </div>
            </div>
                {handleSnackbar()}
            </div>
        </div>
    );
};

export default ExpertList;