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
  const [isCollegeStudent, setIsCollegeStudent] = useState(false);
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
    // College student specific fields
    stream: '',
    year: '',
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
      
      if (isCollegeStudent) {
        if (!formData.stream.trim()) {
          newErrors.stream = 'Stream is required';
        }
        if (!formData.year.trim()) {
          newErrors.year = 'Year is required';
        }
      } else {
        if (!formData.class.trim()) {
          newErrors.class = 'Class is required';
        }
      }
    }
    console.log("Validation errors:",newErrors);
    console.log("Form Data:",formData);

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {

        // Prepare the request data based on user type
        const requestData = {
          userType,
          ...formData,
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          ...(userType === 'student' 
            ? {
                rollNumber: formData.rollNumber,
                studentType: isCollegeStudent ? 'college' : 'school',
                ...(isCollegeStudent 
                  ? {
                      stream: formData.stream,
                      year: formData.year,
                    }
                  : {
                      class: formData.class,
                    }
                ),
              }
            : {
                subject: formData.subject,
                qualification: formData.qualification,
              }
          ),
        };
       try{
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });

        const data = await response.json();
        if(data.error==="Email already exists"){
          alert("This email is already registered! Use a different account");
          setFormData({
            ...formData,
            email: ''
          });
        }

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
        alert("Registration successful! Please login to continue");
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
                pattern="[a-zA-Z\s]+"
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
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
              />
              <i className="fas fa-envelope"></i>
            </div>
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <div className="input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'error' : ''}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-group">
            <div className="input-group">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? 'error' : ''}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>
         


          {userType === 'student' && (
            <>
              <div className="form-group">
                <div className="input-group">
                  <input
                    type="number"
                    name="rollNumber"
                    min='1'
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
                  <select
                    name="isCollegeStudent"
                    value={isCollegeStudent ? 'college' : 'school'}
                    onChange={(e) => setIsCollegeStudent(e.target.value === 'college')}
                    className={errors.isCollegeStudent ? 'error' : ''}
                  >
                    <option value="school">School Student</option>
                    <option value="college">College Student</option>
                  </select>
                </div>
              </div>

              

              
              {isCollegeStudent ? (
                <>
                  <div className="form-group">
            <div className="input-group">
              <input
                type="text"
                name="stream"
                pattern="[a-zA-Z\s]+"
                placeholder="Stream"
                value={formData.stream}
                onChange={handleChange}
                className={errors.stream ? 'error' : ''}
              />
              <i className="fas fa-stream"></i>
            </div>
            {errors.stream && <span className="error-message">{errors.stream}</span>}
          </div>
                  <div className="form-group">
                    <div className="input-group">
                      <select
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        className={errors.year ? 'error' : ''}
                      >
                        <option value="">Select Year</option>
                        <option value="1">First Year</option>
                        <option value="2">Second Year</option>
                        <option value="3">Third Year</option>
                        <option value="4">Fourth Year</option>
                      </select>
          
                    </div>
                    {errors.year && <span className="error-message">{errors.year}</span>}
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group">
                <div className="input-group">
                  <input
                    type="number"
                    min='1'
                    max='12'
                    name="class"
                    placeholder="Class"
                    value={formData.class}
                    onChange={handleChange}
                    className={errors.class ? 'error' : ''}
                  />
                  <i className="fas fa-school"></i>
                </div>
                {errors.class && <span className="error-message">{errors.class}</span>}
              </div>

                </>
              )}
            </>
          )}

          {userType === 'teacher' && (
            <>
              
              <div className="form-group">
            <div className="input-group">
              <input
                type="text"
                name="fullName"
                pattern="[a-zA-Z\s]+"
                placeholder="Subject"
                value={formData.subject}
                onChange={(e)=>setFormData({...formData,subject:e.target.value})}
                className={errors.subject ? 'error' : ''}
              />
              <i className="fas fa-book"></i>
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

          {errors.submit && (
            <div className="error-message text-center">{errors.submit}</div>
          )}

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

         
     

 

              
           
         
