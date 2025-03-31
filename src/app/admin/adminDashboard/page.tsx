'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaUsers, FaFileAlt, FaChartBar, FaCog, FaSignOutAlt, FaPlus, FaEdit, FaTrash, FaCheckCircle, FaClock } from 'react-icons/fa';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Check for admin token cookie
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/check-auth', {
          credentials: 'include'
        });
        if (!response.ok) {
          router.push('/admin/login');
        }
      } catch (error) {
        router.push('/admin/login');
      }
    };
    checkAuth();
  }, [router]);

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

  const stats = [
    { title: 'Total Users', value: '1,234', change: '+12%', icon: FaUsers, color: '#4299e1' },
    { title: 'Active Exams', value: '45', change: '+5%', icon: FaFileAlt, color: '#48bb78' },
    { title: 'Average Score', value: '85%', change: '+3%', icon: FaChartBar, color: '#805ad5' },
    { title: 'Pending Reviews', value: '23', change: '-2%', icon: FaClock, color: '#ecc94b' },
  ];

  const recentExams = [
    { id: 1, title: 'Mathematics Final', subject: 'Mathematics', date: '2024-03-20', status: 'Active' },
    { id: 2, title: 'Physics Midterm', subject: 'Physics', date: '2024-03-21', status: 'Scheduled' },
    { id: 3, title: 'Chemistry Quiz', subject: 'Chemistry', date: '2024-03-22', status: 'Completed' },
  ];

  const recentUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Student', date: '2024-03-19' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Teacher', date: '2024-03-18' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'Student', date: '2024-03-17' },
  ];

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
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: stat.color }}>
              <stat.icon />
            </div>
            <p className="stat-title">{stat.title}</p>
            <h3 className="stat-value">{stat.value}</h3>
            <p className={`stat-change ${stat.change.startsWith('+') ? 'positive' : 'negative'}`}>
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="content-grid">
        {/* Recent Exams */}
        <div className="content-card">
          <div className="card-header">
            <h2 className="card-title">Recent Exams</h2>
            <button className="add-button">
              <FaPlus />
              New Exam
            </button>
          </div>
          <div>
            {recentExams.map((exam) => (
              <div key={exam.id} className="list-item">
                <div className="item-info">
                  <h3>{exam.title}</h3>
                  <p>{exam.subject}</p>
                </div>
                <div className="item-actions">
                  <span className={`status-badge status-${exam.status.toLowerCase()}`}>
                    {exam.status}
                  </span>
                  <button className="action-button edit">
                    <FaEdit />
                  </button>
                  <button className="action-button delete">
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div className="content-card">
          <div className="card-header">
            <h2 className="card-title">Recent Users</h2>
            <button className="add-button">
              <FaPlus />
              Add User
            </button>
          </div>
          <div>
            {recentUsers.map((user) => (
              <div key={user.id} className="list-item">
                <div className="item-info">
                  <h3>{user.name}</h3>
                  <p>{user.email}</p>
                </div>
                <div className="item-actions">
                  <span className={`role-badge role-${user.role.toLowerCase()}`}>
                    {user.role}
                  </span>
                  <button className="action-button edit">
                    <FaEdit />
                  </button>
                  <button className="action-button delete">
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