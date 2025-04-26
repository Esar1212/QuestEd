import Link from 'next/link';
import ExamList from '@/components/Exam/ExamList';

export default function Home() {
  return (
    <div className="container" style={{ 
      backgroundColor: '#0a0f1c', 
      minHeight: '100vh', 
      color: 'white',
      width: '100%',
      maxWidth: '100%',
      margin: 0,
      padding: '80px 20px 0', // Added top padding to account for navbar
      overflowX: 'hidden',
      boxSizing: 'border-box'
    }}>
      <header className="hero-section" style={{
        paddingTop: '2rem', // Additional padding for better spacing
        width: '100%',
        position: 'relative',
        zIndex: 1
      }}>
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to <span className="highlight">Online Examination Portal</span>
          </h1>
          <p className="hero-subtitle">
            Test your knowledge, track your progress, and excel in your learning journey
          </p>
          <div className="hero-buttons">
            <Link href="/login" className="hero-button primary">
              Get Started
            </Link>
            <Link href="/register" className="hero-button secondary">
              Learn More
            </Link>
          </div>
        </div>
        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-number">1000+</span>
            <span className="stat-label">Active Students</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">50+</span>
            <span className="stat-label">Available Exams</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">95%</span>
            <span className="stat-label">Success Rate</span>
          </div>
        </div>
      </header>

      <section className="exam-section">
        <h2>Available Exams</h2>
        <ExamList />
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>About Us</h3>
            <p>QuestEd is your trusted platform for conducting and taking online exams. We provide a seamless experience for both educators and students.</p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms of Service</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Contact Info</h3>
            <ul className="contact-info">
              <li>Email: support@quested.com</li>
              <li>Phone: +91 1234567990</li>
              <li>Address: Heritage Institute of Technology, Kolkata</li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Follow Us</h3>
            <div className="social-links">
              <a href="https://www.facebook.com/login/" className="social-link">
                <i className="fab fa-facebook-f"></i>
                <span>Facebook</span>
              </a>
              <a href="https://x.com/i/flow/login" className="social-link">
                <i className="fab fa-twitter"></i>
                <span>Twitter</span>
              </a>
              <a href="https://www.linkedin.com/login" className="social-link">
                <i className="fab fa-linkedin-in"></i>
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025<b> QuestEd </b> Online Examination Portal. All rights reserved by <b>Team IdeaForge</b>.</p>
        </div>
      </footer>
    </div>
  );
}
