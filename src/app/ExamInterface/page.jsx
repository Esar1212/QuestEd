'use client'
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Timer from "../../components/Timer";

export default function Page() {
    const router = useRouter();
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [examData, setExamData] = useState(null);
    const [tabChangeCount, setTabChangeCount] = useState(0);
    const [showWarning, setShowWarning] = useState(false);

    const handleSubmit = useCallback(async () => {
        try {
            if (!examData) {
                console.error('Exam data not loaded yet');
                return;
            }

            const id = localStorage.getItem("selectedPaperId");
            const userId = localStorage.getItem("userId");
            // Validate required fields
            if (!id || !userId) {
                throw new Error('Missing required student or exam information');
            }

            const startTime = parseInt(localStorage.getItem(`examStartTime_${id}`));
            
            // Prepare questions with selected answers
            const answeredQuestions = questions.map(question => ({
                questionId: question._id,
                question: question.question,
                selectedOption: answers[question._id] || null,
                correctOption: question.answer, // This is correct
                marks: question.marks,
                isCorrect: answers[question._id] ? answers[question._id] === question.answer : false // Changed correctOption to answer
            }));

            const solutionData = {
                studentId: userId,
                paperId: id,
                title: examData.title,
                subject: examData.subject || 'N/A',
                timeLimit: examData.timeLimit,
                totalMarks: examData.totalMarks,
                classStream: examData.classStream || 'N/A',
                questions: answeredQuestions,
                startedAt: new Date(startTime).toISOString(),
                completedAt: new Date().toISOString(),
                submittedAt: new Date().toISOString(),
                totalScore: answeredQuestions.reduce((sum, q) => 
                    q.isCorrect ? sum + parseInt(q.marks) : sum, 0
                ),
                status: 'submitted'
            };

            // Log the data being sent (for debugging)
            console.log('Submitting exam data:', solutionData);

            const res = await fetch('/api/submitExam', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(solutionData),
                cache: 'no-store'
            });

            const responseData = await res.json();
            console.log('Response:', responseData);

            if (!res.ok) {
                throw new Error(responseData.error || 'Failed to submit exam');
            }

            // Clear the exam timer from localStorage
            localStorage.removeItem(`examStartTime_${id}`);
            
            router.push('/exam-complete');
        } catch (error) {
            console.error('Submit failed:', error);
            alert('Failed to submit exam. Please try again.');
        }
    }, [examData, questions, answers, router]);

    useEffect(() => {
        async function fetchExamData() {
            try {
                const authRes = await fetch('/api/auth/verify', {
                    credentials: 'include'
                });
                const authData = await authRes.json();

                if (!authRes.ok || !authData.authenticated) {
                    router.replace('/login');
                    return;
                }
                const id = localStorage.getItem("selectedPaperId");
                localStorage.setItem("userId",authData.userId);
                const res = await fetch(`/api/getPapersById/${id}`, {
                    credentials: 'include'
                });
                const data = await res.json();
                console.log(data);
                if (!res.ok) throw new Error(data.message);
                
                setQuestions(data.questions);
                setExamData({
                    timeLimit: data.timeLimit || 0,  // Ensure timeLimit has a default value
                    totalMarks: data.totalMarks,
                    title: data.title,
                    classStream: authData.stream || authData.class,
                    subject: data.subject
                });

                // Set exam start time if not already set
                if (!localStorage.getItem(`examStartTime_${id}`)) {
                    localStorage.setItem(`examStartTime_${id}`, Date.now().toString());
                }
            } catch (error) {
                console.error('Failed to fetch exam:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchExamData();
    }, [router]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setTabChangeCount(prev => {
                    const newCount = prev + 1;
                    if (newCount === 1) {
                        setShowWarning(true);
                    } else if (newCount >= 2 && examData) {
                        handleSubmit();
                    }
                    return newCount;
                });
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [examData, handleSubmit]);

    
    const handleOptionSelect = (questionId, selectedOption) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: selectedOption
        }));
    };

    if (loading) {
        return (
            <div style={{
                paddingTop: '6rem',
                textAlign: 'center',
                color: '#2a5298',
                fontSize: '1.2rem'
            }}>
                Loading exam...
            </div>
        );
    }
     // In the Timer component usage, calculate remaining time
     const calculateRemainingTime = () => {

        const id = localStorage.getItem("selectedPaperId") || "";
         const startTime = parseInt(localStorage.getItem(`examStartTime_${id}`)) || Date.now();
         const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
         const totalSeconds = examData.timeLimit * 60;
         
         // Ensure we don't return negative time
         const remainingTime = Math.max(0, totalSeconds - elapsedSeconds);
         return remainingTime;
     };

   
    // Add warning message component
    // Update the warning message component with Acknowledge button
    const WarningMessage = () => (
        <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(255, 68, 68, 0.95)',
            color: 'white',
            padding: '2rem',
            borderRadius: '12px',
            zIndex: 2000,
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            textAlign: 'center',
            animation: 'fadeIn 0.3s ease-in-out',
            minWidth: '320px',
            backdropFilter: 'blur(5px)'
        }}>
            <h3 style={{ 
                marginBottom: '1rem',
                fontSize: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
            }}>
                <span>⚠️</span>
                <span>WARNING!</span>
            </h3>
            <p style={{
                marginBottom: '1.5rem',
                fontSize: '1.1rem',
                lineHeight: '1.5'
            }}>
                Changing tabs is not allowed during the exam.
            </p>
            <p style={{ 
                marginBottom: '1.5rem',
                fontSize: '1rem',
                color: '#ffcccc'
            }}>
                Next violation will result in automatic submission.
            </p>
            <button
                onClick={() => setShowWarning(false)}
                style={{
                    backgroundColor: 'white',
                    color: '#ff4444',
                    padding: '0.75rem 1.5rem',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.2s ease',
                    ':hover': {
                        backgroundColor: '#f8f8f8',
                        transform: 'translateY(-2px)'
                    }
                }}
            >
                I Acknowledge
            </button>
        </div>
    );

    

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f6f8fc 0%, #e9ecef 100%)',
            padding: '6rem 2rem 2rem 2rem',
            position: 'relative'
        }}>
            {showWarning && <WarningMessage />}
            
            <div style={{
                position: 'fixed',
                top: '4.5rem',
                right: '2rem',
                zIndex: 1000,
                background: 'rgba(255, 255, 255, 0.95)',
                padding: '0.4rem 0.75rem',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(42,82,152,0.1)',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
            }}>
                <span style={{ 
                    fontSize: '0.9rem',
                    opacity: 0.8,
                    color: '#2a5298'
                }}>⏱️</span>
                <div style={{
                    fontWeight: '500',
                    color: '#2a5298'
                }}>
                    <Timer 
                        initialTime={calculateRemainingTime()} 
                        onTimeUp={handleSubmit}
                    />
                </div>
            </div>

            <div style={{
                maxWidth: '900px',
                width: '100%',
                margin: '0 auto',
                background: 'white',
                padding: '2.5rem',
                borderRadius: '20px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                border: '1px solid rgba(42,82,152,0.1)'
            }}>
                <h1 style={{
                    fontSize: '2rem',
                    marginBottom: '2.5rem',
                    color: '#2a5298',
                    textAlign: 'center',
                    fontWeight: '700',
                    position: 'relative',
                    paddingBottom: '1rem'
                }}>
                    {examData?.title} Examination
                    <div style={{
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '80px',
                        height: '4px',
                        background: 'linear-gradient(90deg, #2a5298, #4CAF50)',
                        borderRadius: '2px'
                    }} />
                </h1>

                {questions.map((question, index) => (
                    <div key={question._id} style={{
                        marginBottom: '2.5rem',
                        padding: '1.5rem',
                        background: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '16px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                        transition: 'all 0.3s ease'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '1rem',
                            marginBottom: '1.5rem'
                        }}>
                            <div style={{
                                background: '#2a5298',
                                color: 'white',
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                flexShrink: 0
                            }}>
                                {index + 1}
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{
                                    fontSize: '1.1rem',
                                    color: '#1f2937',
                                    lineHeight: '1.5',
                                    fontWeight: '500'
                                }}>
                                    {question.question}
                                </p>
                                <span style={{
                                    display: 'inline-block',
                                    padding: '0.25rem 0.75rem',
                                    background: 'rgba(42,82,152,0.1)',
                                    color: '#2a5298',
                                    borderRadius: '999px',
                                    fontSize: '0.85rem',
                                    fontWeight: '500',
                                    marginTop: '0.75rem'
                                }}>
                                    {question.marks} marks
                                </span>
                            </div>
                        </div>

                        <div style={{ 
                            marginLeft: '3rem',
                            display: 'grid',
                            gap: '0.75rem'
                        }}>
                            {question.options.map((option, optIndex) => (
                                <label key={optIndex} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    background: answers[question._id] === option 
                                        ? 'rgba(42,82,152,0.08)'
                                        : 'white',
                                    border: '1px solid',
                                    borderColor: answers[question._id] === option 
                                        ? '#2a5298'
                                        : '#e5e7eb',
                                    transition: 'all 0.2s ease',
                                    userSelect: 'none',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                                onMouseEnter={(e) => {
                                    if (answers[question._id] !== option) {
                                        e.currentTarget.style.borderColor = '#2a5298';
                                        e.currentTarget.style.background = 'rgba(42,82,152,0.02)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (answers[question._id] !== option) {
                                        e.currentTarget.style.borderColor = '#e5e7eb';
                                        e.currentTarget.style.background = 'white';
                                    }
                                }}
                                onClick={() => handleOptionSelect(question._id, option)}
                                >
                                    <input
                                        type="radio"
                                        name={`question-${question._id}`}
                                        value={option}
                                        checked={answers[question._id] === option}
                                        onChange={() => {}}
                                        style={{ 
                                            marginRight: '1rem',
                                            width: '20px',
                                            height: '20px',
                                            cursor: 'pointer',
                                            accentColor: '#2a5298'
                                        }}
                                    />
                                    <span style={{
                                        fontSize: '1rem',
                                        color: answers[question._id] === option 
                                            ? '#2a5298'
                                            : '#4b5563',
                                        fontWeight: answers[question._id] === option 
                                            ? '500'
                                            : 'normal'
                                    }}>
                                        {option}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}

                <button
                    onClick={handleSubmit}
                    style={{
                        background: 'linear-gradient(135deg, #2a5298, #1e3c72)',
                        color: 'white',
                        padding: '1rem 2rem',
                        borderRadius: '12px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        width: '100%',
                        marginTop: '2rem',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 15px rgba(42,82,152,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.75rem'
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
                    <span style={{ fontSize: '1.2rem' }}>📝</span>
                    Submit Exam
                </button>
            </div>
        </div>
    );
}