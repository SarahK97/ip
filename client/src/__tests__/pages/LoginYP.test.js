import React from 'react';
import {render, fireEvent, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import {Login} from '../../pages/Login';
import axios from 'axios';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('axios');

jest.mock('../../components/NavbarEasystep', () => {
    return () => null;
});

const errorSpy = jest.spyOn(console, 'error');
errorSpy.mockImplementation(() => {})


describe('Login component', () => {
    const mockServer = 'http://localhost:5000';

    beforeEach(() => {
        axios.post.mockReset();

        render(
            <Router>
                <Login server={mockServer}/>
            </Router>
        );
    });
    it('renders with empty inputs', () => {

        const emailInput = screen.getByPlaceholderText(/email/i);
        expect(emailInput.value).toBe('');

        const passwordInput = screen.getByPlaceholderText(/passwort/i);
        expect(passwordInput.value).toBe('');

        expect(screen.queryByText(/logged in/i)).toBeNull();
        expect(screen.queryByText(/invalid email or password/i)).toBeNull();
    });

    it('sets the email state when the email input changes', () => {

        const emailInput = screen.getByPlaceholderText(/email/i);
        fireEvent.change(emailInput, {target: {value: 'test@example.com'}});

        expect(emailInput.value).toBe('test@example.com');
    });

    it('sets the password state when the password input changes', () => {

        const passwordInput = screen.getByPlaceholderText(/passwort/i);
        fireEvent.change(passwordInput, {target: {value: 'testpassword'}});

        expect(passwordInput.value).toBe('testpassword');
    });
});
