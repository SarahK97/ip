import React, {useState} from 'react';
import {DdInput} from "./DdInput";

function DragAndDrop() {
    const [files, setFiles] = useState([]);

    const OnFileChange = (newFiles) => {
        console.log("OnFileChange called");
        setFiles(newFiles);
    }

    return (
        <div className="dropBox">
            <DdInput onFileChange={OnFileChange}/>
        </div>
    );
}

export default DragAndDrop;