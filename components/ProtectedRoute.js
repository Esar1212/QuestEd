// components/ProtectedRoute.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import styled, { keyframes } from 'styled-components';

// Animations
const pulse = keyframes`
  0% { transform: scale(0.95); opacity: 0.6; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(0.95); opacity: 0.6; }
`;

const bookFlip = keyframes`
  0% { transform: perspective(400px) rotateY(0); }
  50% { transform: perspective(400px) rotateY(180deg); }
  100% { transform: perspective(400px) rotateY(360deg); }
`;

// Styled Components
const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
  padding: 2rem;
`;

const RoleIndicator = styled.div`
  margin-bottom: 2rem;
  text-align: center;
  &::before {
    content: "${({ userType }) => 
      userType === 'teacher' ? '👩🏫' : 
      userType === 'student' ? '👨🎓' : '🔒'}";
    font-size: 3rem;
    display: block;
    margin-bottom: 1rem;
    animation: ${pulse} 2s infinite;
  }
`;

const BookLoader = styled.div`
  width: 80px;
  height: 60px;
  position: relative;
  animation: ${bookFlip} 3s infinite;
  transform-style: preserve-3d;

  &::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background: ${({ userType }) => 
      userType === 'teacher' ? '#8e44ad' : 
      userType === 'student' ? '#3498db' : '#2c3e50'};
    border-radius: 5px;
    box-shadow: 0 10px 20px rgba(0,0,0,0.2);
  }
`;

const LoadingMessage = styled.div`
  margin-top: 2rem;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;

  strong {
    color: ${({ userType }) => 
      userType === 'teacher' ? '#8e44ad' : 
      userType === 'student' ? '#3498db' : '#2c3e50'};
    font-weight: 600;
  }
`;

const Dots = styled.span`
  &::after {
    content: '.';
    animation: ${pulse} 1s steps(5, end) infinite;
  }
`;

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (!loading && user && allowedRoles && !allowedRoles.includes(user.userType)) {
      router.push('/unauthorized');
    }
  }, [user, loading, router, allowedRoles]);

  if (loading || !user || (allowedRoles && !allowedRoles.includes(user.userType))) {
    return (
      <LoadingContainer>
        <RoleIndicator userType={user?.userType}>
          {!user ? 'Verifying Session' : 
           user.userType === 'teacher' ? 'Teacher Portal' : 
           user.studentType === 'school' ? 'School Student' : 'College Student'}
        </RoleIndicator>
        
        <BookLoader userType={user?.userType} />
        
        <LoadingMessage userType={user?.userType}>
          {!user ? (
            <>Checking authentication<Dots /></>
          ) : (
            <>
              Welcome back, <strong>{user.fullName}</strong>
              <br />
              Redirecting to {user.userType === 'teacher' ? 'teacher' : 'student'} dashboard<Dots />
            </>
          )}
        </LoadingMessage>
      </LoadingContainer>
    );
  }

  return children;
};

export default ProtectedRoute;