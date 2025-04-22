'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorDisplay from '@/components/ErrorDisplay';
import { FiLogOut } from 'react-icons/fi';
import Head from 'next/head';

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

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        router.push('/login');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/login');
    }
  };

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
    <Head>
        <meta name="google" content="notranslate" />
        <meta name="robots" content="noindex,nofollow" />
        <meta name="autocomplete" content="off" />
      </Head>
    <div className="container-fluid" style={{ 
      paddingTop: '4rem',
      paddingLeft: '1.5rem',
      paddingRight: '1.5rem',
      paddingBottom: '1.5rem',
      maxWidth: '100%',
      marginTop: '0',
      marginRight: '0',
      marginBottom: '0',
      marginLeft: '0',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a1929 0%, #1a365d 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
        animation: 'pulse 4s ease-in-out infinite',
        zIndex: 0
      }} />
      
      {/* Floating Particles */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        zIndex: 0
      }}>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: '4px',
              height: '4px',
              background: 'rgba(255,255,255,0.5)',
              borderRadius: '50%',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 5}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* Header Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, rgba(30, 60, 114, 0.95) 0%, rgba(42, 82, 152, 0.95) 100%)',
        padding: '1.75rem',
        borderRadius: '12px',
        color: 'white',
        marginTop: '0',
        marginRight: 'auto',
        marginBottom: '1.5rem',
        marginLeft: 'auto',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        position: 'relative',
        maxWidth: '1200px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)',
        transform: 'translateY(0)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        overflow: 'hidden'
      }}>
        {/* Decorative Line */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
          animation: 'shimmer 2s linear infinite'
        }} />
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          position: 'relative',
          zIndex: 1
        }}>
          <div>
            <h1 style={{ 
              fontSize: '2rem', 
              marginTop: '0',
              marginRight: '0',
              marginBottom: '0.75rem',
              marginLeft: '0',
              background: 'linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              animation: 'gradient-shift 3s ease infinite'
            }}>
              Welcome, {userData?.username || 'Student'}
            </h1>
          </div>
          <button
            onClick={handleLogout}
            style={{
              background: 'linear-gradient(135deg, #ff4d4d 0%, #ff0000 100%)',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(255,0,0,0.2)',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(255,0,0,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(255,0,0,0.2)';
            }}
          >
            <FiLogOut style={{ fontSize: '1.1rem' }} />
            Logout
          </button>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div style={{ 
        maxWidth: '1200px',
        marginTop: '0',
        marginRight: 'auto',
        marginBottom: '1.5rem',
        marginLeft: 'auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Quick Stats Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative Corner */}
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, transparent 50%, rgba(42,82,152,0.1) 50%)',
            borderTopRightRadius: '12px'
          }} />
          
          <h2 style={{ 
            fontSize: '1.25rem', 
            color: '#2a5298', 
            marginTop: '0',
            marginRight: '0',
            marginBottom: '1.25rem',
            marginLeft: '0',
            borderBottom: '2px solid rgba(42,82,152,0.1)',
            paddingBottom: '0.5rem',
            position: 'relative'
          }}>
            Quick Stats
            <div style={{
              position: 'absolute',
              bottom: '-2px',
              left: 0,
              width: '60px',
              height: '2px',
              background: 'linear-gradient(90deg, #2a5298, transparent)',
              animation: 'width-pulse 2s ease-in-out infinite'
            }} />
          </h2>
          
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              padding: '0.75rem',
              background: 'rgba(42,82,152,0.05)',
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(42,82,152,0.1)';
              e.currentTarget.style.transform = 'translateX(5px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(42,82,152,0.05)';
              e.currentTarget.style.transform = 'translateX(0)';
            }}>
              <span style={{ 
                color: '#4a5568', 
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  background: '#2a5298',
                  boxShadow: '0 0 4px rgba(42,82,152,0.5)'
                }} />
                Student ID
              </span>
              <span style={{ 
                fontWeight: 'bold', 
                color: '#2a5298', 
                fontSize: '0.9rem',
                background: 'linear-gradient(135deg, #2a5298, #1e3c72)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>{userData?.userId}</span>
            </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              padding: '0.75rem',
              background: 'rgba(42,82,152,0.05)',
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(42,82,152,0.1)';
              e.currentTarget.style.transform = 'translateX(5px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(42,82,152,0.05)';
              e.currentTarget.style.transform = 'translateX(0)';
            }}>
              <span style={{ 
                color: '#4a5568', 
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  background: '#2a5298',
                  boxShadow: '0 0 4px rgba(42,82,152,0.5)'
                }} />
                Roll Number
              </span>
              <span style={{ 
                fontWeight: 'bold', 
                color: '#2a5298', 
                fontSize: '0.9rem',
                background: 'linear-gradient(135deg, #2a5298, #1e3c72)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>{userData?.rollNumber}</span>
            </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              padding: '0.75rem',
              background: 'rgba(42,82,152,0.05)',
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(42,82,152,0.1)';
              e.currentTarget.style.transform = 'translateX(5px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(42,82,152,0.05)';
              e.currentTarget.style.transform = 'translateX(0)';
            }}>
              <span style={{ 
                color: '#4a5568', 
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  background: '#2a5298',
                  boxShadow: '0 0 4px rgba(42,82,152,0.5)'
                }} />
                Level
              </span>
              <span style={{ 
                fontWeight: 'bold', 
                color: '#2a5298', 
                fontSize: '0.9rem',
                background: 'linear-gradient(135deg, #2a5298, #1e3c72)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {userData?.studentType === 'school' 
                  ? (userData?.class ? `Class ${userData?.class}` : 'Not Assigned')
                  : (userData?.stream && userData?.year 
                      ? `${userData?.stream} - Year ${userData?.year}`
                      : 'Not Assigned')}
              </span>
            </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              padding: '0.75rem',
              background: 'rgba(42,82,152,0.05)',
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(42,82,152,0.1)';
              e.currentTarget.style.transform = 'translateX(5px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(42,82,152,0.05)';
              e.currentTarget.style.transform = 'translateX(0)';
            }}>
              <span style={{ 
                color: '#4a5568', 
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  background: '#2a5298',
                  boxShadow: '0 0 4px rgba(42,82,152,0.5)'
                }} />
                Status
              </span>
              <span style={{ 
                background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                color: 'white',
                padding: '3px 10px',
                borderRadius: '10px',
                fontSize: '0.8rem',
                boxShadow: '0 2px 4px rgba(76,175,80,0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  background: 'white',
                  boxShadow: '0 0 4px rgba(255,255,255,0.5)',
                  animation: 'pulse 2s ease-in-out infinite'
                }} />
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Recent Activity Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative Corner */}
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, transparent 50%, rgba(42,82,152,0.1) 50%)',
            borderTopRightRadius: '12px'
          }} />
          
          <h2 style={{ 
            fontSize: '1.25rem', 
            color: '#2a5298', 
            marginTop: '0',
            marginRight: '0',
            marginBottom: '1.25rem',
            marginLeft: '0',
            borderBottom: '2px solid rgba(42,82,152,0.1)',
            paddingBottom: '0.5rem',
            position: 'relative'
          }}>
            Recent Activity
            <div style={{
              position: 'absolute',
              bottom: '-2px',
              left: 0,
              width: '60px',
              height: '2px',
              background: 'linear-gradient(90deg, #2a5298, transparent)',
              animation: 'width-pulse 2s ease-in-out infinite'
            }} />
          </h2>
          
          <ul style={{ 
            listStyle: 'none', 
            padding: 0,
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <li style={{ 
              padding: '0.75rem',
              background: 'rgba(42,82,152,0.05)',
              borderRadius: '8px',
              color: '#4a5568',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(42,82,152,0.1)';
              e.currentTarget.style.transform = 'translateX(5px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(42,82,152,0.05)';
              e.currentTarget.style.transform = 'translateX(0)';
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#4CAF50',
                  boxShadow: '0 0 8px rgba(76,175,80,0.5)',
                  animation: 'pulse 2s ease-in-out infinite'
                }} />
                <span style={{
                  fontSize: '0.9rem',
                  color: '#2a5298',
                  fontWeight: '500'
                }}>Logged in successfully</span>
              </div>
              <div style={{
                fontSize: '0.8rem',
                color: '#718096',
                marginTop: '0.25rem',
                marginLeft: '1.5rem'
              }}>
                {new Date().toLocaleString()}
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Study Resources Section */}
      <div style={{
        maxWidth: '1200px',
        marginTop: '1.5rem',
        marginRight: 'auto',
        marginBottom: '1.5rem',
        marginLeft: 'auto',
        padding: '1.5rem',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Decorative Corner */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '60px',
          height: '60px',
          background: 'linear-gradient(135deg, transparent 50%, rgba(42,82,152,0.1) 50%)',
          borderTopRightRadius: '12px'
        }} />
          
        <h2 style={{
          fontSize: '1.5rem',
          color: '#2a5298',
          marginTop: '0',
          marginRight: '0',
          marginBottom: '1.5rem',
          marginLeft: '0',
          borderBottom: '2px solid rgba(42,82,152,0.1)',
          paddingBottom: '0.5rem',
          position: 'relative'
        }}>
          Study Resources
          <div style={{
            position: 'absolute',
            bottom: '-2px',
            left: 0,
            width: '80px',
            height: '2px',
            background: 'linear-gradient(90deg, #2a5298, transparent)',
            animation: 'width-pulse 2s ease-in-out infinite'
          }} />
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          {/* Exam Papers Card */}
          <div style={{
            background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            border: '1px solid rgba(42,82,152,0.1)',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden'
          }}
          onClick={() => router.push('/ExamPapers')}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)';
          }}>
            {/* Decorative Line */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, #2a5298, #4CAF50)',
              animation: 'shimmer 2s linear infinite'
            }} />
            
            <h3 style={{ 
              fontSize: '1.25rem', 
              color: '#2a5298', 
              margin: '0 0 0.75rem 0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span style={{
                width: '28px',
                height: '28px',
                background: 'rgba(42,82,152,0.1)',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.9rem',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.background = 'rgba(42,82,152,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.background = 'rgba(42,82,152,0.1)';
              }}>
                📝
              </span>
              Exam Papers
            </h3>
            <p style={{ 
              color: '#4a5568', 
              margin: '0 0 1.25rem 0',
              lineHeight: '1.5',
              fontSize: '0.9rem'
            }}>Access and attempt your exam papers here</p>
            <div style={{
              background: 'linear-gradient(135deg, #2a5298 0%, #1e3c72 100%)',
              color: 'white',
              padding: '0.75rem',
              borderRadius: '10px',
              textAlign: 'center',
              fontWeight: '500',
              fontSize: '0.9rem',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(42,82,152,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              View Papers
            </div>
          </div>

          {/* Video Lectures Card */}
          <div style={{
            background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            border: '1px solid rgba(42,82,152,0.1)',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden'
          }}
          onClick={() => router.push('/video-lectures')}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)';
          }}>
            {/* Decorative Line */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, #2a5298, #4CAF50)',
              animation: 'shimmer 2s linear infinite'
            }} />
            
            <h3 style={{ 
              fontSize: '1.25rem', 
              color: '#2a5298', 
              margin: '0 0 0.75rem 0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span style={{
                width: '28px',
                height: '28px',
                background: 'rgba(42,82,152,0.1)',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.9rem',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.background = 'rgba(42,82,152,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.background = 'rgba(42,82,152,0.1)';
              }}>
                🎥
              </span>
              Video Lectures
            </h3>
            <p style={{ 
              color: '#4a5568', 
              margin: '0 0 1.25rem 0',
              lineHeight: '1.5',
              fontSize: '0.9rem'
            }}>Watch educational video content</p>
            <div style={{
              background: 'linear-gradient(135deg, #2a5298 0%, #1e3c72 100%)',
              color: 'white',
              padding: '0.75rem',
              borderRadius: '10px',
              textAlign: 'center',
              fontWeight: '500',
              fontSize: '0.9rem',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(42,82,152,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              Watch Videos
            </div>
          </div>

          {/* Results Card */}
          <div style={{
            background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            border: '1px solid rgba(42,82,152,0.1)',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden'
          }}
          onClick={() => router.push('/Results')}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)';
          }}>
            {/* Decorative Line */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, #2a5298, #4CAF50)',
              animation: 'shimmer 2s linear infinite'
            }} />
            
            <h3 style={{ 
              fontSize: '1.25rem', 
              color: '#2a5298', 
              margin: '0 0 0.75rem 0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span style={{
                width: '28px',
                height: '28px',
                background: 'rgba(42,82,152,0.1)',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.9rem',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.background = 'rgba(42,82,152,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.background = 'rgba(42,82,152,0.1)';
              }}>
                📊
              </span>
              Results
            </h3>
            <p style={{ 
              color: '#4a5568', 
              margin: '0 0 1.25rem 0',
              lineHeight: '1.5',
              fontSize: '0.9rem'
            }}>View your exam results and progress</p>
            <div style={{
              background: 'linear-gradient(135deg, #2a5298 0%, #1e3c72 100%)',
              color: 'white',
              padding: '0.75rem',
              borderRadius: '10px',
              textAlign: 'center',
              fontWeight: '500',
              fontSize: '0.9rem',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(42,82,152,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              Check Results
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes width-pulse {
          0% { width: 60px; }
          50% { width: 100px; }
          100% { width: 60px; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 0.5; }
        }
        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0); }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}
     
