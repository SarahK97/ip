import React from 'react';
import {render, fireEvent, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import {Request} from "../../pages/Request";
import {MemoryRouter} from "react-router";
import Axios from "axios";

jest.mock('axios');
jest.mock('../../components/NavbarEasystep', () => {
    return () => null;
});

describe('Request component', () => {

    const mockServer = 'http://localhost:5000';

    beforeEach(() => {
        render(
            <MemoryRouter>
                <Request server={mockServer}/>
            </MemoryRouter>
        );
    });

    it('renders with the correct initial values', () => {

        const questionInput = screen.getByPlaceholderText(/deine anfrage/i);
        expect(questionInput.value).toBe('');

        const emailInput = screen.getByPlaceholderText(/deine email adresse/i);
        expect(emailInput.value).toBe('');
    });

    it('sets the error state when the email is invalid', () => {

        const emailInput = screen.getByPlaceholderText(/deine email adresse/i);
        fireEvent.change(emailInput, {target: {value: 'invalid email'}});

        expect(screen.getByText(/Die E-Mail-Adresse ist ungültig./i)).toBeInTheDocument();
    });

    it('clears the error state when the email is valid', () => {

        const emailInput = screen.getByPlaceholderText(/deine email adresse/i);
        fireEvent.change(emailInput, {target: {value: 'valid@email.com'}});

        expect(screen.queryByText(/email is invalid/i)).toBeNull();
    });

    it.skip('shows a thank you message after submitting a valid request', async () => {
        const server = 'http://localhost'; // Mock server address
        const mockData = { data: { id: '1', question: 'Test', email: 'test@test.com', user_career: 'Test' } };
    
        Axios.post.mockResolvedValue(mockData); // Mock successful Axios post
    
        fireEvent.change(screen.getByPlaceholderText('Deine Anfrage...'), {
            target: { value: 'Test' },
        });
        fireEvent.change(screen.getByPlaceholderText('Deine Email Adresse'), {
            target: { value: 'test@test.com' },
        });
        fireEvent.change(screen.getByPlaceholderText('Dein Betreff'), {
            target: { value: 'Test' },
        });
    
        fireEvent.click(screen.getByText('Senden'));
    
        await waitFor(() => screen.getByText('Danke für deine Anfrage!'));
    
        expect(screen.getByText('Danke für deine Anfrage!')).toBeInTheDocument();
    });

});


