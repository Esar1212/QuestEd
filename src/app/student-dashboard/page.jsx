'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorDisplay from '@/components/ErrorDisplay';
import { FiLogOut } from 'react-icons/fi';

export default function StudentDashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching auth data...'); // Add debug log
        const authRes = await fetch('/api/auth/verify', {
          credentials: 'include'
        });

        const authData = await authRes.json();
        console.log('Auth data received:', authData); // Add debug log

        if (!authRes.ok || !authData.authenticated) {
          throw new Error(authData.error || 'Not authenticated');
        }

        if (authData.userType !== 'student') {
          throw new Error('Access denied: Student account required');
        }

        setUserData({
          username: authData.fullName || 'Student',
          userId: authData.userId,
          studentType: authData.studentType,
          class: authData.class,
          stream: authData.stream,
          rollNumber:authData.rollNumber,
          year: authData.year
        });
        
        setLoading(false);

      } catch (err) {
        console.error('Dashboard error:', err);
        setError(err.message);
        router.push('/login');
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    console.log('Loading state is active');
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

  if (error) {
    return (
      <div style={{
        marginTop: '2rem',
        marginBottom: '2rem',
        marginLeft: 'auto',
        marginRight: 'auto',
        textAlign: 'center'
      }}>
        <ErrorDisplay message={error} />
      </div>
    );
  }

  return (
    <div className="container-fluid" style={{ 
      paddingTop: '6rem',
      paddingLeft: '2rem',
      paddingRight: '2rem',
      paddingBottom: '2rem',
      maxWidth: '100%',
      marginTop: '0',
      marginRight: '0',
      marginBottom: '0',
      marginLeft: '0',
      minHeight: '100vh',
      background: '#1a1a1a'
    }}>
      {/* Header Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        padding: '2.5rem',
        borderRadius: '12px',
        color: 'white',
        marginBottom: '2rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
        position: 'relative',
        maxWidth: '1400px',
        marginTop: '0',
        marginRight: 'auto',
        marginLeft: 'auto'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
              Welcome, {userData?.username || 'Student'}
            </h1>
            <p style={{ fontSize: '1.2rem', opacity: '0.9' }}>Your Learning Dashboard</p>
          </div>
          <button 
            onClick={async () => {
              try {
                await fetch('/api/auth/logout', {
                  method: 'POST',
                  credentials: 'include'
                });
                router.push('/login');
              } catch (error) {
                console.error('Logout error:', error);
              }
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              padding: '0.8rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              ':hover': { background: 'rgba(255, 255, 255, 0.2)' }
            }}
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div style={{ 
        maxWidth: '1400px',
        marginTop: '0',
        marginRight: 'auto',
        marginBottom: '2rem',
        marginLeft: 'auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem'
      }}>
        {/* Quick Stats Card */}
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <h2 style={{ fontSize: '1.5rem', color: '#2a5298', marginBottom: '1rem' }}>Quick Stats</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span>Student ID:</span>
            <span style={{ fontWeight: 'bold' }}>{userData?.userId}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span>Roll Number:</span>
            <span style={{ fontWeight: 'bold', color: '#2a5298' }}>{userData?.rollNumber}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span>Level:</span>
            <span style={{ 
              fontWeight: 'bold',
              color: '#2a5298'
            }}>
              {userData?.studentType === 'school' 
                ? (userData?.class ? `Class ${userData?.class}` : 'Not Assigned')
                : (userData?.stream && userData?.year 
                    ? `${userData?.stream} - Year ${userData?.year}`
                    : 'Not Assigned')}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Status:</span>
            <span style={{ 
              background: '#4CAF50',
              color: 'white',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '0.9rem'
            }}>Active</span>
          </div>
        </div>

        
        {/* Recent Activity Card */}
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <h2 style={{ fontSize: '1.5rem', color: '#2a5298', marginBottom: '1rem' }}>Recent Activity</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ 
              padding: '0.8rem 0',
              borderBottom: '1px solid #eee',
              color: '#666'
            }}>Logged in successfully</li>
          </ul>
        </div>
      </div>

      {/* Study Resources Section */}
      <div style={{
        maxWidth: '1400px',
        margin: '2rem auto',
        padding: '2rem',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{
          fontSize: '2rem',
          color: '#2a5298',
          marginBottom: '2rem',
          borderBottom: '2px solid #e5e7eb',
          paddingBottom: '0.75rem'
        }}>Study Resources</h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          {/* Exam Papers Card */}
          <div style={{
            background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            border: '1px solid #e5e7eb',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            cursor: 'pointer'
          }}
          onClick={() => router.push('/ExamPapers')}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
          }}>
            <h3 style={{ fontSize: '1.5rem', color: '#2a5298', marginBottom: '1rem' }}>Exam Papers</h3>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>Access and attempt your exam papers here</p>
            <div style={{
              background: '#2a5298',
              color: 'white',
              padding: '0.75rem',
              borderRadius: '8px',
              textAlign: 'center',
              fontWeight: '500'
            }}>View Papers</div>
          </div>

          {/* Video Lectures Card */}
          <div style={{
            background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            border: '1px solid #e5e7eb',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            cursor: 'pointer'
          }}
          onClick={() => router.push('/video-lectures')}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
          }}>
            <h3 style={{ fontSize: '1.5rem', color: '#2a5298', marginBottom: '1rem' }}>Video Lectures</h3>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>Watch educational video content</p>
            <div style={{
              background: '#2a5298',
              color: 'white',
              padding: '0.75rem',
              borderRadius: '8px',
              textAlign: 'center',
              fontWeight: '500'
            }}>Watch Videos</div>
          </div>

          {/* Results Card */}
          <div style={{
            background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            border: '1px solid #e5e7eb',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            cursor: 'pointer'
          }}
          onClick={() => router.push('/Results')}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
          }}>
            <h3 style={{ fontSize: '1.5rem', color: '#2a5298', marginBottom: '1rem' }}>Results</h3>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>View your exam results and progress</p>
            <div style={{
              background: '#2a5298',
              color: 'white',
              padding: '0.75rem',
              borderRadius: '8px',
              textAlign: 'center',
              fontWeight: '500'
            }}>Check Results</div>
          </div>
        </div>
      </div>
</div>
  );
}
     