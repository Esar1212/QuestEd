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
            padding: '6rem 2rem 2rem 2rem'
        }}>
            <div style={{
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
                    padding: '2.5rem',
                    textAlign: 'center',
                    color: 'white',
                    position: 'relative'
                }}>
                    <h1 style={{
                        fontSize: '2.5rem',
                        fontWeight: '700',
                        marginBottom: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '1rem'
                    }}>
                        <span style={{ fontSize: '2.5rem' }}>🎉</span>
                        Exam Completed!
                    </h1>
                    <p style={{
                        fontSize: '1.2rem',
                        opacity: 0.9
                    }}>
                        {stats?.title}
                    </p>
                </div>

                {/* Stats Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '2rem',
                    padding: '2.5rem',
                    background: 'white'
                }}>
                    {/* Score Card */}
                    <div style={{
                        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                        padding: '2rem',
                        borderRadius: '16px',
                        textAlign: 'center',
                        border: '1px solid rgba(42,82,152,0.1)',
                        transition: 'transform 0.3s ease',
                        cursor: 'default'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}>
                        <h3 style={{
                            color: '#2a5298',
                            fontSize: '1.1rem',
                            marginBottom: '1rem',
                            fontWeight: '600'
                        }}>Score</h3>
                        <div style={{
                            fontSize: '2.5rem',
                            fontWeight: '700',
                            color: '#2a5298'
                        }}>
                            {stats?.totalScore}/{stats?.totalMarks}
                        </div>
                    </div>

                    {/* Percentage Card */}
                    <div style={{
                        background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                        padding: '2rem',
                        borderRadius: '16px',
                        textAlign: 'center',
                        border: '1px solid rgba(22,163,74,0.1)',
                        transition: 'transform 0.3s ease',
                        cursor: 'default'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}>
                        <h3 style={{
                            color: '#16a34a',
                            fontSize: '1.1rem',
                            marginBottom: '1rem',
                            fontWeight: '600'
                        }}>Percentage</h3>
                        <div style={{
                            fontSize: '2.5rem',
                            fontWeight: '700',
                            color: '#16a34a'
                        }}>
                            {((stats?.totalScore / stats?.totalMarks) * 100).toFixed(1)}%
                        </div>
                    </div>

                    {/* Time Taken Card */}
                    <div style={{
                        background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                        padding: '2rem',
                        borderRadius: '16px',
                        textAlign: 'center',
                        border: '1px solid rgba(220,38,38,0.1)',
                        transition: 'transform 0.3s ease',
                        cursor: 'default'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}>
                        <h3 style={{
                            color: '#dc2626',
                            fontSize: '1.1rem',
                            marginBottom: '1rem',
                            fontWeight: '600'
                        }}>Time Taken</h3>
                        <div style={{
                            fontSize: '2.5rem',
                            fontWeight: '700',
                            color: '#dc2626',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                        }}>
                            <span style={{ fontSize: '1.5rem' }}>⏱️</span>
                            {Math.floor((new Date(stats?.completedAt) - new Date(stats?.startedAt)) / 60000)}m {Math.floor(((new Date(stats?.completedAt) - new Date(stats?.startedAt)) % 60000) / 1000)}s
                        </div>
                    </div>

                    {/* Questions Attempted Card */}
                    <div style={{
                        background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
                        padding: '2rem',
                        borderRadius: '16px',
                        textAlign: 'center',
                        border: '1px solid rgba(109,40,217,0.1)',
                        transition: 'transform 0.3s ease',
                        cursor: 'default'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}>
                        <h3 style={{
                            color: '#6d28d9',
                            fontSize: '1.1rem',
                            marginBottom: '1rem',
                            fontWeight: '600'
                        }}>Questions Attempted</h3>
                        <div style={{
                            fontSize: '2.5rem',
                            fontWeight: '700',
                            color: '#6d28d9'
                        }}>
                            {stats?.questions.filter(q => q.selectedOption).length}/{stats?.questions.length}
                        </div>
                    </div>
                </div>

                {/* Question Analysis */}
                <div style={{
                    padding: '0 2.5rem 2.5rem 2.5rem'
                }}>
                    <h2 style={{
                        fontSize: '1.5rem',
                        color: '#1f2937',
                        marginBottom: '1.5rem',
                        fontWeight: '600'
                    }}>
                        Question-wise Analysis
                    </h2>
                    <div style={{
                        display: 'grid',
                        gap: '1rem'
                    }}>
                        {stats?.questions.map((q, index) => (
                            <div key={index} style={{
                                padding: '1.25rem',
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
                                <div style={{ flex: 1 }}>
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
                                    padding: '0.5rem 1rem',
                                    borderRadius: '999px',
                                    fontSize: '0.9rem',
                                    fontWeight: '500',
                                    marginLeft: '1.5rem',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {q.marks} marks
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Return to Dashboard Button */}
                <div style={{
                    padding: '0 2.5rem 2.5rem 2.5rem'
                }}>
                    <button
                        onClick={() => router.push('/student-dashboard')}
                        style={{
                            background: 'linear-gradient(135deg, #2a5298, #1e3c72)',
                            color: 'white',
                            padding: '1rem 2rem',
                            borderRadius: '12px',
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