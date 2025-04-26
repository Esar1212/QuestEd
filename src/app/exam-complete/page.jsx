'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ExamComplete() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchExamStats() {
            try {
                const paperId = localStorage.getItem("selectedPaperId");
                if (!paperId) {
                    throw new Error('No exam selected');
                }

                const userId = localStorage.getItem("userId");
                const res = await fetch(`/api/getExamStats/${paperId}`, {
                    credentials: 'include',
                    headers: {
                        'userId': userId || ''
                    }
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.error || 'Failed to fetch exam stats');
                }

                const data = await res.json();
                setStats(data);
            } catch (error) {
                console.error('Failed to fetch exam stats:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchExamStats();
    }, []);

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #f6f8fc 0%, #e9ecef 100%)',
                color: '#2a5298',
                fontSize: '1.2rem',
                fontWeight: '500'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    background: 'white',
                    padding: '1rem 2rem',
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    animation: 'pulse 2s infinite'
                }}>
                    <span style={{ fontSize: '1.5rem' }}>📊</span>
                    Loading your results...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #f6f8fc 0%, #e9ecef 100%)',
                padding: '2rem'
            }}>
                <div style={{
                    background: 'white',
                    padding: '2rem',
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    textAlign: 'center',
                    maxWidth: '400px'
                }}>
                    <span style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }}>⚠️</span>
                    <h2 style={{ color: '#ef4444', marginBottom: '1rem' }}>Error Loading Results</h2>
                    <p style={{ color: '#4b5563', marginBottom: '1.5rem' }}>{error}</p>
                    <button
                        onClick={() => router.push('/student-dashboard')}
                        style={{
                            background: '#2a5298',
                            color: 'white',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '8px',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: '500'
                        }}
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f6f8fc 0%, #e9ecef 100%)',
            padding: '4rem 1rem 1rem', // Adjusted padding for mobile
            boxSizing: 'border-box'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '900px',
                margin: '0 auto',
                background: 'white',
                borderRadius: '20px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                overflow: 'hidden'
            }}>
                {/* Header Section */}
                <div style={{
                    background: 'linear-gradient(135deg, #2a5298, #1e3c72)',
                    padding: 'clamp(1.5rem, 4vw, 2.5rem)',
                    textAlign: 'center',
                    color: 'white',
                }}>
                    <h1 style={{
                        fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
                        fontWeight: '700',
                        marginBottom: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        flexWrap: 'wrap'
                    }}>
                        <span>🎉</span>
                        Exam Completed!
                    </h1>
                    <p style={{
                        fontSize: 'clamp(1rem, 3vw, 1.2rem)',
                        opacity: 0.9
                    }}>
                        {stats?.title}
                    </p>
                </div>

                {/* Stats Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: 'clamp(1rem, 3vw, 2rem)',
                    padding: 'clamp(1.5rem, 4vw, 2.5rem)',
                    background: 'white'
                }}>
                    {/* ... Stats cards remain the same ... */}
                </div>

                {/* Question Analysis */}
                <div style={{
                    padding: '0 clamp(1rem, 4vw, 2.5rem) clamp(1.5rem, 4vw, 2.5rem)'
                }}>
                    <h2 style={{
                        fontSize: 'clamp(1.2rem, 4vw, 1.5rem)',
                        color: '#1f2937',
                        marginBottom: 'clamp(1rem, 3vw, 1.5rem)',
                        fontWeight: '600'
                    }}>
                        Question-wise Analysis
                    </h2>
                    <div style={{
                        display: 'grid',
                        gap: 'clamp(0.75rem, 2vw, 1rem)'
                    }}>
                        {stats?.questions.map((q, index) => (
                            <div key={index} style={{
                                padding: 'clamp(1rem, 3vw, 1.25rem)',
                                borderRadius: '12px',
                                background: q.isCorrect 
                                    ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)'
                                    : 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                                border: '1px solid',
                                borderColor: q.isCorrect ? 'rgba(22,163,74,0.1)' : 'rgba(220,38,38,0.1)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                transition: 'transform 0.2s ease',
                                cursor: 'default'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateX(5px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateX(0)';
                            }}>
                                <div style={{ 
                                    flex: 1,
                                    minWidth: 0 // Prevent text overflow
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        marginBottom: '0.5rem'
                                    }}>
                                        <span style={{
                                            fontSize: '0.9rem',
                                            fontWeight: '600',
                                            color: q.isCorrect ? '#16a34a' : '#dc2626'
                                        }}>
                                            Question {index + 1}
                                        </span>
                                        <span style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.25rem',
                                            fontSize: '0.9rem',
                                            color: q.isCorrect ? '#16a34a' : '#dc2626',
                                            fontWeight: '500'
                                        }}>
                                            {q.isCorrect ? '✓ Correct' : '✕ Incorrect'}
                                        </span>
                                    </div>
                                    <p style={{
                                        fontSize: '0.95rem',
                                        color: '#4b5563',
                                        marginBottom: '0.5rem'
                                    }}>
                                        {q.question}
                                    </p>
                                    <div style={{
                                        display: 'flex',
                                        gap: '1rem',
                                        fontSize: '0.9rem'
                                    }}>
                                        <span style={{
                                            color: '#4b5563'
                                        }}>
                                            Your Answer: <span style={{
                                                color: q.isCorrect ? '#16a34a' : '#dc2626',
                                                fontWeight: '500'
                                            }}>{q.selectedOption || 'Not attempted'}</span>
                                        </span>
                                        {!q.isCorrect && (
                                            <span style={{
                                                color: '#4b5563'
                                            }}>
                                                Correct Answer: <span style={{
                                                    color: '#16a34a',
                                                    fontWeight: '500'
                                                }}>{q.correctOption}</span>
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div style={{
                                    background: q.isCorrect ? '#16a34a' : '#dc2626',
                                    color: 'white',
                                    padding: '0.5rem clamp(0.75rem, 2vw, 1rem)',
                                    borderRadius: '999px',
                                    fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)',
                                    fontWeight: '500',
                                    marginTop: '1rem',
                                    '@media (min-width: 640px)': {
                                        marginTop: 0,
                                        marginLeft: '1.5rem'
                                    }
                                }}>
                                    {q.marks} marks
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Return to Dashboard Button */}
                <div style={{
                    padding: '0 clamp(1rem, 4vw, 2.5rem) clamp(1.5rem, 4vw, 2.5rem)'
                }}>
                    <button
                        onClick={() => router.push('/student-dashboard')}
                        style={{
                            padding: 'clamp(0.75rem, 2vw, 1rem) clamp(1rem, 3vw, 2rem)',
                            fontSize: 'clamp(1rem, 3vw, 1.1rem)',
                            border: 'none',
                            cursor: 'pointer',
                            width: '100%',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.75rem',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 15px rgba(42,82,152,0.2)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(42,82,152,0.25)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(42,82,152,0.2)';
                        }}
                    >
                        <span style={{ fontSize: '1.2rem' }}>🏠</span>
                        Return to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}
