import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import '@/styles/globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import ThemeToggle from '@/components/ThemeToggle';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Online Examination Panel',
  description: 'A platform for conducting online examinations',
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
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <nav className="main-nav">
            <div className="nav-brand">
              <i className="fas fa-graduation-cap"></i>
              <span className="brand-text">
                Quest<span className="brand-highlight">Ed</span>
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