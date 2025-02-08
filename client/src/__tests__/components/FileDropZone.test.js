import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FileDropZone from '../../components/FileDropZone';
import axios from 'axios';

jest.mock('axios');

describe('FileDropZone component', () => {
    const mockServer = 'http://localhost:5000';
    const mockUserId = '123';

    beforeEach(() => {
        axios.get.mockResolvedValue({data: {pdfFilesUrl: JSON.stringify([])}});
        axios.post.mockReset();
    });

    it('renders with empty file list', () => {
        render(<FileDropZone server={mockServer} userId={mockUserId}/>);

        expect(axios.get).toHaveBeenCalledWith(`${mockServer}/users/${mockUserId}`);
    });

    it('adds selected file to the file list', () => {
        render(<FileDropZone server={mockServer} userId={mockUserId}/>);

        const fileInput = screen.getByTestId('file-upload');
        const file = new File(['test content'], 'test-file.pdf', {type: 'application/pdf'});

        fireEvent.change(fileInput, {target: {files: [file]}});

        expect(screen.getByText('test-file.pdf')).toBeInTheDocument();
    });


    it('removes file from the file list', () => {
        render(<FileDropZone server={mockServer} userId={mockUserId}/>);

        const fileInput = screen.getByLabelText(/Datei auswählen/i);
        const file = new File(['test content'], 'test-file.pdf', {type: 'application/pdf'});

        fireEvent.change(fileInput, {target: {files: [file]}});
        fireEvent.click(screen.getByText('X'));

        expect(screen.queryByText('test-file.pdf')).toBeNull();
    });

    it('uploads files to the server', async () => {
        axios.post.mockResolvedValueOnce({data: 'Upload success'});

        render(<FileDropZone server={mockServer} userId={mockUserId}/>);

        const fileInput = screen.getByLabelText(/Datei auswählen/i);
        const file = new File(['test content'], 'test-file.pdf', {type: 'application/pdf'});

        fireEvent.change(fileInput, {target: {files: [file]}});
        fireEvent.click(screen.getByText('Upload'));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(`${mockServer}/upload`, expect.any(FormData));
            expect(screen.getByText(/Files uploaded successfully/i)).toBeInTheDocument();
        });
    });

    it('handles file upload failure', async () => {
        const error = new Error('Upload failed');
        axios.post.mockRejectedValueOnce(error);

        render(<FileDropZone server={mockServer} userId={mockUserId}/>);

        const fileInput = screen.getByLabelText(/Datei auswählen/i);
        const file = new File(['test content'], 'test-file.pdf', {type: 'application/pdf'});

        fireEvent.change(fileInput, {target: {files: [file]}});
        fireEvent.click(screen.getByText('Upload'));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(`${mockServer}/upload`, expect.any(FormData));
            expect(screen.getByText(/Files upload failed/i)).toBeInTheDocument();
        });
    });
});
