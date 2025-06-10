'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface LoginFormProps {
  defaultUserType?: 'student' | 'teacher';
}

export default function LoginForm({ defaultUserType = 'student' }: LoginFormProps) {
  const router = useRouter();
  const [userType, setUserType] = useState<'student' | 'teacher'>(defaultUserType);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    forgotOtp:''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [isOtpGenerating, setIsOtpGenerating] = useState(false);
  const [showResend, setShowResend] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const storeOtp = async (email:string,userType:string) => {
     const inotp = generateOTP();
     setShowResend(true);
     try {
      const res = await fetch('/api/auth/forget-password', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              otp: inotp,
              email: email,
              userType: userType
          })
      });
      if(!res.ok) {
        const msg=await res.json();
        alert(`${msg.error}`);
        return false;
      }else
         return true;
    }catch(error)
    {
      console.error("Code generation and storage failure!");
    }
    finally{
      setIsOtpGenerating(false);
    }
  }
  const verifyOTP = async (email: string, userType:string, inotp: string) => {
  try {
    const res = await fetch('/api/auth/verify-code', {
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
    if (res.ok && data.message === "Code verified") {
      return true;
    } else {
      // Pass the backend error message to the UI
      setErrors(prev => ({
        ...prev,
        otp: data.error || "Invalid Code"
      }));
      return false;
    }
  } catch (error) {
    setErrors(prev => ({
      ...prev,
      otp: "Code verification failed"
    }));
    return false;
  }
};
  function generateOTP(length=6){
    return Math.floor(Math.pow(10, length-1)+ Math.random()*9*Math.pow(10,length-1)).toString();
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true); // Set loading to true when starting login
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            userType: userType
          }),
          credentials: 'include'
        });

        const data = await response.json();
        
        if (data.success) {
          const dashboardPath = userType === 'student' ? '/student-dashboard' : '/teacher-dashboard';
          router.push(dashboardPath);
        } else {
          alert(data.message);
          setFormData({
            email: '',
            password: '',
          forgotOtp: ''});
        }
      } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Please try again.');
      } finally {
        setIsLoading(false); // Reset loading state regardless of outcome
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          <h1>Welcome Back</h1>
          <p>Sign in as a {userType}</p>
        </div>

        <div className="user-type-toggle">
          <button
            type="button"
            className={`toggle-btn ${userType === 'student' ? 'active' : ''}`}
            onClick={() => setUserType('student')}
            disabled={showForgot}
          >
            <i className="fas fa-user-graduate"></i>
            Student
          </button>
          <button
            type="button"
            className={`toggle-btn ${userType === 'teacher' ? 'active' : ''}`}
            onClick={() => setUserType('teacher')}
            disabled={showForgot}
          >
            <i className="fas fa-chalkboard-teacher"></i>
            Teacher
          </button>
        </div>

        <form 
          onSubmit={handleSubmit} 
          className="register-form" 
          autoComplete="off"
          data-form-type="other"
        >
          {!showForgot && !isVerified && (
            <>
              <div className="form-group">
                <div className="input-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? 'error' : ''}
                    autoComplete="off"
                  />
                  <i className="fas fa-envelope"></i>
                </div>
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? 'error' : ''}
                    autoComplete="new-password"
                    data-form-type="other"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
                {errors.password && <span className="error-message">{errors.password}</span>}
                <div style={{ textAlign: "right", marginTop: "4px" }}>
                  <button
                    type="button"
                    className="forgot-link"
                    style={{
                      fontSize: "0.95em",
                      background: "none",
                      border: "none",
                      color: "#0070f3",
                      cursor: "pointer",
                      padding: 0,
                      textDecoration: "underline"
                    }}
                    onClick={async() => {
                      if (!formData.email) {
                              setErrors(prev => ({
                                          ...prev,
                                          email: 'Your registered email is required if you have forgotten your password'
                          }));
                        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
                         setErrors(prev => ({
                           ...prev,
                            email: 'Please enter your valid registered email'
                         }));
                    } else {

                        if(await storeOtp(formData.email, userType))
                        setShowForgot(true);
                        else
                        setFormData(prev => ({ ...prev, email: '' }));  
                    }
  
                  }}
                    onMouseDown={e => e.preventDefault()}
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                className="register-button"
                disabled={isLoading}
              >
                <i className="fas fa-sign-in-alt"></i>
                {isLoading ? "Logging in..." : `Login as ${userType}`}
              </button>
            </>
          )}

          {showForgot && !isVerified && (
            <div style={{ textAlign: "center", margin: "2rem 0" }}>
              <p style={{ color: "#0070f3" }}>
                We've sent you a verification code in your email. Kindly check the spam box if you see you hadn't received any
              </p>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "12px", marginTop: "1.5rem", width: "100%" }}>
                <input
                  type="text"
                  name="forgotOtp"
                  placeholder="Enter verification code"
                  value={formData.forgotOtp || ""}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      forgotOtp: e.target.value
                    }))
                  }
                  style={{
                    padding: "8px 12px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    fontSize: "1em",
                    width: "180px"
                  }}
                />
                {showResend && (
                  <button
                    type="button"
                    className="resend-otp-button"
                    style={{
                      background: "#2a5298",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      padding: "8px 16px",
                      fontWeight: 500,
                      cursor: "pointer",
                      fontSize: "0.98em"
                    }}
                    disabled={isOtpGenerating}
                    onClick={async () => {
                      setIsOtpGenerating(true);
                      await storeOtp(formData.email, userType);
                      setFormData(prev => ({ ...prev, forgotOtp: '' }));
                      setErrors(prev => ({ ...prev, forgotOtp: '' }));
                    }}
                  >
                    {isOtpGenerating ? "Resending..." : "Resend Code"}
                  </button>
                )}
              </div>
              <div style={{ marginTop: "18px" }}>
                <button
                  type="button"
                  className="verify-otp-btn"
                  style={{
                    background: "#0070f3",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    padding: "10px 28px",
                    fontWeight: 500,
                    cursor: "pointer",
                    fontSize: "1em"
                  }}
                  onClick={async () => {
                    if (await verifyOTP(formData.email, userType, formData.forgotOtp)) {
                      alert("Code verified successfully!");
                      setIsVerified(true);
                      setShowForgot(false);
                    } else {
                      alert("Invalid code. Please try again.");
                    }
                  }}
                >
                  Verify Code
                </button>
              </div>
            </div>
          )}

          {/* Show set new password form after successful verification */}
          {isVerified && (
            <div style={{ textAlign: "center",margin: "2rem 0" }}>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: "20px",
                  margin: "1.5rem 0"
                }}
              >
                {/* New Password */}
