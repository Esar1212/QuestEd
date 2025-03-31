'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorDisplay from '@/components/ErrorDisplay';
import { FiLogOut } from 'react-icons/fi';

export default function TeacherDashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authRes = await fetch('/api/auth/verify', {
          credentials: 'include'
        });

        const authData = await authRes.json();

        if (!authRes.ok || !authData.authenticated) {
          throw new Error(authData.error || 'Not authenticated');
        }

        if (authData.userType !== 'teacher') {
          throw new Error('Access denied: Teacher account required');
        }

        setUserData({
          fullName: authData.fullName,
          subject: authData.subject,
          qualification: authData.qualification
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
    <div style={{ 
      padding: '6rem 2rem 2rem 2rem', 
      maxWidth: '100%', 
      margin: '0',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 100%)',
    }}>
      {/* Header Card */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        marginBottom: '2rem',
        padding: '3rem',
        maxWidth: '1400px',
        marginLeft: 'auto',
        marginRight: 'auto',
        transform: 'translateY(0)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        ':hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)'
        }
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'white' }}>
              Welcome, {userData?.fullName}
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: '0.5rem' }}>Subject: {userData?.subject}</p>
            <p style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Qualification: {userData?.qualification}</p>
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
              background: '#dc3545',
              color: 'white',
              padding: '0.8rem 1.5rem',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
              transition: 'background 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              ':hover': { background: '#c82333' }
            }}
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </div>

      {/* Quick Actions and Statistics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2.5rem',
        marginBottom: '2.5rem',
        maxWidth: '1400px',
        marginLeft: 'auto',
        marginRight: 'auto'
      }}>
        {/* Quick Actions Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
          padding: '2.5rem',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          ':hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)'
          }
        }}>
          <h3 style={{ fontSize: '1.5rem', color: '#2a5298', marginBottom: '1.5rem' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Link href="/create-question-paper" style={{ textDecoration: 'none' }}>
              <button style={{
                background: 'linear-gradient(135deg, #2a5298 0%, #1e3c72 100%)',
                color: 'white',
                padding: '1.2rem',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.1rem',
                fontWeight: '600',
                width: '100%',
                boxShadow: '0 4px 6px rgba(42, 82, 152, 0.2)',
                transition: 'all 0.3s ease',
                transform: 'translateY(0)',
                ':hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 8px rgba(42, 82, 152, 0.3)'
                }
              }}>
                Create Question Paper
              </button>
            </Link>
            <button style={{
              background: 'transparent',
              border: '2px solid #2a5298',
              color: '#2a5298',
              padding: '0.8rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              transition: 'all 0.3s ease',
              ':hover': {
                background: '#2a5298',
                color: 'white'
              }
            }}>
              View All Question Papers
            </button>
          </div>
        </div>

        {/* Statistics Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
          padding: '2.5rem',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          ':hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)'
          }
        }}>
          <h3 style={{ fontSize: '1.5rem', color: '#2a5298', marginBottom: '1.5rem' }}>Statistics</h3>
          <div style={{ textAlign: 'center' }}>
            {[
              { label: 'Total Students', value: '3' },
              { label: 'Active Exams', value: '2' },
              { label: 'Average Score', value: '88%' }
            ].map((stat, index) => (
              <div key={index} style={{ marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '1.8rem', color: '#2a5298', marginBottom: '0.5rem' }}>
                  {stat.value}
                </h4>
                <p style={{ color: '#666' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Results Table */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
        padding: '2.5rem',
        maxWidth: '1400px',
        marginLeft: 'auto',
        marginRight: 'auto',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        ':hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)'
        }
      }}>
        <h3 style={{ fontSize: '1.5rem', color: '#2a5298', marginBottom: '1.5rem' }}>Recent Results</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #eee' }}>
                <th style={{ textAlign: 'left', padding: '1rem', color: '#666' }}>Student Name</th>
                <th style={{ textAlign: 'left', padding: '1rem', color: '#666' }}>Exam</th>
                <th style={{ textAlign: 'left', padding: '1rem', color: '#666' }}>Score</th>
                <th style={{ textAlign: 'left', padding: '1rem', color: '#666' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '1rem' }}>{result.studentName}</td>
                  <td style={{ padding: '1rem' }}>{result.examName}</td>
                  <td style={{ padding: '1rem' }}>{result.score}%</td>
                  <td style={{ padding: '1rem' }}>
                    <button style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#2a5298',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      padding: '0.5rem',
                      ':hover': { textDecoration: 'underline' }
                    }}>
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
