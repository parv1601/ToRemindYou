// src/pages/WantsPortal.js
import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const API_URL = 'http://localhost:5000/api/wishes'; // Targetting your wish route

// --- Styled Components for Aesthetic Look ---
const PortalContainer = styled.div`
  padding: 20px 0;
  text-align: center;
`;

const FormCard = styled.form`
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
`;

const Title = styled.h2`
  color: var(--primary-color);
  margin-bottom: 20px;
  font-size: 1.8rem;
`;

const Subtitle = styled.p`
  color: var(--light-text);
  margin-bottom: 25px;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 120px;
  padding: 15px;
  border: 2px solid var(--secondary-color);
  border-radius: 10px;
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  resize: vertical;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: var(--primary-color);
    outline: none;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 15px;
  margin-top: 20px;
  border: none;
  border-radius: 10px;
  background-color: var(--primary-color);
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.1s ease;

  &:hover {
    background-color: #580894;
  }
  &:active {
    transform: scale(0.99);
  }
`;

const StatusMessage = styled.p`
  margin-top: 20px;
  font-weight: 600;
  color: ${props => (props.$success ? '#4CAF50' : '#ff6b6b')};
`;

const WantsPortal = () => {
    const [wishMessage, setWishMessage] = useState('');
    const [status, setStatus] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!wishMessage.trim()) return;

        setIsLoading(true);
        setStatus('');
        setIsSuccess(false);

        try {
            await axios.post(API_URL, { message: wishMessage });

            setStatus('Wish successfully sent!');
            setIsSuccess(true);
            setWishMessage(''); // Clear input on success
        } catch (error) {
            console.error('Wish submission error:', error);
            setStatus('Failed to send wish. Please try again.');
            setIsSuccess(false);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <PortalContainer>
            <FormCard onSubmit={handleSubmit}>
                <Title>Wants Portal</Title>
                <Subtitle>What's on your mind today? Drop a wish!</Subtitle>
                
                <TextArea
                    placeholder="E.g., ice cream..."
                    value={wishMessage}
                    onChange={(e) => setWishMessage(e.target.value)}
                    disabled={isLoading}
                    required
                />

                <Button type="submit" disabled={isLoading || !wishMessage.trim()}>
                    {isLoading ? 'Sending...' : 'Send Wish'}
                </Button>

                {status && (
                    <StatusMessage $success={isSuccess}>{status}</StatusMessage>
                )}
            </FormCard>
        </PortalContainer>
    );
};

export default WantsPortal;