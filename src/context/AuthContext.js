import { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/me');
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const registerStudent = async (studentData) => {
    const res = await fetch('/api/register/student', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData),
    });
    if (res.ok) {
      const userData = await res.json();
      setUser(userData);
      router.push(userData.studentType === 'school' ? '/school-dashboard' : '/college-dashboard');
    } else {
      throw new Error(await res.text());
    }
  };

  const registerTeacher = async (teacherData) => {
    const res = await fetch('/api/register/teacher', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(teacherData),
    });
    if (res.ok) {
      const userData = await res.json();
      setUser(userData);
      router.push('/teacher-dashboard');
    } else {
      throw new Error(await res.text());
    }
  };

  const login = async (email, password, userType) => {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, userType }),
    });
    if (res.ok) {
      const userData = await res.json();
      setUser(userData);
      router.push(
        userType === 'teacher' 
          ? '/teacher-dashboard' 
          : userData.studentType === 'school' 
            ? '/school-dashboard' 
            : '/college-dashboard'
      );
    } else {
      throw new Error('Login failed');
    }
  };

  const logout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    setUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      registerStudent,
      registerTeacher,
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);