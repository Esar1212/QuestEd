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
          if (typeof window !== 'undefined' && authData.subject)
          {
           localStorage.setItem("subject",authData.subject);
          }
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
      padding: '4rem 1.5rem 1.5rem 1.5rem', 
      maxWidth: '100%', 
      margin: '0',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a1929 0%, #1a365d 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
        animation: 'pulse 4s ease-in-out infinite',
        zIndex: 0
      }} />
      
      {/* Floating Particles */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 0%, transparent 50%)',
        animation: 'float 6s ease-in-out infinite',
        zIndex: 0
      }} />

      {/* Header Card */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(30, 60, 114, 0.95) 0%, rgba(42, 82, 152, 0.95) 100%)',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        marginBottom: '1.5rem',
        padding: '2rem',
        maxWidth: '1200px',
        marginLeft: 'auto',
        marginRight: 'auto',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)',
        transform: 'translateY(0)',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        ':hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)'
        }
      }}>
        {/* Decorative Elements */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #34D399, #2a5298, #34D399)',
          backgroundSize: '200% 100%',
          animation: 'gradient-shift 3s linear infinite'
        }} />
        
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '-100px',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          transform: 'translateY(-50%)',
          animation: 'float 6s ease-in-out infinite'
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <div>
            <h2 style={{ 
              fontSize: '2rem', 
              marginBottom: '1rem', 
              color: 'white',
              fontWeight: '600',
              background: 'linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              position: 'relative',
              display: 'inline-block'
            }}>
              Welcome, Teacher {userData?.fullName}
              <span style={{
                position: 'absolute',
                bottom: '-4px',
                left: 0,
                width: '100%',
                height: '2px',
                background: 'linear-gradient(90deg, #34D399, #2a5298)',
                animation: 'width-pulse 2s ease-in-out infinite'
              }} />
            </h2>
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.9)', 
              marginBottom: '0.5rem',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                background: '#34D399',
                borderRadius: '50%',
                display: 'inline-block'
              }} />
              Department: {userData?.subject}
            </p>
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                background: '#34D399',
                borderRadius: '50%',
                display: 'inline-block'
              }} />
              Qualification: {userData?.qualification}
            </p>
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
              background: 'rgba(220, 53, 69, 0.9)',
              color: 'white',
              padding: '0.8rem 1.5rem',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.95rem',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backdropFilter: 'blur(5px)',
              position: 'relative',
              overflow: 'hidden',
              ':hover': { 
                background: 'rgba(220, 53, 69, 1)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(220, 53, 69, 0.3)'
              }
            }}
          >
            <span style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)',
              transform: 'translateX(-100%)',
              animation: 'shimmer 2s infinite'
            }} />
            <FiLogOut style={{ fontSize: '1.2rem' }} /> Logout
          </button>
        </div>
      </div>

      {/* Quick Actions Card */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
        padding: '2rem',
        maxWidth: '1200px',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: '1.5rem',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        ':hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)'
        }
      }}>
        {/* Decorative Corner */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '100px',
          height: '100px',
          background: 'linear-gradient(135deg, transparent 50%, rgba(52, 211, 153, 0.1) 50%)',
          borderTopRightRadius: '16px'
        }} />
        
        <h3 style={{ 
          fontSize: '1.5rem', 
          color: '#2a5298', 
          marginBottom: '1.5rem',
          position: 'relative',
          display: 'inline-block'
        }}>
          Quick Actions
          <span style={{
            position: 'absolute',
            bottom: '-4px',
            left: 0,
            width: '100%',
            height: '2px',
            background: 'linear-gradient(90deg, #34D399, #2a5298)',
            animation: 'width-pulse 2s ease-in-out infinite'
          }} />
        </h3>
       
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', zIndex: 1 }}>
            <button
                onClick={() => setShowVideoModal(true)}
                style={{
                    background: 'linear-gradient(135deg, #34D399 0%, #059669 100%)',
                    color: 'white',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '600',
                    width: '100%',
                    boxShadow: '0 4px 6px rgba(52, 211, 153, 0.2)',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    ':hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 12px rgba(52, 211, 153, 0.3)'
                    }
                }}
            >
                <span style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)',
                  transform: 'translateX(-100%)',
                  animation: 'shimmer 2s infinite'
                }} />
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

            <Link href="/create-paper" style={{ textDecoration: 'none' }}>
              <button style={{
                background: 'linear-gradient(135deg, #2a5298 0%, #1e3c72 100%)',
                color: 'white',
                padding: '1rem',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                width: '100%',
                boxShadow: '0 4px 6px rgba(42, 82, 152, 0.2)',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                ':hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 12px rgba(42, 82, 152, 0.3)'
                }
              }}>
                <span style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)',
                  transform: 'translateX(-100%)',
                  animation: 'shimmer 2s infinite'
                }} />
                Create Question Paper
              </button>
            </Link>

            <Link href="/view-paper" style={{ textDecoration: 'none' }}>
              <button style={{
                background: 'transparent',
                border: '2px solid #2a5298',
                color: '#2a5298',
                width: '100%',
                padding: '1rem',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                ':hover': {
                  background: '#2a5298',
                  color: 'white',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 12px rgba(42, 82, 152, 0.2)'
                }
              }}>
                <span style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)',
                  transform: 'translateX(-100%)',
                  animation: 'shimmer 2s infinite'
                }} />
                View All Question Papers
              </button>
            </Link>
        </div>
      </div>

      {/* Student Results Section */}
      <div style={{
        maxWidth: '1200px',
        marginLeft: 'auto',
        marginRight: 'auto',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Results Summary Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '1.5rem'
        }}>
          {/* Total Students Card */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(52, 211, 153, 0.95) 0%, rgba(5, 150, 105, 0.95) 100%)',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
            padding: '1.5rem',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden',
            ':hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)'
            }
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '80px',
              height: '80px',
              background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
              borderRadius: '50%',
              transform: 'translate(20px, -20px)'
            }} />
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              zIndex: 1
            }}>
              <h4 style={{ 
                fontSize: '1.1rem', 
                color: 'white', 
                marginBottom: '0.5rem',
                fontWeight: '500'
              }}>
                Total Students
              </h4>
              <div style={{ 
                fontSize: '2.5rem', 
                color: 'white',
                fontWeight: '700',
                marginBottom: '0.5rem'
              }}>
                {results.length > 0 ? 
                  new Set(results.map(r => r.studentName)).size : 
                  0
                }
              </div>
              <div style={{ 
                fontSize: '0.9rem', 
                color: 'rgba(255,255,255,0.8)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  background: 'white',
                  borderRadius: '50%',
                  display: 'inline-block'
                }} />
                Unique students who have taken exams
              </div>
            </div>
          </div>

          {/* Total Papers Card */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(42, 82, 152, 0.95) 0%, rgba(30, 60, 114, 0.95) 100%)',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
            padding: '1.5rem',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden',
            ':hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)'
            }
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '80px',
              height: '80px',
              background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
              borderRadius: '50%',
              transform: 'translate(20px, -20px)'
            }} />
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              zIndex: 1
            }}>
              <h4 style={{ 
                fontSize: '1.1rem', 
                color: 'white', 
                marginBottom: '0.5rem',
                fontWeight: '500'
              }}>
                Total Papers
              </h4>
              <div style={{ 
                fontSize: '2.5rem', 
                color: 'white',
                fontWeight: '700',
                marginBottom: '0.5rem'
              }}>
                {results.length}
              </div>
              <div style={{ 
                fontSize: '0.9rem', 
                color: 'rgba(255,255,255,0.8)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  background: 'white',
                  borderRadius: '50%',
                  display: 'inline-block'
                }} />
                Question papers completed by students
              </div>
            </div>
          </div>

          {/* Average Score Card */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.95) 0%, rgba(217, 119, 6, 0.95) 100%)',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
            padding: '1.5rem',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden',
            ':hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)'
            }
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '80px',
              height: '80px',
              background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
              borderRadius: '50%',
              transform: 'translate(20px, -20px)'
            }} />
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              zIndex: 1
            }}>
              <h4 style={{ 
                fontSize: '1.1rem', 
                color: 'white', 
                marginBottom: '0.5rem',
                fontWeight: '500'
              }}>
                Average Score
              </h4>
              <div style={{ 
                fontSize: '2.5rem', 
                color: 'white',
                fontWeight: '700',
                marginBottom: '0.5rem'
              }}>
                {results.length > 0 ? 
                  `${Math.round(results.reduce((acc, r) => 
                    acc + (r.totalMarks > 0 ? (r.totalScore / r.totalMarks) * 100 : 0), 0) / results.length)}%` : 
                  '0%'
                }
              </div>
              <div style={{ 
                fontSize: '0.9rem', 
                color: 'rgba(255,255,255,0.8)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  background: 'white',
                  borderRadius: '50%',
                  display: 'inline-block'
                }} />
                Average performance across all papers
              </div>
            </div>
          </div>
        </div>

        {/* Results Table Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
          padding: '2rem',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden',
          ':hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)'
          }
        }}>
          {/* Decorative Corner */}
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100px',
            height: '100px',
            background: 'linear-gradient(135deg, transparent 50%, rgba(42, 82, 152, 0.1) 50%)',
            borderTopRightRadius: '16px'
          }} />
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ 
              fontSize: '1.5rem', 
              color: '#2a5298', 
              position: 'relative',
              display: 'inline-block'
            }}>
              Student Results
              <span style={{
                position: 'absolute',
                bottom: '-4px',
                left: 0,
                width: '100%',
                height: '2px',
                background: 'linear-gradient(90deg, #34D399, #2a5298)',
                animation: 'width-pulse 2s ease-in-out infinite'
              }} />
            </h3>
            
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'center'
            }}>
              <span style={{
                width: '12px',
                height: '12px',
                background: '#34D399',
                borderRadius: '50%',
                display: 'inline-block'
              }} />
              <span style={{ fontSize: '0.9rem', color: '#4a5568' }}>High Score</span>
              <span style={{
                width: '12px',
                height: '12px',
                background: '#ef4444',
                borderRadius: '50%',
                display: 'inline-block',
                marginLeft: '1rem'
              }} />
              <span style={{ fontSize: '0.9rem', color: '#4a5568' }}>Low Score</span>
            </div>
          </div>
          
          <div style={{ overflowX: 'auto', position: 'relative', zIndex: 1 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(42,82,152,0.1)' }}>
                  <th style={{ textAlign: 'left', padding: '1rem', color: '#4a5568', fontSize: '0.95rem', fontWeight: '600' }}>Student Details</th>
                  <th style={{ textAlign: 'left', padding: '1rem', color: '#4a5568', fontSize: '0.95rem', fontWeight: '600' }}>Paper Title</th>
                  <th style={{ textAlign: 'left', padding: '1rem', color: '#4a5568', fontSize: '0.95rem', fontWeight: '600' }}>Score</th>
                  <th style={{ textAlign: 'left', padding: '1rem', color: '#4a5568', fontSize: '0.95rem', fontWeight: '600' }}>Total Marks</th>
                  <th style={{ textAlign: 'left', padding: '1rem', color: '#4a5568', fontSize: '0.95rem', fontWeight: '600' }}>Percentage</th>
                  <th style={{ textAlign: 'left', padding: '1rem', color: '#4a5568', fontSize: '0.95rem', fontWeight: '600' }}>Completion Date</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => {
                  const percentage = result.totalMarks > 0 ? 
                    Math.round((result.totalScore / result.totalMarks) * 100) : 0;
                  
                  // Determine score color based on percentage
                  let scoreColor = '#34D399'; // Default green
                  if (percentage < 40) {
                    scoreColor = '#EF4444'; // Red for low scores
                  } else if (percentage < 70) {
                    scoreColor = '#F59E0B'; // Yellow for medium scores
                  }
                  
                  return (
                    <tr key={result._id} style={{ 
                      borderBottom: '1px solid rgba(42,82,152,0.1)',
                      transition: 'all 0.3s ease',
                      ':hover': {
                        background: 'rgba(42,82,152,0.05)',
                        transform: 'translateX(4px)'
                      }
                    }}>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ 
                          fontWeight: '600', 
                          color: '#2a5298',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}>
                          <span style={{
                            width: '8px',
                            height: '8px',
                            background: scoreColor,
                            borderRadius: '50%',
                            display: 'inline-block'
                          }} />
                          {result.studentName}
                        </div>
                        <div style={{ 
                          fontSize: '0.85rem', 
                          color: '#4a5568',
                          marginTop: '0.25rem',
                          marginLeft: '1.25rem'
                        }}>
                          Roll No: {result.rollNumber}
                        </div>
                        <div style={{ 
                          fontSize: '0.85rem', 
                          color: '#4a5568',
                          marginTop: '0.25rem',
                          marginLeft: '1.25rem'
                        }}>
                          {result.studentType === 'college' ? 
                            `Stream: ${result.stream || 'N/A'}` : 
                            `Class: ${result.class || 'N/A'}`
                          }
                        </div>
                      </td>
                      <td style={{ 
                        padding: '1rem', 
                        color: '#4a5568', 
                        fontSize: '0.95rem',
                        fontWeight: '500'
                      }}>
                        {result.title}
                      </td>
                      <td style={{ 
                        padding: '1rem', 
                        color: '#4a5568', 
                        fontSize: '0.95rem',
                        fontWeight: '500'
                      }}>
                        {result.totalScore}
                      </td>
                      <td style={{ 
                        padding: '1rem', 
                        color: '#4a5568', 
                        fontSize: '0.95rem',
                        fontWeight: '500'
                      }}>
                        {result.totalMarks}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          background: `linear-gradient(135deg, ${scoreColor} 0%, ${scoreColor}99 100%)`,
                          color: 'white',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '8px',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          display: 'inline-block',
                          boxShadow: `0 2px 4px ${scoreColor}40`,
                          transition: 'all 0.3s ease',
                          ':hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: `0 4px 8px ${scoreColor}60`
                          }
                        }}>
                          {result.totalMarks > 0 ? 
                            `${percentage}%` : 
                            'N/A'
                          }
                        </span>
                      </td>
                      <td style={{ 
                        padding: '1rem', 
                        color: '#4a5568', 
                        fontSize: '0.95rem',
                        fontWeight: '500'
                      }}>
                        {result.completedAt ? 
                          new Date(result.completedAt).toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                          : 'N/A'
                        }
                      </td>
                    </tr>
                  );
                })}
                {results.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ 
                      padding: '2rem', 
                      textAlign: 'center', 
                      color: '#4a5568',
                      fontSize: '0.95rem',
                      background: 'rgba(42,82,152,0.05)',
                      borderRadius: '8px'
                    }}>
                      No results found for this subject
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Keyframe Animations */}
      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 0.5; }
          50% { opacity: 0.8; }
          100% { opacity: 0.5; }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes width-pulse {
          0% { width: 0%; }
          50% { width: 100%; }
          100% { width: 0%; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
