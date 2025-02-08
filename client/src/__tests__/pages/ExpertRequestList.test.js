import React from 'react';
import { render, screen } from '@testing-library/react';
import axios from 'axios';
import { ExpertRequestsList } from '../../pages/ExpertRequestsList';
import { authenticationService } from '../../services/authetication.service';
import '@testing-library/jest-dom/extend-expect'

jest.mock('axios');

jest.mock('../../components/NavbarEasystep', () => {
    return () => null;
});

jest.mock('../../components/RequestList', () => {
    return () => <div data-testid="mock-request-list"></div>;
});

const errorSpy = jest.spyOn(console, 'error');
errorSpy.mockImplementation(() => {})

describe('Requestlist for Experts', () => {
    const currentUserMock = {
        id: "mock_user_id",
        email: 'mock@fhnw.ch',
        role: 'expert'
    };

    beforeEach(() => {
        jest.spyOn(authenticationService.currentUser, 'subscribe').mockReturnValue({
            unsubscribe: jest.fn(),
        });

        authenticationService.currentUser.subscribe.mockImplementation(callback => {
            callback(currentUserMock);
            return { unsubscribe: jest.fn() };
        });
       
        axios.post.mockResolvedValueOnce({});
    });

    afterEach(() => {
        authenticationService.currentUser.subscribe.mockRestore();
    });

    it('renders the component', () => {
        render(<ExpertRequestsList server="http://localhost:5000" />);
        expect(screen.getByText(/Offene Anliegen/i)).toBeInTheDocument();
        expect(screen.getByTestId('mock-request-list')).toBeInTheDocument();
    });

})
