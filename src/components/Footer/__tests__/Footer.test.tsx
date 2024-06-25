import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Footer from '../index';

describe('Footer Component', () => {
  it('should render the footer with all its sections', () => {
    render(<Footer />);
    expect(screen.getByTestId('footer-text')).toBeInTheDocument();
    expect(screen.getByTestId('section')).toBeInTheDocument();
  });

  it('opens community page in a new tab on community button click', () => {
    window.open = jest.fn();
    render(<Footer />);
    const communityButton = screen.getByText(/Join our community/);
    fireEvent.click(communityButton);
    expect(window.open).toHaveBeenCalledWith('https://community.deriv.com/', '_blank');
  });

  it('opens Telegram in a new tab when Telegram button is clicked', () => {
    window.open = jest.fn();
    render(<Footer />);
    const telegramButton = screen.getByText(/Telegram/);
    fireEvent.click(telegramButton);
    expect(window.open).toHaveBeenCalledWith('https://t.me/derivdotcomofficial', '_blank');
  });

  it('opens respective email in a new tab when email button is clicked', () => {
    window.open = jest.fn();
    render(<Footer />);
    const emailButton = screen.getByText(/Send an email/);
    fireEvent.click(emailButton);
    expect(window.open).toHaveBeenCalledWith('mailto:api-support@deriv.com', '_blank');
  });
});
