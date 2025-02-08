import React, {useEffect, useState} from 'react';
import {Icon} from '@iconify/react';
import ButtonEasystep from "./Button";
import axios from "axios";
import deleteIcon from '@iconify/icons-mdi/delete';

const FileDropZone = ({server, userId, onFileUpload}) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [pdfFiles, setPdfFiles] = useState([]);
    const [uploadStatus, setUploadStatus] = useState('');
    const [pdfFilesUrl, setPdfFilesUrl] = useState([]);

    useEffect(() => {
        axios.get(server + `/users/${userId}`)
            .then(res => {
                const user = res.data;
                setPdfFilesUrl([].concat(...JSON.parse(user.pdfFilesUrl || "[]")));
            });
    }, []);

    const handleFileChange = (event) => {
        const newFiles = Array.from(event.target.files);
        setPdfFiles(prevPdfFiles => [...prevPdfFiles, ...newFiles]);
        event.target.value = '';
    };
    const handleDrop = async (event) => {
        event.preventDefault();
        const droppedFiles = Array.from(event.dataTransfer.files);
        if (droppedFiles.length > 0) {
            setPdfFiles(prevPdfFiles => [...prevPdfFiles, ...droppedFiles]);
        }
    };
    const handleFileUpload = async () => {
        if (pdfFiles.length > 0) {
            const formData = new FormData();
            pdfFiles.forEach((file, index) => {
                formData.append('file', file);
            });
            formData.append('userId', userId);

            try {
                const response = await axios.post(server + '/upload', formData);
                setUploadStatus('Files uploaded successfully');

                setPdfFiles([]);
            } catch (error) {
                setUploadStatus('Files upload failed');
            }
        }
    };
    const extractFileName = (url) => {
        return url.split('/').pop();
    };

    const handleRemove = (fileToRemove) => {
        const updatedFiles = pdfFiles.filter((file) => file !== fileToRemove);
        setPdfFiles(updatedFiles);
    };
    const deleteFile = async (fileUrl) => {
        try {
            await axios.delete(server + '/upload/delete-file', {
                data: {
                    userId: userId,
                    pdfUrl: fileUrl,
                },
            });

            // Remove the file URL from the state
            setPdfFilesUrl(pdfFilesUrl.filter(url => url !== fileUrl));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div
            className="border border-dashed rounded p-4 text-center"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            style={{borderColor: 'rgba(131, 212, 249, 0.3)'}}

        >
            <div className="mb-3">
                <Icon className="big-icon" icon="material-symbols:cloud-upload" color="#83D4F9" height="200px"/>
            </div>
            <div className="border  p-3 mb-3">
                {pdfFiles.map((file, index) => (
                    <div className="d-flex align-items-center mb-2" key={index}>
                        <div className="flex-grow-1">{file.name}</div>
                        <ButtonEasystep onClick={() => handleRemove(file)} text="X"/>
                    </div>
                ))}
            </div>
            <div>
                <label htmlFor="file-upload" className="custom-file-upload-button">
                    Datei auswählen
                    <input
                        type="file"
                        id="file-upload"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        data-testid="file-upload"
                    />
                </label>
                <button className="custom-file-upload-button" onClick={handleFileUpload}>Upload</button>
            </div>
            <div>{uploadStatus}</div>
            <div className="border  p-3 mb-3 mt-3">
                {pdfFilesUrl.map((fileUrl, index) => (
                    <div className="d-flex align-items-center mb-2" key={index}>
                        <div className="flex-grow-1">{extractFileName(fileUrl)}</div>
                        <Icon icon={deleteIcon} onClick={() => deleteFile(fileUrl)} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FileDropZone;
