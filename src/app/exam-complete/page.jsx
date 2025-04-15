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
                paddingTop: '8rem',
                textAlign: 'center',
                color: '#2a5298',
                fontSize: '1.2rem'
            }}>
                Loading your results...
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                paddingTop: '8rem',
                textAlign: 'center',
                color: '#dc2626',
                fontSize: '1.2rem'
            }}>
                Error: {error}
                <button
                    onClick={() => router.push('/dashboard')}
                    style={{
                        background: '#2a5298',
                        color: 'white',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '6px',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'block',
                        margin: '2rem auto',
                        fontSize: '1rem'
                    }}
                >
                    Return to Dashboard
                </button>
            </div>
        );
    }

    const calculatePercentage = () => {
        return ((stats.totalScore / stats.totalMarks) * 100).toFixed(1);
    };

    const calculateTimeTaken = () => {
        const startTime = new Date(stats.startedAt);
        const endTime = new Date(stats.completedAt);
        const timeDiff = Math.floor((endTime - startTime) / 1000); // in seconds
        const minutes = Math.floor(timeDiff / 60);
        const seconds = timeDiff % 60;
        return `${minutes}m ${seconds}s`;
    };

    return (
        <div style={{
            paddingTop: '8rem',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: '#f5f5f5',
            padding: '2rem'
        }}>
            <div style={{
                maxWidth: '800px',
                width: '100%',
                background: 'white',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
                <h1 style={{
                    fontSize: '2rem',
                    color: '#2a5298',
                    textAlign: 'center',
                    marginBottom: '2rem'
                }}>
                    Exam Completed!
                </h1>

                <div style={{
                    background: '#f8fafc',
                    padding: '2rem',
                    borderRadius: '8px',
                    marginBottom: '2rem'
                }}>
                    <h2 style={{ 
                        fontSize: '1.5rem',
                        color: '#1f2937',
                        marginBottom: '1rem'
                    }}>
                        {stats?.title}
                    </h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '1.5rem',
                        marginTop: '1.5rem'
                    }}>
                        <StatBox
                            label="Score"
                            value={`${stats?.totalScore}/${stats?.totalMarks}`}
                            highlight={true}
                        />
                        <StatBox
                            label="Percentage"
                            value={`${calculatePercentage()}%`}
                            highlight={true}
                        />
                        <StatBox
                            label="Time Taken"
                            value={calculateTimeTaken()}
                        />
                        <StatBox
                            label="Questions Attempted"
                            value={`${stats?.questions.filter(q => q.selectedOption).length}/${stats?.questions.length}`}
                        />
                    </div>
                </div>

                <div style={{ marginTop: '2rem' }}>
                    <h3 style={{
                        fontSize: '1.2rem',
                        color: '#1f2937',
                        marginBottom: '1rem'
                    }}>
                        Question-wise Analysis
                    </h3>
                    {stats?.questions.map((q, index) => (
                        <div key={index} style={{
                            padding: '1rem',
                            borderBottom: '1px solid #e5e7eb',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div style={{ flex: 1 }}>
                                <p style={{ 
                                    color: '#4b5563',
                                    marginBottom: '0.5rem'
                                }}>
                                    Question {index + 1}
                                </p>
                                <p style={{
                                    color: q.isCorrect ? '#059669' : '#dc2626',
                                    fontWeight: '500'
                                }}>
                                    {q.isCorrect ? 'Correct' : 'Incorrect'}
                                </p>
                            </div>
                            <div style={{
                                background: q.isCorrect ? '#d1fae5' : '#fee2e2',
                                padding: '0.5rem 1rem',
                                borderRadius: '4px',
                                fontSize: '0.9rem'
                            }}>
                                {q.marks} marks
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => router.push('/student-dashboard')}
                    style={{
                        background: '#2a5298',
                        color: 'white',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '6px',
                        border: 'none',
                        cursor: 'pointer',
                        width: '100%',
                        marginTop: '2rem',
                        fontSize: '1rem'
                    }}
                >
                    Return to Dashboard
                </button>
            </div>
        </div>
    );
}

function StatBox({ label, value, highlight }) {
    return (
        <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            textAlign: 'center'
        }}>
            <p style={{
                color: '#6b7280',
                fontSize: '0.9rem',
                marginBottom: '0.5rem'
            }}>
                {label}
            </p>
            <p style={{
                color: highlight ? '#2a5298' : '#1f2937',
                fontSize: highlight ? '1.5rem' : '1.25rem',
                fontWeight: 'bold'
            }}>
                {value}
            </p>
        </div>
    );
}
