'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

interface Exam {
  id: string;
  title: string;
  duration: string;
  totalQuestions: number;
}

const ExamList: React.FC = () => {
  const router = useRouter();

  // This is mock data - in a real application, this would come from an API or database
  const exams: Exam[] = [
    {
      id: '1',
      title: 'JavaScript Fundamentals',
      duration: '60 minutes',
      totalQuestions: 30,
    },
    {
      id: '2',
      title: 'React Development',
      duration: '90 minutes',
      totalQuestions: 45,
    },
    {
      id: '3',
      title: 'Node.js Basics',
      duration: '75 minutes',
      totalQuestions: 35,
    },
  ];

  const handleStartExam = (examId: string) => {
    // In a real application, you would check if the user is logged in
    // and then navigate to the exam page
    router.push(`/exam/${examId}`);
  };

  return (
    <div className="exam-list">
      {exams.map((exam) => (
        <div key={exam.id} className="exam-card">
          <h3>{exam.title}</h3>
          <p>Duration: {exam.duration}</p>
          <p>Total Questions: {exam.totalQuestions}</p>
          <button 
            className="start-exam-btn"
            onClick={() => handleStartExam(exam.id)}
          >
            Start Exam
          </button>
        </div>
      ))}
    </div>
  );
};

export default ExamList;
