
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import RegisterForm from '@/components/Auth/RegisterForm';
import '@/styles/globals.css';
import LoadingSpinner from '@/components/LoadingSpinner';

export const dynamic = 'force-dynamic';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/verify', {
          credentials: 'include'
        });
        const authData = await response.json();

        if (authData.authenticated) {
          // Redirect based on user type
          const dashboardPath = authData.userType === 'student' 
            ? '/student-dashboard' 
            : '/teacher-dashboard';
          router.push(dashboardPath);
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <LoadingSpinner />
      </div>
    );
  }

  return <RegisterForm />;
}

