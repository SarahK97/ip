import React from 'react';

function Request ({description}) {
    return (
        <div className="col-10 col-md-6 col-lg-4 d-flex justify-content-start">
            <div className="talk-bubble-request tri-right left-top justify-content-start">
                <div className="talktext">
                    <p>{description}</p>
                </div>
            </div>
        </div>
    )
}

export default Request;