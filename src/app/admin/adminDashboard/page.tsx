'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaUsers, FaFileAlt, FaChartBar, FaVideo, FaCog, FaSignOutAlt, FaPlus, FaEdit, FaTrash, FaCheckCircle, FaClock } from 'react-icons/fa';
import LoadingSpinner from '@/components/LoadingSpinner';

// Add proper type definitions
interface Teacher {
  id: string;
  name: string;
  email: string;
  subject: string;
  status: string;
  registrationDate: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
  classStream: string;
  status: string;
  registrationDate: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  // Update stats state
  const [stats, setStats] = useState({
    totalUsers: '0',
    activeExams: '0',
    totalVideos: '0'
  });
  
  // Update statCards array
  const statCards = [
    { title: 'Total Users', value: stats.totalUsers, change: '+12%', icon: FaUsers, color: '#4299e1' },
    { title: 'Active Exams', value: stats.activeExams, change: '+5%', icon: FaFileAlt, color: '#48bb78' },
    { title: 'Video Lectures', value: stats.totalVideos, change: '+8%', icon: FaVideo, color: '#ecc94b' },
  ];
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [users, setUsers] = useState<{ students: Student[]; teachers: Teacher[] }>({ 
    students: [], 
    teachers: [] 
  });


  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include'
      });
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [authResponse, usersResponse, videosResponse, papersResponse] = await Promise.all([
          fetch('/api/admin/check-auth', { credentials: 'include' }),
          fetch('/api/admin/getUser', { credentials: 'include' }),
          fetch('/api/getVideos', { credentials: 'include' }),
          fetch('/api/admin/getQuestionPapers', { credentials: 'include' })
        ]);

        if (!authResponse.ok) {
          router.push('/admin/login');
          return;
        }

        if (usersResponse.ok && videosResponse.ok && papersResponse.ok) {
          const userData = await usersResponse.json();
          const videoData = await videosResponse.json();
          const paperData = await papersResponse.json();
          
          setUsers(userData);
          setStats(prev => ({
            ...prev,
            totalUsers: (userData.students.length + userData.teachers.length).toString(),
            totalVideos: videoData.videos.length.toString(),
            activeExams: paperData.questionPapers.length.toString()
          }));
        }
      } catch (error) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  // Replace static recentUsers with dynamic data
  const displayUsers = [
    ...users.teachers.slice(0, 2).map(teacher => ({
      id: teacher.id,
      name: teacher.name,
      email: teacher.email,
      role: 'Teacher',
      date: new Date(teacher.registrationDate).toLocaleDateString(),
      subject: teacher.subject,
      status: teacher.status
    })),
    ...users.students.slice(0, 2).map(student => ({
      id: student.id,
      name: student.name,
      email: student.email,
      role: 'Student',
      date: new Date(student.registrationDate).toLocaleDateString(),
      class: student.classStream,
      status: student.status
    }))
  ];
  const handleDelete = async (userId: string, userType: string) => {
    const confirmDelete = window.confirm(`Are you sure you want to remove this ${userType} entry from database?`);
    
    if (!confirmDelete) {
      return;
    }
    try {
      const response = await fetch(`/api/admin/deleteUser?id=${userId}&type=${userType}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        // Update users state after successful deletion
        setUsers(prev => {
          const newUsers = {
            students: userType === 'student' ? prev.students.filter(s => s.id !== userId) : prev.students,
            teachers: userType === 'teacher' ? prev.teachers.filter(t => t.id !== userId) : prev.teachers
          };
          
          // Update total users count in stats
          setStats(prevStats => ({
            ...prevStats,
            totalUsers: (newUsers.students.length + newUsers.teachers.length).toString()
          }));

          return newUsers;
        });
      } else {
        setError('Failed to delete user');
      }
    } catch (error) {
      console.error('Delete error:', error);
      setError('Failed to delete user');
    }
  };
  
  // In the return statement, update the content grid
  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">
          <FaSignOutAlt />
          Logout
        </button>
      </div>
  
      {/* Stats Grid */}
      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: stat.color }}>
              <stat.icon />
            </div>
            <p className="stat-title">{stat.title}</p>
            <h3 className="stat-value">{stat.value}</h3>
          </div>
        ))}
      </div>
  
      {/* Main Content Grid */}
      <div className="content-grid">
        {/* Teachers Section */}
        <div className="content-card">
          <div className="card-header">
            <h2 className="card-title">Teachers ({users.teachers.length})</h2> 
          </div>
          <div>
            {users.teachers.map((teacher) => (
              <div key={teacher.id} className="list-item">
                <div className="item-info">
                  <h3>{teacher.name}</h3>
                  <p>{teacher.email}</p>
                  <small>Department: {teacher.subject} </small>
                  <br/>
                  <small className="block mt-1">Registered: {new Date(teacher.registrationDate).toLocaleDateString()}</small>
                </div>
                <div className="item-actions">
                  <span className={`role-badge role-teacher`}>
                    {teacher.status}
                  </span>
                  <button 
                    className="action-button delete" 
                    onClick={() => handleDelete(teacher.id, 'teacher')}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
  
        {/* Students Section */}
        <div className="content-card">
          <div className="card-header">
            <h2 className="card-title">Students ({users.students.length})</h2>
          </div>
          <div>
            {users.students.map((student) => (
              <div key={student.id} className="list-item">
                <div className="item-info">
                  <h3>{student.name}</h3>
                  <p>{student.email}</p>
                  <small>
                    {!isNaN(Number(student.classStream)) 
                      ? `Class: ${student.classStream} ` 
                      : `Stream: ${student.classStream} `
                    }
                  </small>
                  <br/>
                  <small className="block mt-1">Registered: {new Date(student.registrationDate).toLocaleDateString()}</small>
                </div>
                <div className="item-actions">
                  <span className={`role-badge role-student`}>
                    {student.status}
                  </span>
                  <button 
                    className="action-button delete" 
                    onClick={() => handleDelete(student.id, 'student')}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
