'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorDisplay from '@/components/ErrorDisplay';
import { FiLogOut } from 'react-icons/fi';
import VideoUploadModal from '@/components/VideoUploadModal';

export default function TeacherDashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [results, setResults] = useState([]);
   const [showVideoModal,setShowVideoModal]=useState(false); 
   const [videoTitle,setVideoTitle]=useState('');
   const [videoLink,setVideoLink]=useState(''); // Add new state for video modal

   
  
 // Add handleVideoUpload function
 const handleVideoUpload = async () => {
  try {
      const res = await fetch('/api/uploadVideo', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              title: videoTitle,
              link: videoLink,
              subject: userData?.subject,
              teacherId: userData?.fullName
          })
      });

      if (!res.ok) throw new Error('Failed to upload video');

      setVideoTitle('');
      setVideoLink('');
      setShowVideoModal(false);
      alert("Your video is uploaded!");
      // You might want to add a success message here
  } catch (error) {
      console.error('Error uploading video:', error);
      // Add error handling UI here
  }
};

  // Add new state variables at the top with other state declarations
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalPapers: 0,
    averageScore: '0%'
  });
  
  // In useEffect, after fetching papers data
  useEffect(() => {
      const fetchData = async () => {
        try {
          const authRes = await fetch('/api/auth/verify', {
            credentials: 'include'
          });
  
          const authData = await authRes.json();
  
          if (!authRes.ok || !authData.authenticated) {
            throw new Error(authData.error || 'Not authenticated');
          }
  
          if (authData.userType !== 'teacher') {
            throw new Error('Access denied: Teacher account required');
          }
  
          setUserData({
            fullName: authData.fullName,
            subject: authData.subject,
            qualification: authData.qualification
          });
  
          // Fetch subject-specific papers with student details
          const papersRes = await fetch('/api/getPapersBySubject', {
            credentials: 'include'
          });
          const papersData = await papersRes.json();
          
          // Get unique student IDs and calculate average score
          const uniqueStudents = new Set(papersData.map(paper => paper.studentId));
          const totalScore = papersData.reduce((acc, paper) => acc + (paper.totalScore || 0), 0);
          const averageScore = papersData.length ? 
            Math.round((totalScore / papersData.length)) + '%' : 
            '0%';
  
          // Update statistics
          setStats({
            totalStudents: uniqueStudents.size,
            totalPapers: papersData.length,
            averageScore: averageScore
          });
  
          // Fetch student details for each paper
          // In useEffect, update the resultsWithStudents mapping
          const resultsWithStudents = await Promise.all(
            papersData.map(async (paper) => {
              const studentRes = await fetch(`/api/users/${paper.studentId}`);
              const studentData = await studentRes.json();
              return {
                ...paper,
                studentName: studentData.fullName || 'Unknown',
                studentType: studentData.studentType,
                rollNumber: studentData.rollNumber,
                stream: studentData.stream,
                class: studentData.class
              };
            })
          );
          
          setResults(resultsWithStudents);
          setLoading(false);
        } catch (err) {
          console.error('Dashboard error:', err);
          setError(err.message);
          router.push('/login');
        }
      };
  
      fetchData();
    }, [router]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <LoadingSpinner />
      </div>
    );
  }
  
  if (error) {
    return (
      <div style={{
        marginTop: '2rem',
        marginBottom: '2rem',
        marginLeft: 'auto',
        marginRight: 'auto',
        textAlign: 'center'
      }}>
        <ErrorDisplay message={error} />
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '6rem 2rem 2rem 2rem', 
      maxWidth: '100%', 
      margin: '0',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 100%)',
    }}>
      {/* Header Card */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        marginBottom: '2rem',
        padding: '3rem',
        maxWidth: '1400px',
        marginLeft: 'auto',
        marginRight: 'auto',
        transform: 'translateY(0)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        ':hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)'
        }
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'white',fontWeight:'bolder' }}>
             <b>Welcome, Teacher {userData?.fullName}</b>
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: '0.5rem' }}>Subject: {userData?.subject}</p>
            <p style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Qualification: {userData?.qualification}</p>
          </div>
          <button 
            onClick={async () => {
              try {
                await fetch('/api/auth/logout', {
                  method: 'POST',
                  credentials: 'include'
                });
                router.push('/login');
              } catch (error) {
                console.error('Logout error:', error);
              }
            }}
            style={{
              background: '#dc3545',
              color: 'white',
              padding: '0.8rem 1.5rem',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
              transition: 'background 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              ':hover': { background: '#c82333' }
            }}
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </div>

      {/* Quick Actions and Statistics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2.5rem',
        marginBottom: '2.5rem',
        maxWidth: '1400px',
        marginLeft: 'auto',
        marginRight: 'auto'
      }}>
        {/* Quick Actions Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
          padding: '2.5rem',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          ':hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)'
          }
        }}>
          <h3 style={{ fontSize: '1.5rem', color: '#2a5298', marginBottom: '1.5rem' }}>Quick Actions</h3>
         
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <button
                  onClick={() => setShowVideoModal(true)}
                  style={{
                      background: 'linear-gradient(135deg, #34D399 0%, #059669 100%)',
                      color: 'white',
                      padding: '1.2rem',
                      borderRadius: '12px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      width: '100%',
                      boxShadow: '0 4px 6px rgba(52, 211, 153, 0.2)',
                      transition: 'all 0.3s ease',
                      marginBottom: '1rem'
                  }}
              >
                  Upload Video Link
              </button>
              {showVideoModal && (
                <VideoUploadModal
                    onClose={() => setShowVideoModal(false)}
                    onUpload={handleVideoUpload}
                    videoTitle={videoTitle}
                    videoLink={videoLink}
                    setVideoTitle={setVideoTitle}
                    setVideoLink={setVideoLink}
                />
            )}

              <Link href="/create-paper" style={{ textDecoration: 'none', marginBottom: '1rem' }}>
                <button style={{
                  background: 'linear-gradient(135deg, #2a5298 0%, #1e3c72 100%)',
                  color: 'white',
                  padding: '1.2rem',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  width: '100%',
                  boxShadow: '0 4px 6px rgba(42, 82, 152, 0.2)',
                  transition: 'all 0.3s ease',
                  transform: 'translateY(0)'
                }}>
                  Create Question Paper
                </button>
              </Link>

              <Link href="/view-paper" style={{ textDecoration: 'none' }}>
                <button style={{
                  background: 'transparent',
                  border: '2px solid #2a5298',
                  color: '#2a5298',
                  width: '100%',
                  padding: '0.8rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  ':hover': {
                    background: '#2a5298',
                    color: 'white'
                  }
                }}>
                  View All Question Papers
                </button>
              </Link>
          </div>
        </div>

        {/* Statistics Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
          padding: '2.5rem',
          maxWidth: '1400px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          <h3 style={{ fontSize: '1.5rem', color: '#2a5298', marginBottom: '1.5rem' }}>Student Results</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #eee' }}>
                  <th style={{ textAlign: 'left', padding: '1rem', color: '#666' }}>Student Details</th>
                  <th style={{ textAlign: 'left', padding: '1rem', color: '#666' }}>Paper Title</th>
                  <th style={{ textAlign: 'left', padding: '1rem', color: '#666' }}>Score</th>
                  <th style={{ textAlign: 'left', padding: '1rem', color: '#666' }}>Total Marks</th>
                  <th style={{ textAlign: 'left', padding: '1rem', color: '#666' }}>Percentage</th>
                  <th style={{ textAlign: 'left', padding: '1rem', color: '#666' }}>Completion Date</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <tr key={result._id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '1rem' }}>
                      <div>{result.studentName}</div>
                      <div style={{ fontSize: '0.8rem', color: '#666' }}>Roll No: {result.rollNumber}</div>
                      <div style={{ 
                        fontSize: '0.8rem', 
                        color: '#666',
                        marginTop: '0.2rem' 
                      }}>
                        {result.studentType === 'college' ? 
                          `Stream: ${result.stream || 'N/A'}` : 
                          `Class: ${result.class || 'N/A'}`
                        }
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>{result.title}</td>
                    <td style={{ padding: '1rem' }}>{result.totalScore}</td>
                    <td style={{ padding: '1rem' }}>{result.totalMarks}</td>
                    <td style={{ padding: '1rem' }}>
                      {result.totalMarks > 0 ? 
                        `${Math.round((result.totalScore / result.totalMarks) * 100)}%` : 
                        'N/A'
                      }
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {result.completedAt ? 
                        new Date(result.completedAt).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit'
                        })
                        : 'N/A'
                      }
                    </td>
                  </tr>
                ))}
                {results.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ padding: '1rem', textAlign: 'center', color: '#666' }}>
                      No results found for this subject
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
