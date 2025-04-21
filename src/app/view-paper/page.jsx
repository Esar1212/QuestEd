'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ViewPapersPage() {
  const router = useRouter();
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPapers() {
      try {
        // First verify authentication
        const authRes = await fetch('/api/auth/verify', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        const authData = await authRes.json();
        
        if (!authRes.ok || !authData.authenticated) {
          console.error('Auth failed:', authData);
          router.replace('/login'); // Use replace instead of push
          return;
        }

        // Then fetch papers
        const res = await fetch('/api/getQuestionPapers', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to fetch papers');
        }

        const data = await res.json();
        setPapers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch:', err);
        setError(err.message);
        if (err.message.includes('token') || err.message.includes('unauthorized')) {
          router.replace('/login');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchPapers();
  }, [router]);

  // Add error state display
  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#1a1a1a',
        color: '#dc2626'
      }}>
        <p style={{ fontSize: '1.2rem' }}>Error: {error}</p>
      </div>
    );
  }

  if (loading) return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: '#1a1a1a',
      color: 'white'
    }}>
      <p style={{ fontSize: '1.2rem' }}>Loading question papers...</p>
    </div>
  );

  return (
    <div style={{
      padding: '6rem 2rem 2rem 2rem',
      width: '100%',
      margin: '0',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 100%)',
      overflowX: 'hidden'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        width: '100%'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          width: '100%'
        }}>
          <button
            onClick={() => router.push('/teacher-dashboard')}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              cursor: 'pointer',
              fontSize: '1rem',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)'
            }}
          >
            ← Back to Dashboard
          </button>
        </div>

        <h1 style={{
          fontSize: '2.5rem',
          color: 'white',
          marginBottom: '2rem',
          textAlign: 'center',
          fontWeight: 'bold'
        }}>Question Papers</h1>

        {papers.length === 0 ? (
          <p style={{
            textAlign: 'center',
            color: 'white',
            fontSize: '1.2rem'
          }}>No question papers found.</p>
        ) : (
          <div style={{
            display: 'grid',
            gap: '2rem',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
          }}>
            {papers.map((paper) => (
              <div key={paper._id} style={{
                background: 'white',
                borderRadius: '16px',
                padding: '2rem',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: 'pointer',
                ':hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 12px rgba(0, 0, 0, 0.2)'
                }
              }}>
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#2a5298',
                  marginBottom: '1rem'
                }}>{paper.title}</h2>
                
                <div style={{
                  padding: '1rem',
                  background: '#f8fafc',
                  borderRadius: '8px',
                  marginBottom: '1rem'
                }}>
                  <p style={{ marginBottom: '0.5rem', color: '#4a5568' }}>
                    <strong>Subject:</strong> {paper.subject}
                  </p>
                  <p style={{ marginBottom: '0.5rem', color: '#4a5568' }}>
                    <strong>{/^[0-9]+$/.test(paper.classStream) ? 'Class' : 'Stream'}:</strong> {paper.classStream}
                  </p>
                  <p style={{ marginBottom: '0.5rem', color: '#4a5568' }}>
                    <strong>Time Limit:</strong> {paper.timeLimit} minutes
                  </p>
                  <p style={{ color: '#4a5568' }}>
                    <strong>Total Marks:</strong> {paper.totalMarks}
                  </p>
                </div>

                <div style={{
                  background: '#fff',
                  borderRadius: '8px',
                  padding: '1rem'
                }}>
                  <h3 style={{
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    marginBottom: '1rem',
                    color: '#2a5298'
                  }}>Questions</h3>
                  
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {paper.questions.map((q, i) => (
                      <li key={i} style={{
                        padding: '0.75rem',
                        marginBottom: '0.75rem',
                        borderBottom: '1px solid #e5e7eb',
                        fontSize: '1rem',
                        color: '#4a5568'
                      }}>
                        <strong>Q{i + 1}:</strong> {q.question}
                        <span style={{
                          display: 'inline-block',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '999px',
                          backgroundColor: '#e2e8f0',
                          fontSize: '0.875rem',
                          marginLeft: '0.5rem'
                        }}>
                          {q.marks} marks
                        </span>
                        
                        {/* Options list */}
                        <div style={{ 
                          marginTop: '0.5rem',
                          paddingLeft: '1.5rem'
                        }}>
                          {q.options && q.options.map((option, optIndex) => (
                            <div key={optIndex} style={{
                              marginBottom: '0.25rem',
                              color: '#4a5568',
                              fontSize: '0.95rem',
                              display: 'flex',
                              alignItems: 'center',
                              backgroundColor: q.correctAnswer === option ? '#f0fdf4' : 'transparent',
                              padding: '0.25rem 0.5rem',
                              borderRadius: '4px'
                            }}>
                              <span>{String.fromCharCode(65 + optIndex)}. {option}</span>
                              {q.answer === option && (
                                <span style={{
                                  marginLeft: '0.5rem',
                                  color: '#059669',
                                  fontSize: '0.875rem',
                                  fontWeight: '500'
                                }}>
                                  ✓ Correct Answer
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}