import React, {useRef, useState} from "react";
import {Icon} from "@iconify/react";
import PropTypes from 'prop-types';

export const DdInput = (props) => {
    const wrapperRef = useRef(null);
    const [fileList, setFilelist] = useState([]);

    const onDragEnter = () => wrapperRef.current.classList.add('dragover');
    const onDragLeave = () => wrapperRef.current.classList.remove('dragover');
    const onDrop = () => wrapperRef.current.classList.remove('dragover');


    const onFileDrop = (e) => {
        console.log('onFileDrop called');
        const newFile = e.target.files[0];
        if (newFile) {
            const updatedList = [...fileList, newFile];
            setFilelist(updatedList);
            props.onFileChange(updatedList);
        }
    }
    const fileRemove = (file) => {
        const updatedList = [...fileList];
        updatedList.splice(fileList.indexOf(file), 1);
        setFilelist(updatedList);
        props.fileRemove(updatedList);
    }
    return (
        <>
            <div
                ref={wrapperRef}
                className="ddInput"
                data-testid='drop-area'
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
            >
                <div className="dropBox">
                    <Icon className="big-icon" icon="material-symbols:cloud-upload" color="#83D4F9" height="200px"/>
                    <p> Drag & Drop deine Dateien</p>
                </div>
                <input type="file" value="" multiple onChange={onFileDrop} data-testid="file-input"></input>
            </div>
            {
                fileList.length > 0 ? (
                    <div>
                        <p className="ddPreview-Title">
                            Ready to upload:
                        </p>
                        {
                            fileList.map((item, index) => (
                                <div key={index} className="ddPreview-Item">
                                    <div>
                                        <div key={index} className="ddItem-delete" data-testid='delete-button'
                                             onClick={() => fileRemove(item)}>x
                                        </div>
                                        <p>{item.name}</p>
                                        <p>{item.size}B</p>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                ) : null}
        </>
    );
}
DdInput.propTypes = {
    onFileChange: PropTypes.func.isRequired,
    fileList: PropTypes.array
}