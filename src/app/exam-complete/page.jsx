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
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', // Reduced minmax value
                    gap: 'clamp(0.75rem, 2vw, 2rem)', // Adjusted gap
                    padding: 'clamp(1rem, 3vw, 2.5rem)', // Adjusted padding
                    background: 'white'
                }}>
                    {/* Score Card */}
                    <div style={{
                        background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                        padding: 'clamp(1rem, 2vw, 1.5rem)', // Responsive padding
                        borderRadius: '12px',
                        textAlign: 'center',
                        border: '1px solid rgba(22,163,74,0.1)'
                    }}>
                        <h3 style={{
                            fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)', // Responsive font size
                            color: '#166534',
                            marginBottom: '0.5rem'
                        }}>Your Score</h3>
                        <div style={{
                            fontSize: 'clamp(1.5rem, 4vw, 2rem)', // Responsive font size
                            fontWeight: '700',
                            color: '#16a34a'
                        }}>
                            {stats?.totalScore} / {stats?.totalMarks}
                        </div>
                    </div>

                    {/* Percentage Card */}
                    <div style={{
                        background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                        padding: 'clamp(1rem, 2vw, 1.5rem)', // Responsive padding
                        borderRadius: '12px',
                        textAlign: 'center',
                        border: '1px solid rgba(37,99,235,0.1)'
                    }}>
                        <h3 style={{
                            fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)', // Responsive font size
                            color: '#1e40af',
                            marginBottom: '0.5rem'
                        }}>Percentage</h3>
                        <div style={{
                            fontSize: 'clamp(1.5rem, 4vw, 2rem)', // Responsive font size
                            fontWeight: '700',
                            color: '#2563eb'
                        }}>
                            {((stats?.totalScore / stats?.totalMarks) * 100).toFixed(1)}%
                        </div>
                    </div>

                    {/* Time Taken Card */}
                    <div style={{
                        background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
                        padding: 'clamp(1rem, 2vw, 1.5rem)',
                        borderRadius: '12px',
                        textAlign: 'center',
                        border: '1px solid rgba(234,88,12,0.1)'
                    }}>
                        <h3 style={{
                            fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                            color: '#9a3412',
                            marginBottom: '0.5rem'
                        }}>Time Taken</h3>
                        <div style={{
                            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                            fontWeight: '700',
                            color: '#ea580c'
                        }}>
                            {(() => {
                                if (stats?.startedAt && stats?.completedAt) {
                                    const start = new Date(stats.startedAt);
                                    const end = new Date(stats.completedAt);
                                    const diffInSeconds = Math.round((end - start) / 1000);
                                    const minutes = Math.floor(diffInSeconds / 60);
                                    const seconds = diffInSeconds % 60;
                                    
                                    if (minutes === 0) {
                                        return `${seconds}s`;
                                    }
                                    return `${minutes}m ${seconds}s`;
                                }
                                return stats?.timeTaken ? `${stats.timeTaken}m` : '--';
                            })()}
                        </div>
                    </div>

                    {/* Grade Card */}
                    <div style={{
                        background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
                        padding: 'clamp(1rem, 2vw, 1.5rem)',
                        borderRadius: '12px',
                        textAlign: 'center',
                        border: '1px solid rgba(147,51,234,0.1)'
                    }}>
                        <h3 style={{
                            fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                            color: '#6b21a8',
                            marginBottom: '0.5rem'
                        }}>Grade</h3>
                        <div style={{
                            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                            fontWeight: '700',
                            color: '#9333ea'
                        }}>
                            {(() => {
                                const percentage = (stats?.totalScore / stats?.totalMarks) * 100;
                                if (percentage === 100) return 'O';
                                if (percentage >= 90) return 'E';
                                if (percentage >= 80) return 'A';
                                if (percentage >= 70) return 'B';
                                if (percentage >= 60) return 'C';
                                if (percentage >= 50) return 'D';
                                return 'F';
                            })()}
                        </div>
                        <small style={{
                            fontSize: 'clamp(0.75rem, 2vw, 0.85rem)',
                            color: '#6b21a8',
                            opacity: 0.9
                        }}>
                            {(() => {
                                const percentage = (stats?.totalScore / stats?.totalMarks) * 100;
                                if (percentage === 100) return '(Outstanding)';
                                if (percentage >= 90) return '(Excellent)';
                                if (percentage >= 80) return '(Very Good)';
                                if (percentage >= 70) return '(Good)';
                                if (percentage >= 60) return '(Fair)';
                                if (percentage >= 50) return '(Satisfactory)';
                                return '(Failed)';
                            })()}
                        </small>
                    </div>
                </div>
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
                                background: q.type === "descriptive"
                                  ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)'
                                  : (q.isCorrect 
                                    ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)'
                                    : 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)'),
                                border: '1px solid',
                                borderColor: q.type === "descriptive"
                                  ? 'rgba(22,163,74,0.1)'
                                  : (q.isCorrect ? 'rgba(22,163,74,0.1)' : 'rgba(220,38,38,0.1)'),
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
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        marginBottom: '0.5rem'
                                    }}>
                                        <span style={{
                                            fontSize: '0.9rem',
                                            fontWeight: '600',
                                            color: q.type === "descriptive"
                                              ? '#166534'
                                              : (q.isCorrect ? '#16a34a' : '#dc2626')
                                        }}>
                                            Question {index + 1}
                                        </span>
                                        {q.type !== "descriptive" && (
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
                                        )}
                                    </div>
                                    <p style={{
                                        fontSize: '0.95rem',
                                        color: '#4b5563',
                                        marginBottom: '0.5rem'
                                    }}>
                                        {q.question}
                                    </p>
                                    {q.type === "descriptive" ? (
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.95rem' }}>
                                        <span>
                                          <strong>Your Answer:</strong> <span style={{ color: '#2563eb', fontWeight: 500 }}>{q.studentAnswer || 'Not attempted'}</span>
                                        </span>
                                        <span>
                                          <strong>AI Feedback:</strong> <span style={{ color: '#9333ea', fontWeight: 500 }}>{q.feedback || 'No feedback'}</span>
                                        </span>
                                        <span>
                                          <strong>Answer provided by your teacher:</strong> <span style={{ color: '#16a34a', fontWeight: 500 }}>{q.correctAnswer}</span>
                                        </span>
                                        <span>
                                          <strong>Marks:</strong> <span style={{ color: '#ea580c', fontWeight: 500 }}>{q.score} / {q.marks}</span>
                                        </span>
                                      </div>
                                    ) : (
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
                                    )}
                                </div>
                                <div style={{
                                  background: q.type === "descriptive"
                                    ? '#16a34a'
                                    : (q.isCorrect ? '#16a34a' : '#dc2626'),
                                  color: 'white',
                                  padding: '0.5rem clamp(0.75rem, 2vw, 1rem)',
                                  borderRadius: '999px',
                                  fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)',
                                  fontWeight: '500',
                                  marginTop: '1rem',
                                  '@media (minWidth: 640px)': {
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
        
    );
}
