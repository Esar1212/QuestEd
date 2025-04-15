'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const ExamPapers = () => {
  const [papers, setPapers] = useState([])
  const router = useRouter()

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const response = await fetch('/api/getPapersByClass')
        const data = await response.json()
        setPapers(data)
      } catch (error) {
        console.error('Error fetching papers:', error)
      }
    }

    fetchPapers()
  }, [])

  const handlePaperClick = (paperId) => {
    localStorage.setItem('selectedPaperId', paperId);
    router.push('/ExamInterface');
  }

  return (
    <div className="container-fluid" style={{
      paddingTop: '6rem',
      paddingLeft: '2rem',
      paddingRight: '2rem',
      paddingBottom: '2rem',
      maxWidth: '100%',
      marginTop: '0',
      marginRight: '0',
      marginBottom: '0',
      marginLeft: '0',
      minHeight: '100vh',
      background: '#1a1a1a'
    }}>
      <div style={{
        maxWidth: '1400px',
        marginLeft: 'auto',
        marginRight: 'auto'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          marginBottom: '2rem', // Reduced margin
          color: 'white',
          fontWeight: 'bold',
          textAlign: 'center',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          Available Exam Papers
        </h1>

        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '2rem',
          marginBottom: '3rem',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            color: '#ffffff',
            marginBottom: '1.5rem',
            textAlign: 'center',
            fontWeight: '600'
          }}>
            Exam Instructions
          </h2>
          <ul style={{
            color: '#ffffff',
            listStyle: 'none',
            padding: '0',
            margin: '0',
            display: 'grid',
            gap: '1rem'
          }}>
            <li style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontSize: '1.1rem'
            }}>
              <span style={{ color: '#4CAF50' }}>•</span>
              Once you start the exam, the timer cannot be paused.
            </li>
            <li style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontSize: '1.1rem'
            }}>
              <span style={{ color: '#4CAF50' }}>•</span>
              Do not refresh the browser during exam. The timer won't be reset but you would lose your progress.
            </li>
            <li style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontSize: '1.1rem'
            }}>
              <span style={{ color: '#4CAF50' }}>•</span>
              Do not close the browser during the exam. The exam will be auto-submitted in that case.
            </li>
            <li style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontSize: '1.1rem'
            }}>
              <span style={{ color: '#4CAF50' }}>•</span>
              Submit your answers before the timer runs out.
            </li>
            <li style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontSize: '1.1rem'
            }}>
              <span style={{ color: '#4CAF50' }}>•</span>
              <b>You are not permitted to change tabs. The exam will be auto-submitted in that case.</b> 
            </li>
            <li style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontSize: '1.1rem'
            }}>
              <span style={{ color: '#4CAF50' }}>•</span>
              You can review and change your answers before final submission.
            </li>
          </ul>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '2rem',
          padding: '1rem'
        }}>
          {papers.map((paper) => (
            <div 
              key={paper._id}
              onClick={() => handlePaperClick(paper._id)}
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                padding: '2rem',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
              }}
            >
              <h2 style={{
                fontSize: '1.8rem',
                marginBottom: '1.5rem',
                color: '#2a5298',
                fontWeight: '700',
                borderBottom: '2px solid #e5e7eb',
                paddingBottom: '0.75rem'
              }}>
                {paper.title}
              </h2>
              <p style={{
                color: '#4a5568',
                marginBottom: '1rem',
                fontSize: '1.1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{ fontWeight: '600' }}>Subject:</span> {paper.subject}
              </p>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '1.5rem',
                padding: '1rem',
                background: '#f8fafc',
                borderRadius: '8px'
              }}>
                <p style={{
                  color: '#4a5568',
                  fontSize: '1rem',
                  fontWeight: '500'
                }}>
                  Questions: {paper.questions.length}
                </p>
                <p style={{
                  color: '#4a5568',
                  fontSize: '1rem',
                  fontWeight: '500'
                }}>
                  Total Marks: {paper.totalMarks}
                </p>
                <br/>
                <p style={{
                  color: '#4a5568',
                  fontSize: '1rem',
                  fontWeight: '500'
                }}>
                  Time Limit: {paper.timeLimit} min
                </p>
                <br/>
                <div style={{
                  background: '#2a5298',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '999px',
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}>
                  Start Exam
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ExamPapers
