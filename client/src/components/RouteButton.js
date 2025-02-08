import React from 'react';
import './Components.css';

function RouteButton ({description, route}) {
    return (
        <button data-testid='routebutton' className="routebutton" onClick={route} size="sm" variant="info">
            {description}
        </button>

    )
}

export default RouteButton;