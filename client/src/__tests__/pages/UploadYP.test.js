import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import axios from 'axios';
import {UploadYP} from "../../pages/UploadYP";
import {MemoryRouter} from "react-router";

jest.mock('axios');
const changeInputValue = (inputTestId, value) => {
    fireEvent.change(screen.getByTestId(inputTestId), { target: { value } });
};
describe('UploadYP component', () => {
    const mockServer = 'http://localhost:5000';

    beforeEach(() => {
        render(
            <MemoryRouter>
                <UploadYP server={mockServer} />
            </MemoryRouter>
        );
    });

    it('renders input fields with correct initial values', () => {
        expect(screen.getByTestId('name-input').value).toBe('');
        expect(screen.getByTestId('vorname-input').value).toBe('');
        expect(screen.getByTestId('email-input').value).toBe('');
        expect(screen.getByTestId('password-input').value).toBe('');
    });

    it('updates the input fields when typed in', () => {
        changeInputValue('name-input', 'John');
        changeInputValue('vorname-input', 'Doe');
        changeInputValue('email-input', 'john.doe@example.com');
        changeInputValue('password-input', 'password123');

        expect(screen.getByTestId('name-input').value).toBe('John');
        expect(screen.getByTestId('vorname-input').value).toBe('Doe');
        expect(screen.getByTestId('email-input').value).toBe('john.doe@example.com');
        expect(screen.getByTestId('password-input').value).toBe('password123');
    });

    it.skip('submits the form and makes a POST request with the input data', async () => {
        axios.post.mockResolvedValue({ status: 200 });

        changeInputValue('name-input', 'John');
        changeInputValue('vorname-input', 'Doe');
        changeInputValue('email-input', 'john.doe@example.com');
        changeInputValue('password-input', 'password123');

        fireEvent.click(screen.getByText(/speichern/i));
        expect(axios.post).toHaveBeenCalledWith(`${mockServer}/user/`, {
            name: 'John',
            firstname: 'Doe',
            email: 'john.doe@example.com',
            password: 'password123'
        });
    });
});