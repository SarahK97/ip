import React from 'react';
import './Components.css';

const ButtonEasystep = (props) => {
    return (
        <button className="button" onClick={props.onClick}>
            {props.text}
        </button>
    );
};

export default ButtonEasystep;