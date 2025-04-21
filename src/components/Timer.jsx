import React, { useState, useEffect } from 'react';

const Timer = ({initialTime, onTimeUp}) => {
  const [time, setTime] = useState(initialTime);

  useEffect(() => {
    let intervalId;
    if (time > 0) {
      intervalId = setInterval(() => setTime(time - 1), 1000);
    } else if (time === 0) {
      onTimeUp();
    }
    return () => clearInterval(intervalId);
  }, [time, onTimeUp]);

  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;

  return (
    <div style={{
      padding: '25px 40px',
      borderRadius: '15px',
      backgroundColor: '#ffffff',
      boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
      display: 'inline-block',
      border: `2px solid ${time <= 60 ? '#ff4444' : '#2a5298'}`,
      transition: 'all 0.3s ease',
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 1000
    }}>
      <div style={{
        textAlign: 'center',
        marginBottom: '5px',
        fontSize: '0.9em',
        color: '#666',
        fontWeight: '500'
      }}>
        Time Remaining
      </div>
      <div style={{
        fontSize: '2.5em',
        fontFamily: 'monospace',
        fontWeight: 'bold',
        color: time <= 60 ? '#ff4444' : '#2a5298',
        textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
        letterSpacing: '2px'
      }}>
        {String(hours).padStart(2, '0')}:
        {String(minutes).padStart(2, '0')}:
        {String(seconds).padStart(2, '0')}
      </div>
    </div>
  );
};

export default Timer;
