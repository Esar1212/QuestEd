import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import '@/styles/globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import ThemeToggle from '@/components/ThemeToggle';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'QuestEd',
  description: 'Your trusted platform for conducting and taking online exams. We provide a seamless experience for both educators and students.',
  openGraph: {
     siteName: 'Online Examination Portal',
    images: [
      {
        url: 'https://thumbs.dreamstime.com/b/flat-lay-composition-mouse-keyboard-phrase-online-exam-white-wooden-table-178226763.jpg',
        width: 1200,
        height: 630,
        alt: 'Online Examination Portal',
      }
    ],
    type: 'website',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
        <style>
          {`
            @media (max-width: 640px) {
              .main-nav {
                padding: 0.75rem 1rem;
                justify-content: space-between;
                width: 100%;
              }
              
              .nav-brand {
                display: flex;
                align-items: center;
                gap: 0.5rem;
              }
              
              .nav-brand i {
                font-size: 1.5rem;
              }
              
              .nav-brand .brand-text {
                font-size: 1.2rem;
              }
              
              .nav-links {
                display: flex;
                align-items: center;
                gap: 1.5rem;
              }
              
              .nav-link {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.1);
              }
              
              .nav-link i {
                font-size: 1.2rem;
              }
              
              .nav-link span {
                display: none;
              }
              
              .nav-actions {
                margin-left: 0.5rem;
              }
            }
          `}
        </style>
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <nav className="main-nav">
            <div className="nav-brand">
              <i className="fas fa-graduation-cap"></i>
              <span className="brand-text">
                Quest<span className="brand-highlight">ED</span>
              </span>
            </div>
            <div className="nav-links">
              <Link href="/" className="nav-link">
                <i className="fas fa-home"></i>
                <span>Home</span>
              </Link>
              <Link href="/login" className="nav-link">
                <i className="fas fa-sign-in-alt"></i>
                <span>Login</span>
              </Link>
              <Link href="/register" className="nav-link">
                <i className="fas fa-user-plus"></i>
                <span>Register</span>
              </Link>
              <div className="nav-actions">
                <ThemeToggle />
              </div>
            </div>
          </nav>
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
