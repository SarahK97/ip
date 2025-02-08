import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { About } from '../../pages/About';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect'

jest.mock('../../components/NavbarEasystep', () => {
    return () => null;
});

describe('About component', () => {
    beforeEach(() => {
        render(
            <Router>
                <About />
            </Router>
        );
    });

    it('renders the page title', () => {
        expect(screen.getByText('Willkommen!')).toBeInTheDocument();
    });

    it('renders the page content', () => {
        expect(screen.getByText(/Du hast auf/i)).toBeInTheDocument();
        expect(screen.getByText(/Dann helfen wir Dir gerne weiter!/i)).toBeInTheDocument();
    });

    it('navigates to Request page when button is clicked', () => {
        const button = screen.getByRole('button', { name: 'Los geht\'s!' });
        fireEvent.click(button);
        expect(window.location.pathname).toBe('/Request');
    });
});
