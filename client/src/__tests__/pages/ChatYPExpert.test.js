import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import axios from 'axios';
import { ChatYPExpert } from '../../pages/ChatYPExpert';
import { authenticationService } from '../../services/authetication.service';
import '@testing-library/jest-dom/extend-expect'

jest.mock('axios');

jest.mock('../../components/NavbarEasystep', () => {
    return () => null;
});


const errorSpy = jest.spyOn(console, 'error');
errorSpy.mockImplementation(() => {})


describe('Chat page', () => {
    const currentUserMock = {
        id: "mock_user_id",
        email: 'mock@fhnw.ch',
        role: 'userYP'
    };

    const mockRequest = {
        id: "mock_request_id",
        question: 'sample question',
        email: 'mock@fhnw.ch',
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
        render(<ChatYPExpert server="http://localhost:5000" />);
        expect(screen.getByText(/Anliegen/i)).toBeInTheDocument();
    });

    it('renders the initial request and possible answers', () => {
        render(<ChatYPExpert server="http://localhost:5000" />);
        expect(axios.get).toHaveBeenCalledTimes(2);

        const requestElems = screen.getAllByTestId("request-elem");
        expect(requestElems.length).toBeGreaterThanOrEqual(1);
    });

    it('adds answer and refreshes page', async () => {
        render(<ChatYPExpert server="http://localhost:5000" />);

        const answerText = 'sample answer'
        const answerInput = screen.getByPlaceholderText('Schreibe eine Nachricht...');
        const sendButton = screen.getByText('Antworten');

        Object.defineProperty(window, 'location', {
            value: { reload: jest.fn() }
        });

        fireEvent.change(answerInput, { target: { value: answerText } });
        fireEvent.click(sendButton);

        await waitFor(() => {
          expect(axios.post).toHaveBeenCalledTimes(1);
          expect(window.location.reload).toHaveBeenCalledTimes(1);
        });
    });
});