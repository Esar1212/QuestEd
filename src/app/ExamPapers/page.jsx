'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const ExamPapers = () => {
  const [papers, setPapers] = useState([])
  const [completedPapers, setCompletedPapers] = useState([])
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch papers
        const papersResponse = await fetch('/api/getPapersByClass')
        const papersData = await papersResponse.json()
        setPapers(papersData)

        // Fetch completed papers
        const solutionsResponse = await fetch('/api/getCompletedPapers')
        const solutionsData = await solutionsResponse.json()
        console.log(solutionsData);
        setCompletedPapers(solutionsData.map(solution => solution.paperId))
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
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
              onClick={() => !completedPapers.includes(paper._id) && handlePaperClick(paper._id)}
              style={{
                backgroundColor: 'white',
                borderRadius: '20px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                padding: '2rem',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: completedPapers.includes(paper._id) ? 'not-allowed' : 'pointer',
                border: '1px solid rgba(255,255,255,0.1)',
                background: completedPapers.includes(paper._id) 
                  ? 'linear-gradient(145deg, #f8f9fa, #e9ecef)'
                  : 'linear-gradient(145deg, #ffffff, #f8f9fa)',
                position: 'relative',
                overflow: 'hidden',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                if (!completedPapers.includes(paper._id)) {
                  e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
              }}
            >
              {/* Decorative gradient overlay */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: completedPapers.includes(paper._id)
                  ? 'linear-gradient(90deg, #6c757d, #adb5bd)'
                  : 'linear-gradient(90deg, #2a5298, #4CAF50)',
                opacity: 0.8
              }} />

              {/* Card content */}
              <div style={{
                position: 'relative',
                zIndex: 1
              }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: completedPapers.includes(paper._id) ? '#6c757d' : '#2a5298',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <span style={{
                    fontSize: '1.75rem',
                    opacity: 0.9
                  }}>
                    {completedPapers.includes(paper._id) ? '✓' : '📝'}
                  </span>
                  {paper.title}
                </h3>

                <div style={{
                  display: 'grid',
                  gap: '1rem',
                  marginBottom: '1.5rem'
                }}>
                  <p style={{
                    color: '#4a5568',
                    fontSize: '1rem',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span style={{ opacity: 0.7 }}>❓</span>
                    Questions: {paper.questions.length}
                  </p>
                  <p style={{
                    color: '#4a5568',
                    fontSize: '1rem',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span style={{ opacity: 0.7 }}>🎯</span>
                    Total Marks: {paper.totalMarks}
                  </p>
                  <p style={{
                    color: '#4a5568',
                    fontSize: '1rem',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span style={{ opacity: 0.7 }}>⏱️</span>
                    Time Limit: {paper.timeLimit} min
                  </p>
                </div>

                <div style={{
                  background: completedPapers.includes(paper._id)
                    ? 'linear-gradient(145deg, #6c757d, #adb5bd)'
                    : 'linear-gradient(145deg, #2a5298, #4CAF50)',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '999px',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}>
                  {completedPapers.includes(paper._id) ? (
                    <>
                      <span style={{ opacity: 0.9 }}>✓</span>
                      Already Completed
                    </>
                  ) : (
                    <>
                      <span style={{ opacity: 0.9 }}>🚀</span>
                      Start Exam
                    </>
                  )}
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
