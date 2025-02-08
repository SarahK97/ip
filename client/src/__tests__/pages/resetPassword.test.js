import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import axios from 'axios';
import { ResetPassword } from '../../pages/ResetPassword';
import '@testing-library/jest-dom/extend-expect'

jest.mock('axios');

jest.mock('../../components/NavbarEasystep', () => {
    return () => null;
});

describe('PasswortVergessen', () => {
  it('renders the component', () => {
    render(<ResetPassword server="http://localhost:5000" />);
    expect(screen.getByText('Passwort vergessen?')).toBeInTheDocument();
  });

  it('sends a reset password request on button click', async () => {
    const email = 'test@test.com';
    axios.post.mockResolvedValueOnce({});

    render(<ResetPassword server="http://localhost:5000" />);
    const emailInput = screen.getByPlaceholderText('Email');
    const sendButton = screen.getByText('Senden');

    fireEvent.change(emailInput, { target: { value: email } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/users/reset', { email });
    });
  });

  it.skip('displays an error message on request failure', async () => {
    axios.post.mockRejectedValueOnce(new Error('Request failed'));

    render(<ResetPassword server="http://localhost:5000" />);
    const emailInput = screen.getByPlaceholderText('Email');
    const sendButton = screen.getByText('Senden');

    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(screen.getByText('Error occurred. Please try again.')).toBeInTheDocument();
    });
  });
});
