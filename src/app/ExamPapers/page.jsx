'use client'
import { useState, useEffect } from 'react'

const Results = () => {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch('/api/getCompletedPapers')
        const data = await response.json()
        if (Array.isArray(data)) {
          const formattedResults = data.map(result => ({
            _id: result._id,
            paperId: result.paperId,
            title: result.title,
            subject: result.subject,
            totalScore: result.totalScore,
            totalMarks: result.totalMarks,
            questions: result.questions,
            completedAt: result.completedAt
          }))
          setResults(formattedResults)
        } else {
          setResults([])
        }
        setLoading(false)
      } catch (error) {
        console.error('Error fetching results:', error)
        setResults([])
        setLoading(false)
      }
    }

    fetchResults()
  }, [])
console.log(results);
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-2xl">Loading results...</div>
      </div>
    )
  }

  return (
    <div style={{
      paddingTop: '6rem',
      minHeight: '100vh',
      background: '#1a1a1a',
      color: 'white'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          textAlign: 'center',
          marginBottom: '3rem',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          Your Exam Results
        </h1>

        <div style={{
          display: 'grid',
          gap: '2rem',
        }}>
          {results.map((result) => (
            <div
              key={result?._id || Math.random()}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '2rem',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                paddingBottom: '1rem'
              }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '600' }}>{result?.title || 'Untitled Exam'}</h2>
                <span style={{
                  background: '#4CAF50',
                  padding: '0.5rem 1rem',
                  borderRadius: '999px',
                  fontSize: '1.1rem'
                }}>
                  Score: {result?.totalScore || 0}/{result?.totalMarks || 0}
                </span>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.5rem',
                marginBottom: '1.5rem'
              }}>
                <div>
                  <p style={{ color: '#9CA3AF' }}>Subject</p>
                  <p style={{ fontSize: '1.1rem' }}>{result?.subject || 'N/A'}</p>
                </div>
                <div>
                  <p style={{ color: '#9CA3AF' }}>Completion Time</p>
                  <p style={{ fontSize: '1.1rem' }}>
                    {result?.completedAt ? 
                      `${new Date(result.completedAt).toLocaleDateString()} ${new Date(result.completedAt).toLocaleTimeString()}` 
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <p style={{ color: '#9CA3AF' }}>Percentage</p>
                  <p style={{ fontSize: '1.1rem' }}>
                  {((result?.totalScore / result?.totalMarks) * 100).toFixed(1)}%
                     </p>
                </div>
                {/* Add Grade Display */}
                <div>
                  <p style={{ color: '#9CA3AF' }}>Grade</p>
                  <p style={{ 
                    fontSize: '1.1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem' 
                  }}>
                    <span style={{ 
                      color: '#ffffff', // Changed from #9333ea to white
                      fontWeight: '600',
                      fontSize: '1.2rem'
                    }}>
                      {(() => {
                        const percentage = (result?.totalScore / result?.totalMarks) * 100;
                        if (percentage === 100) return 'O';
                        if (percentage >= 90) return 'E';
                        if (percentage >= 80) return 'A';
                        if (percentage >= 70) return 'B';
                        if (percentage >= 60) return 'C';
                        if (percentage >= 50) return 'D';
                        return 'F';
                      })()}
                    </span>
                    <span style={{ 
                      color: 'rgba(255, 255, 255, 0.7)', // Changed from #6b21a8 to semi-transparent white
                      fontSize: '0.9rem'
                    }}>
                      {(() => {
                        const percentage = (result?.totalScore / result?.totalMarks) * 100;
                        if (percentage === 100) return '(Outstanding)';
                        if (percentage >= 90) return '(Excellent)';
                        if (percentage >= 80) return '(Very Good)';
                        if (percentage >= 70) return '(Good)';
                        if (percentage >= 60) return '(Fair)';
                        if (percentage >= 50) return '(Satisfactory)';
                        return '(Failed)';
                      })()}
                    </span>
                  </p>
                </div>
              </div>

              <div style={{
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '8px',
                padding: '1.5rem',
                marginTop: '1.5rem'
              }}>
                <h3 style={{ 
                  marginBottom: '1.5rem', 
                  fontSize: '1.2rem',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                  paddingBottom: '0.5rem'
                }}>Question Analysis</h3>
                
                {result?.questions?.map((question, index) => (
                  <div key={question.questionId} style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    padding: '1.5rem',
                    marginBottom: '1rem'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '1rem'
                    }}>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: '500' }}>
                        Question {index + 1}
                      </h4>
                      {question.type === "descriptive" ? (
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '999px',
                          fontSize: '0.9rem',
                          background: '#6366f1',
                          color: 'white'
                        }}>
                          Descriptive
                        </span>
                      ) : (
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '999px',
                          fontSize: '0.9rem',
                          background: question.isCorrect ? '#4CAF50' : '#FF5252',
                          color: 'white'
                        }}>
                          {question.isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                      )}
                    </div>
                    
                    <p style={{ 
                      marginBottom: '1rem',
                      color: '#E0E0E0'
                    }}>{question.question}</p>
                    
                    {question.type === "descriptive" ? (
                      <div style={{
                        display: 'grid',
                        gap: '0.5rem',
                        marginTop: '1rem'
                      }}>
                        <div style={{ color: '#9CA3AF' }}>
                          <span style={{ fontWeight: '500' }}>Your Answer: </span>
                          <span style={{ color: '#60a5fa' }}>{question.studentAnswer || 'Not answered'}</span>
                        </div>
                        <div style={{ color: '#9CA3AF' }}>
                          <span style={{ fontWeight: '500' }}>Answer provided by your teacher: </span>
                          <span style={{ color: '#4CAF50' }}>{question.correctAnswer}</span>
                        </div>
                        <div style={{ color: '#9CA3AF' }}>
                          <span style={{ fontWeight: '500' }}>AI Feedback: </span>
                          <span style={{ color: '#fbbf24' }}>{question.feedback || 'No feedback'}</span>
                        </div>
                        <div style={{ color: '#9CA3AF' }}>
                          <span style={{ fontWeight: '500' }}>Marks: </span>
                          <span>{typeof question.score === 'number' ? question.score : 0}/{question.marks}</span>
                        </div>
                      </div>
                    ) : (
                      <div style={{
                        display: 'grid',
                        gap: '0.5rem',
                        marginTop: '1rem'
                      }}>
                        <div style={{ color: '#9CA3AF' }}>
                          <span style={{ fontWeight: '500' }}>Your Answer: </span>
                          <span style={{
                            color: question.isCorrect ? '#4CAF50' : '#FF5252'
                          }}>{question.selectedOption || 'Not answered'}</span>
                        </div>
                        <div style={{ color: '#9CA3AF' }}>
                          <span style={{ fontWeight: '500' }}>Correct Answer: </span>
                          <span style={{ color: '#4CAF50' }}>{question.correctOption}</span>
                        </div>
                        <div style={{ color: '#9CA3AF' }}>
                          <span style={{ fontWeight: '500' }}>Marks: </span>
                          <span>{question.isCorrect ? question.marks : 0}/{question.marks}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Results
