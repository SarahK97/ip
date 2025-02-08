import React from 'react';

function Answer ({description}) {
    return (
        <div className="col-12 d-flex justify-content-end">
            <div className="talk-bubble-answer tri-right right-top justify-content-end">
                <div className="talktext">
                    <p>{description}</p>
                </div>
            </div>
        </div>
    )
}

export default Answer;