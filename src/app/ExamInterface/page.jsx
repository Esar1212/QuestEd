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
            paddingTop: '10rem',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: '#f5f5f5',
            padding: '3rem 2rem 2rem 2rem'
        }}>
            {showWarning && <WarningMessage />}
            
            <div style={{
                position: 'fixed',
                top: '10rem', // Adjusted timer position
                right: '2rem',
                zIndex: 1000
            }}>
               
               <Timer 
                    initialTime={calculateRemainingTime()} 
                    onTimeUp={handleSubmit}
                />
            </div>

            <div style={{
                maxWidth: '800px',
                width: '100%',
                background: 'white',
                padding: '2rem',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                marginTop: '0' // Removed margin top since we increased padding
            }}>
                <h1 style={{
                    fontSize: '1.8rem',
                    marginBottom: '2rem',
                    color: '#2a5298',
                    textAlign: 'center',
                    padding: '0.5rem',
                    position: 'relative',
                    fontWeight: 'bolder' // Added position relative
                }}>
                    {examData?.title} Examination
                </h1>

                {questions.map((question, index) => (
                    <div key={question._id} style={{
                        marginBottom: '2rem',
                        padding: '1rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                    }}>
                        <p style={{
                            fontSize: '1.1rem',
                            marginBottom: '1rem',
                            color: '#1f2937'
                        }}>
                            <strong>{index + 1}. </strong>
                            {question.question}
                            <span style={{
                                marginLeft: '0.5rem',
                                fontSize: '0.9rem',
                                color: '#6b7280'
                            }}>
                                ({question.marks} marks)
                            </span>
                        </p>

                        <div style={{ marginLeft: '1.5rem' }}>
                            {question.options.map((option, optIndex) => (
                                <label key={optIndex} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginBottom: '0.75rem',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    backgroundColor: answers[question._id] === option ? '#e8f0fe' : 'white',
                                    border: '1px solid #e5e7eb',
                                    transition: 'all 0.2s ease',
                                    userSelect: 'none'
                                }}
                                onClick={() => handleOptionSelect(question._id, option)}
                                >
                                    <input
                                        type="radio"
                                        name={`question-${question._id}`}
                                        value={option}
                                        checked={answers[question._id] === option}
                                        onChange={() => {}} // Empty onChange to avoid React warning
                                        style={{ 
                                            marginRight: '1rem',
                                            cursor: 'pointer',
                                            width: '18px',
                                            height: '18px'
                                        }}
                                    />
                                    <span>{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}

                <button
                    onClick={handleSubmit}
                    style={{
                        background: '#2a5298',
                        color: 'white',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '6px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        width: '100%',
                        marginTop: '2rem',
                        transition: 'background-color 0.2s',
                        ':hover': {
                            backgroundColor: '#1e3c72'
                        }
                    }}
                >
                    Submit Exam
                </button>
            </div>
        </div>
    );
}