'use client'

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Timer from '../../components/Timer';

export default function Page() {
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [examData, setExamData] = useState(null);
  const [tabChangeCount, setTabChangeCount] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  

  const handleSubmit = useCallback(async () => {
    try {
      if (!examData) {
        console.error('Exam data not loaded yet');
        return;
      }
      setIsLoading(true);

      const id = localStorage.getItem('selectedPaperId');
      const userId = localStorage.getItem('userId');

      if (!id || !userId) {
        throw new Error('Missing required student or exam information');
      }

      const startTime = parseInt(localStorage.getItem(`examStartTime_${id}`));

      const answeredQuestions = await Promise.all(
        questions.map(async (question) => {
          const userAnswer = answers[question._id] || null;

          if (question.type === 'descriptive') {
            const matchRes = await fetch('/api/match-answers', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ question: question.question, answer: userAnswer, marks: question.marks}),
            });
            const matchData = await matchRes.json();

            return {
              questionId: question._id,
              question: question.question,
              type: question.type, // <-- ADD THIS LINE
              studentAnswer: userAnswer,
              correctAnswer: question.answer,
              marks: question.marks,
              isCorrect: null,
              score: matchData.score,
              feedback: matchData.reason,
            };
          } else {
            return {
              questionId: question._id,
              question: question.question,
              type: question.type, 
              selectedOption: userAnswer,
              correctOption: question.answer,
              marks: question.marks,
              isCorrect: userAnswer === question.answer,
            };
          }
        })
      );

      const totalScore = answeredQuestions.reduce((sum, q) => {
        if (q.type === 'descriptive') {
          return sum + (q.score || 0);
        } else {
          return q.isCorrect ? sum + parseInt(q.marks) : sum;
        }
      }, 0);

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
        totalScore,
        status: 'submitted',
      };

      const res = await fetch('/api/submitExam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(solutionData),
        cache: 'no-store',
      });

      const responseData = await res.json();
      if (!res.ok) {
        throw new Error(responseData.error || 'Failed to submit exam');
      }

      localStorage.removeItem(`examStartTime_${id}`);
      router.push('/exam-complete');
    } catch (error) {
      console.error('Submit failed:', error);
      alert('Failed to submit exam. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [examData, questions, answers, router]);

  const handleDescriptiveAnswer = (questionId, text) => {
    setAnswers((prev) => ({ ...prev, [questionId]: text }));
  };

  useEffect(() => {
    async function fetchExamData() {
      try {
        const authRes = await fetch('/api/auth/verify', { credentials: 'include' });
        const authData = await authRes.json();

        if (!authRes.ok || !authData.authenticated) {
          router.replace('/login');
          return;
        }

        const id = localStorage.getItem('selectedPaperId');
        localStorage.setItem('userId', authData.userId);
        const res = await fetch(`/api/getPapersById/${id}`, { credentials: 'include' });
        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        setQuestions(data.questions);
        setExamData({
          timeLimit: data.timeLimit || 0,
          totalMarks: data.totalMarks,
          title: data.title,
          classStream: authData.stream || authData.class,
          subject: data.subject,
        });

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
        setTabChangeCount((prev) => {
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

   // --- Styling ---
   const questionCardStyle = {
    marginBottom: '2rem',
    padding: '2rem',
    border: '1px solid #e5e7eb',
    borderRadius: '16px',
    background: '#fff',
    boxShadow: '0 2px 8px rgba(42,82,152,0.07)',
    maxWidth: '700px',
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    transition: 'box-shadow 0.2s',
  };

  const questionTextStyle = {
    fontSize: '1.15rem',
    marginBottom: '1.2rem',
    color: '#1f2937',
    fontWeight: 600,
    lineHeight: 1.5,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  const marksBadgeStyle = {
    marginLeft: '0.5rem',
    fontSize: '0.95rem',
    color: '#fff',
    background: '#2a5298',
    borderRadius: '999px',
    padding: '0.25rem 0.9rem',
    fontWeight: 500,
    letterSpacing: '0.5px',
    boxShadow: '0 1px 4px rgba(42,82,152,0.07)'
  };

  const mcqOptionStyle = (selected) => ({
    display: 'flex',
    alignItems: 'center',
    marginBottom: '0.75rem',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    backgroundColor: selected ? '#e8f0fe' : '#f9fafb',
    border: selected ? '2px solid #2a5298' : '1px solid #e5e7eb',
    transition: 'all 0.2s',
    userSelect: 'none',
    fontWeight: selected ? 600 : 500,
    boxShadow: selected ? '0 2px 8px rgba(42,82,152,0.07)' : 'none'
  });

  const radioStyle = {
    marginRight: '1rem',
    cursor: 'pointer',
    width: '18px',
    height: '18px',
    accentColor: '#2a5298'
  };

  const textareaStyle = {
    width: '100%',
    minHeight: '120px',
    marginBottom: '1rem',
    borderRadius: '8px',
    border: '1.5px solid #e5e7eb',
    padding: '1rem',
    fontSize: '1.05rem',
    background: '#f9fafb',
    color: '#1f2937',
    fontWeight: 500,
    resize: 'vertical',
    boxShadow: '0 1px 4px rgba(42,82,152,0.07)'
  };

  // --- Main Render ---
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

  const calculateRemainingTime = () => {
    const id = localStorage.getItem('selectedPaperId') || '';
    const startTime = parseInt(localStorage.getItem(`examStartTime_${id}`)) || Date.now();
    const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
    const totalSeconds = examData.timeLimit * 60;
    return Math.max(0, totalSeconds - elapsedSeconds);
  };
  //A warning message component to show when the user tries to change tabs
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
      height: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '2rem 1rem 2rem 1rem',
      paddingTop: '5rem', // <-- Add this line
      boxSizing: 'border-box',
      overflowY: 'auto'
    }}>
      {showWarning && <WarningMessage />}

      <div style={{
        position: 'fixed',
        top: '2rem', // reduced from 8rem to 2rem
        right: '2rem',
        zIndex: 1000
      }}>
        <Timer initialTime={calculateRemainingTime()} onTimeUp={handleSubmit} />
      </div>

      <h1 style={{
        fontSize: '2.2rem',
        marginBottom: '2.5rem',
        color: '#2a5298',
        textAlign: 'center',
        fontWeight: 'bold',
        letterSpacing: '1px',
        textShadow: '0 2px 8px rgba(42,82,152,0.07)',
        marginTop: '1rem' // ensure some top margin
      }}>
        {examData?.title} Examination
      </h1>
      {questions.map((q, i) => (
        <div key={q._id} style={questionCardStyle}>
          <div style={questionTextStyle}>
            <span><strong>{i + 1}.</strong></span>
            <span>{q.question}</span>
            <span style={marksBadgeStyle}>{q.marks} marks</span>
          </div>
          <div style={{ marginLeft: 0 }}>
            {q.type === 'descriptive' ? (
              <textarea
                value={answers[q._id] || ''}
                onChange={(e) => handleDescriptiveAnswer(q._id, e.target.value)}
                placeholder="Type your answer here..."
                style={textareaStyle}
              />
            ) : (
              q.options.map((option, idx) => (
                <label
                  key={idx}
                  style={mcqOptionStyle(answers[q._id] === option)}
                  onClick={() => handleOptionSelect(q._id, option)}
                >
                  <input
                    type="radio"
                    name={`question-${q._id}`}
                    value={option}
                    checked={answers[q._id] === option}
                    onChange={() => {}}
                    style={radioStyle}
                  />
                  <span style={{ fontSize: '1.05rem' }}>{String.fromCharCode(65 + idx)}. {option}</span>
                </label>
              ))
            )}
          </div>
        </div>
      ))}
      <button
        onClick={handleSubmit}
        disabled={isLoading}
        style={{
          background: '#2a5298',
          color: 'white',
          padding: '1rem 2.5rem',
          borderRadius: '8px',
          border: 'none',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          fontSize: '1.15rem',
          fontWeight: 'bold',
          width: '100%',
          maxWidth: '700px',
          margin: '2rem auto 0 auto',
          boxShadow: '0 2px 8px rgba(42,82,152,0.07)',
          transition: 'background-color 0.2s'
        }}
      >
        {isLoading ? 'Submitting...' : 'Submit'}
      </button>
    </div>
  );
}
