'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface RegisterFormProps {
  defaultUserType?: 'student' | 'teacher';
}

export default function RegisterForm({ defaultUserType = 'student' }: RegisterFormProps) {
  const router = useRouter();
  const [userType, setUserType] = useState<'student' | 'teacher'>(defaultUserType);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    // Additional fields for teachers
    subject: '',
    qualification: '',
    // Additional fields for students
    rollNumber: '',
    class: '',
    studentSubject: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Teacher-specific validations
    if (userType === 'teacher') {
      if (!formData.subject.trim()) {
        newErrors.subject = 'Subject is required';
      }
      if (!formData.qualification.trim()) {
        newErrors.qualification = 'Qualification is required';
      }
    }

    // Student-specific validations
    if (userType === 'student') {
      if (!formData.rollNumber.trim()) {
        newErrors.rollNumber = 'Roll number is required';
      }
      if (!formData.class.trim()) {
        newErrors.class = 'Class is required';
      }
      if (!formData.studentSubject.trim()) {
        newErrors.studentSubject = 'Subject is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Prepare the request data based on user type
        const requestData = {
          userType,
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          ...(userType === 'student' 
            ? {
                rollNumber: formData.rollNumber,
                class: formData.class,
                studentSubject: formData.studentSubject,
              }
            : {
                subject: formData.subject,
                qualification: formData.qualification,
              }
          ),
        };

        const response = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });

        const data = await response.json();

        if (!response.ok) {
          // Handle validation errors from the API
          if (data.errors) {
            const newErrors: Record<string, string> = {};
            data.errors.forEach((err: { field: string; message: string }) => {
              newErrors[err.field] = err.message;
            });
            setErrors(newErrors);
            return;
          }
          throw new Error(data.message || 'Registration failed');
        }

        // Registration successful
        console.log('Registration successful:', data);
        router.push('/login');
      } catch (error) {
        console.error('Registration error:', error);
        setErrors({
          submit: error instanceof Error ? error.message : 'Registration failed'
        });
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h1>Create Account</h1>
          <p>Join our community as a {userType}</p>
        </div>

        <div className="user-type-toggle">
          <button
            type="button"
            className={`toggle-btn ${userType === 'student' ? 'active' : ''}`}
            onClick={() => setUserType('student')}
          >
            <i className="fas fa-user-graduate"></i>
            Student
          </button>
          <button
            type="button"
            className={`toggle-btn ${userType === 'teacher' ? 'active' : ''}`}
            onClick={() => setUserType('teacher')}
          >
            <i className="fas fa-chalkboard-teacher"></i>
            Teacher
          </button>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <div className="input-group">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                className={errors.fullName ? 'error' : ''}
              />
              <i className="fas fa-user"></i>
            </div>
            {errors.fullName && <span className="error-message">{errors.fullName}</span>}
          </div>

          <div className="form-group">
            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
              />
              <i className="fas fa-envelope"></i>
            </div>
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          {userType === 'student' && (
            <>
              <div className="form-group">
                <div className="input-group">
                  <input
                    type="text"
                    name="rollNumber"
                    placeholder="Roll Number"
                    value={formData.rollNumber}
                    onChange={handleChange}
                    className={errors.rollNumber ? 'error' : ''}
                  />
                  <i className="fas fa-id-card"></i>
                </div>
                {errors.rollNumber && <span className="error-message">{errors.rollNumber}</span>}
              </div>

              <div className="form-group">
                <div className="input-group">
                  <input
                    type="text"
                    name="class"
                    placeholder="Class"
                    value={formData.class}
                    onChange={handleChange}
                    className={errors.class ? 'error' : ''}
                  />
                  <i className="fas fa-chalkboard"></i>
                </div>
                {errors.class && <span className="error-message">{errors.class}</span>}
              </div>

              <div className="form-group">
                <div className="input-group">
                  <input
                    type="text"
                    name="studentSubject"
                    placeholder="Subject"
                    value={formData.studentSubject}
                    onChange={handleChange}
                    className={errors.studentSubject ? 'error' : ''}
                  />
                  <i className="fas fa-book"></i>
                </div>
                {errors.studentSubject && <span className="error-message">{errors.studentSubject}</span>}
              </div>
            </>
          )}

          {userType === 'teacher' && (
            <>
              <div className="form-group">
                <div className="input-group">
                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={errors.subject ? 'error' : ''}
                  />
                  <i className="fas fa-book-open"></i>
                </div>
                {errors.subject && <span className="error-message">{errors.subject}</span>}
              </div>

              <div className="form-group">
                <div className="input-group">
                  <input
                    type="text"
                    name="qualification"
                    placeholder="Qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    className={errors.qualification ? 'error' : ''}
                  />
                  <i className="fas fa-graduation-cap"></i>
                </div>
                {errors.qualification && <span className="error-message">{errors.qualification}</span>}
              </div>
            </>
          )}

          <div className="form-group">
            <div className="input-group">
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'error' : ''}
              />
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-group">
            <div className="input-group">
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label="Toggle password visibility"
              >
                <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? 'error' : ''}
              />
            </div>
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          <button type="submit" className="register-button">
            <i className="fas fa-user-plus"></i>
            Register as {userType}
          </button>

          <div className="login-link">
            Already have an account? <Link href="/login">Login here</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
