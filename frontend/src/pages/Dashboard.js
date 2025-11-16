// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components'; // Using styled-components for that aesthetic feel
import AestheticPhotoCard from '../components/AestheticPhotoCard';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  text-align: center;
`;

const Card = styled.div`
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
  width: 100%;
  max-width: 450px;
`;

const MilestoneTitle = styled.h2`
  color: var(--primary-color);
  font-weight: 600;
  margin-bottom: 15px;
`;

const CountdownText = styled.p`
  font-size: 3rem;
  font-weight: bold;
  color: var(--secondary-color);
  margin: 0;
  line-height: 1;
`;

const HelperText = styled.p`
  margin-top: 5px;
  color: var(--light-text);
  font-size: 0.9rem;
`;

const CelebrationCard = styled(Card)`
  background: linear-gradient(135deg, #ffb7c5, #ff8c94); /* Pink gradient */
  color: white;
  animation: pulse 1s infinite alternate;
  
  @keyframes pulse {
    from { transform: scale(1); }
    to { transform: scale(1.02); }
  }
`;

// Helper function to calculate days left
const calculateTimeLeft = (targetDate) => {
  const now = new Date();
  const target = new Date(targetDate);
  const difference = target.getTime() - now.getTime();

  if (difference <= 0) {
    return { days: 0, isPast: true };
  }

  const days = Math.ceil(difference / (1000 * 60 * 60 * 24));
  return { days, isPast: false };
};

const Dashboard = () => {
  // Anniversary Date: August 17th, 2023 (as specified in requirements)
  const ANNIVERSARY_DAY = 17;
  const ANNIVERSARY_DATE_STR = '2023-08-17T00:00:00'; 
  
  const [countdown, setCountdown] = useState(null);
  const [isCelebrationDay, setIsCelebrationDay] = useState(false);
  const [currentAnniversaryYear, setCurrentAnniversaryYear] = useState(2024);

  useEffect(() => {
    const today = new Date();
    const currentDay = today.getDate();

    // 1. Check for Monthly Celebration Day
    if (currentDay === ANNIVERSARY_DAY) {
      setIsCelebrationDay(true);
    } else {
      setIsCelebrationDay(false);
    }

    // 2. Calculate next anniversary target
    const nowYear = today.getFullYear();
    const nowMonth = today.getMonth() + 1; // 1-12
    const targetMonth = 8; // August
    
    let nextTargetYear = nowYear;
    
    // If the date has passed this year, target next year
    if (nowMonth > targetMonth || (nowMonth === targetMonth && currentDay > ANNIVERSARY_DAY)) {
      nextTargetYear += 1;
    }
    
    // Set the state for display
    setCurrentAnniversaryYear(nextTargetYear);

    // Create the full date string for the next anniversary
    const nextAnniversaryDate = `${nextTargetYear}-08-${ANNIVERSARY_DAY}T00:00:00`;

    // 3. Set up countdown timer (runs every second)
    const timer = setInterval(() => {
      setCountdown(calculateTimeLeft(nextAnniversaryDate).days);
    }, 1000 * 60 * 60); // Update roughly every hour (or use 1000 for per-second)
    
    // Initial run
    setCountdown(calculateTimeLeft(nextAnniversaryDate).days);

    return () => clearInterval(timer);
  }, []); // Run only once on mount

  return (
    <DashboardContainer>
      {isCelebrationDay && (
        <CelebrationCard>
          <MilestoneTitle>YOO IT'S 17th IT SEEMS</MilestoneTitle>
          <p>It'ssssss 17TH!!!</p>
        </CelebrationCard>
      )}

      {countdown !== null && (
        <Card>
          <MilestoneTitle>Our Anniversary Countdown</MilestoneTitle>
          <CountdownText>{countdown}</CountdownText>
          <HelperText>Days until August {ANNIVERSARY_DAY}, {currentAnniversaryYear}</HelperText>
        </Card>
      )}

      <Card>
        <MilestoneTitle>Focus</MilestoneTitle>
        <p style={{ color: 'var(--primary-color)', fontWeight: '600' }}>
            "You need to enable JavaScript to run this app."
        </p>
        <HelperText>
            (This phrase is used for the reminder email subject/body for fun, 
             but here on the home page, it serves as a minimalist, focused message.)
        </HelperText>
      </Card>
      
    </DashboardContainer>
  );
};

export default Dashboard;