<div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
  <label style={{ marginBottom: "6px", fontWeight: 500 }}>New Password</label>
  <div style={{ display: "flex", alignItems: "center" }}>
    <input
      type={showNewPassword ? "text" : "password"}
      placeholder="New Password"
      value={newPassword}
      onChange={e => setNewPassword(e.target.value)}
      style={{
        padding: "8px 12px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        fontSize: "1em",
        width: "200px"
      }}
    />
    <button
      type="button"
      className="password-toggle"
      onClick={() => setShowNewPassword(show => !show)}
      aria-label="Toggle password visibility"
      style={{ marginLeft: "8px" }}
    >
      <i className={`fas ${showNewPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
    </button>
  </div>
</div>
{/* Confirm New Password */}
<div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
  <label style={{ marginBottom: "6px", fontWeight: 500 }}>Confirm New Password</label>
  <div style={{ display: "flex", alignItems: "center" }}>
    <input
      type={showConfirmPassword ? "text" : "password"}
      placeholder="Confirm New Password"
      value={confirmPassword}
      onChange={e => setConfirmPassword(e.target.value)}
      style={{
        padding: "8px 12px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        fontSize: "1em",
        width: "200px"
      }}
    />
    <button
      type="button"
      className="password-toggle"
      onClick={() => setShowConfirmPassword(show => !show)}
      aria-label="Toggle password visibility"
      style={{ marginLeft: "8px" }}
    >
      <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
    </button>
  </div>
    </div>
  </div>
              {passwordError && (
                <div style={{ color: "red", marginBottom: "10px" }}>{passwordError}</div>
              )}
              <button
                type="button"
                className="set-password-btn"
                style={{
                  background: "#28a745",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  padding: "10px 28px",
                  fontWeight: 500,
                  cursor: "pointer",
                  fontSize: "1em"
                }}
                onClick={async () => {
                  if (!newPassword || !confirmPassword) {
                    setPasswordError("Both fields are required.");
                    return;
                  }
                  if (newPassword !== confirmPassword) {
                    setPasswordError("Passwords do not match.");
                    return;
                  }
                  setPasswordError("");

                  const res = await fetch('/api/auth/reset-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      email: formData.email,
                      userType,
                      newPassword
                    })
                  });

                  const data = await res.json();

                  if (res.ok) {
                    alert("Password updated successfully!");
                    setIsVerified(false);
                    setFormData({ email: '', password: '', forgotOtp: '' });
                  } else {
                    setPasswordError(data.error || "Failed to update password.");
                  }
                }}
              >
                Set New Password
              </button>
            </div>
          )}

          <div className="login-link">
            Don't have an account? <Link href="/register">Register here</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

