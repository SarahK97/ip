import React from 'react';
import { useNavigate } from 'react-router-dom';
import RouteButton from "./RouteButton";

const RequestTable = (props) => {
    const { id } = props.obj;
    const { nr } = props.obj;
    const navigate=useNavigate();
    const navigateToAnswer =()=> {
      navigate(`/ChatYPExpert/${id}`);
    }
  
    return (
                <RouteButton
                  description={`Anliegen ${nr}`}
                  route={navigateToAnswer}
                />
    );
};

export default RequestTable;