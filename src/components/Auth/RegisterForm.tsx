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
  const [isLoading,setIsLoading]=useState(false);
  const [showResend, setShowResend] = useState(false);
  const [isOtpVerified,setIsOtpVerified]=useState(false);
  const [isOtpGenerating,setIsOtpGenerating]=useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    otp: '',
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
  const [isOtpSent, setIsOtpSent] = useState(false);
  const storeOtp = async (email:string) => {
    if (!email) {
      alert("Please enter your email to generate OTP");
      return;
    }
     const inotp = generateOTP();
     setShowResend(true);
      
     try {
      const res = await fetch('/api/auth/set-otp', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              email: email,
              otp: inotp
          })
      });
      setIsOtpSent(true);
    }catch(error)
    {
      console.error("OTP generation and storage failure!");
    }
    finally{
      setIsOtpGenerating(false);
    }
  }
  const verifyOTP = async (email: string, inotp: string) => {
  try {
    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        otp: inotp
      })
    });
    const data = await res.json();
    if (res.ok && data.message === "OTP verified") {
      return true;
    } else {
      // Pass the backend error message to the UI
      setErrors(prev => ({
        ...prev,
        otp: data.error || "Invalid OTP"
      }));
      return false;
    }
  } catch (error) {
    setErrors(prev => ({
      ...prev,
      otp: "OTP verification failed"
    }));
    return false;
  }
};
  function generateOTP(length=6){
    return Math.floor(Math.pow(10, length-1)+ Math.random()*9*Math.pow(10,length-1)).toString();
  }
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
         setIsLoading(true);
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
          setIsOtpVerified(false);
          setIsOtpSent(false);
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
      }finally{
        setIsLoading(false);
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
      <style jsx>{`
        .input-group select {
          width: 100%;
          padding: 12px 40px 12px 16px;
          border: 2px solid rgba(42, 82, 152, 0.2);
          border-radius: 8px;
          background-color: rgba(255, 255, 255, 0.9);
          color: #333;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%232a5298' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          background-size: 16px;
        }

        .input-group select:hover {
          border-color: #2a5298;
          box-shadow: 0 2px 4px rgba(42, 82, 152, 0.1);
        }

        .input-group select:focus {
          outline: none;
          border-color: #2a5298;
          box-shadow: 0 0 0 3px rgba(42, 82, 152, 0.2);
        }

        .input-group select option {
          padding: 12px 16px;
          background-color: #ffffff;
          color: #333;
          font-size: 1rem;
          transition: background-color 0.2s ease;
          border-bottom: 1px solid rgba(42, 82, 152, 0.1);
          cursor: pointer;
        }

        .input-group select option:hover,
        .input-group select option:focus {
          background-color: rgba(42, 82, 152, 0.1) !important;
          color: #2a5298;
        }

        .input-group select option:checked {
          background-color: rgba(42, 82, 152, 0.2) !important;
          color: #2a5298;
          font-weight: 500;
        }

        .input-group select option:first-child {
          font-style: italic;
          color: #666;
        }

        .input-group select.error {
          border-color: #ff4444;
          background-color: rgba(255, 68, 68, 0.05);
        }
          
    .verify-otp-button {
      background-color: #28a745;
      color: white;
      padding: 8px 25px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      margin-top: 10px;
      transition: all 0.3s ease;
      box-shadow: 0 2px 4px rgba(40, 167, 69, 0.2);
    }

    .verify-otp-button:hover {
      background-color: #218838;
      transform: translateY(-1px);
      box-shadow: 0 4px 6px rgba(40, 167, 69, 0.3);
    }
      `}</style>
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
                disabled={isOtpSent || isOtpVerified}
              />
              {!isOtpVerified && <i className="fas fa-envelope"></i>}
              {isOtpVerified && <i className="fas fa-check-circle verified-icon"
                style={{ color: '#28a745', marginLeft: '8px', fontSize: '1.2em' }}
        title="Email verified"
        ></i>}
            </div>
            {errors.email && <span className="error-message">{errors.email}</span>}
             {!isOtpVerified && (
            <button
              type="button"
              className="generate-otp-button"
              disabled={isOtpSent|| isOtpGenerating}
              onClick={()=>storeOtp(formData.email)}
              style={{
                backgroundColor: '#2a5298',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                marginTop: '10px',
                width: '100%',
                transition: 'all 0.3s ease',
                opacity: isOtpSent || isOtpGenerating ? '0.7' : '1',
                boxShadow: '0 2px 4px rgba(42, 82, 152, 0.2)'
              }}
            >
               {isOtpGenerating
      ? "Generating OTP ..."
      : isOtpSent
        ? "OTP Sent to your email! Your OTP will remain valid for only 5 mins. Kindly check your spam box if you couldn't find them"
        : "Generate OTP"}
            </button>
             )}
          </div>

          {isOtpSent && !isOtpVerified && (
            <div className="form-group">
              <div className="input-group">
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter OTP"
                  value={formData.otp}
                  onChange={handleChange}
                  className={errors.otp ? 'error' : ''}
                />
                <i className="fas fa-key"></i>
              </div>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginTop: '10px' }}>
  
                <button type="button"
  className="verify-otp-button"
  onClick={async () => {
    const isValid = await verifyOTP(formData.email, formData.otp);
    if (isValid) {
      alert("Email account verified successfully!");
      setIsOtpVerified(true);
      setIsOtpSent(false);
      setFormData(prev => ({ ...prev, otp: '' }));
      setShowResend(false); 
      setErrors(prev => ({ ...prev, otp: '' }));
    } else {
      setFormData(prev => ({ ...prev, otp: '' }));
      setShowResend(true); 
    }
  }}
>
  Verify
</button>
                 {showResend && (
        <button
          type="button"
          className="verify-otp-button"
          style={{ backgroundColor: "#2a5298" }}
          disabled={isOtpGenerating}
          onClick={async () => {
            setIsOtpGenerating(true);
            await storeOtp(formData.email);
            setFormData(prev => ({ ...prev, otp: '' }));
            setErrors(prev => ({ ...prev, otp: '' }));
          }}
        >
          {isOtpGenerating ? "Resending..." : "Resend OTP"}
        </button>
      )}
              </div>
              {errors.otp && <span className="error-message">{errors.otp}</span>}
            </div>
          )}

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
            <select
                        name="stream"
                        value={formData.stream}
                        onChange={handleChange}
                        className={errors.stream ? 'error' : ''}
                      >
                        <option value="">Select an Engineering Stream</option>
                        <option value="CSE">CSE</option>
                        <option value="ECE">ECE</option>
                        <option value="ME">ME</option>
                        <option value="IT">IT</option>
                        <option value="ChE">ChE</option>
                        <option value="CE">CE</option>
                        <option value="EE">EE</option>
                        <option value="AEIE">AEIE</option>

                      </select>
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
                    onWheel={(e) => e.currentTarget.blur()}
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
            <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className={errors.subject ? 'error' : ''}
                      >
                        <option value="">Select your department</option>
                       <option value="Computer Science and Engineering">Computer Science and Engineering</option>
                        <option value="Electronics and Communication Engineering">Electronics and Communication Engineering</option>
                        <option value="Mechanical Engineering">Mechanical Engineering</option>
                        <option value="Information Technology">Information Technology</option>
                        <option value="Chemical Engineering">Chemical Engineering</option>
                        <option value="Civil Engineering">Civil Engineering</option>
                        <option value="Electrical Engineering">Electrical Engineering</option>
                        <option value="Applied Electronics and Instrumentation Engineering">Applied Electronics and Instrumentation Engineering</option>
                        <option value="Physics">Physics</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="Biology">Biology</option>
                        <option value="History">History</option>
                        <option value="Geography">Geography</option>
                        
                      </select>
              
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

          <button type="submit" className="register-button" disabled={isLoading}
          onClick={e => {
          if (!isOtpVerified) {
           e.preventDefault();
           alert("Email is not verified. Please verify your email by generating an OTP.");
            }
          }}>
            <i className="fas fa-user-plus"></i>
            { isLoading? "Registering...": `Register as ${userType}`}
          </button>

          <div className="login-link">
            Already have an account? <Link href="/login">Login here</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
