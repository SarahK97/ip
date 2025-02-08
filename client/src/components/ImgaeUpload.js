import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import axios from 'axios';

const ImageUpload = ({ server, userId, onImageUpload }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');

    const handleImageChange = (event) => {
        setSelectedImage(event.target.files[0]);
    };

    const handleImageUpload = async () => {
        if (selectedImage) {
            const formData = new FormData();
            formData.append('image', selectedImage);
            formData.append('userId', userId);

            try {
                const response = await axios.post(server + '/upload/profile-image', formData);
                setUploadStatus('Image uploaded successfully');

                onImageUpload(response.data.filename);
            } catch (error) {
                setUploadStatus('Image upload failed');
            }
        }
    };

    return (
        <div className="profile-picture-upload">
            <input type="file" onChange={handleImageChange} accept="image/*" />
            <button onClick={handleImageUpload}>Upload</button>
            <div>{uploadStatus}</div>
        </div>
    );
};

export default ImageUpload;
