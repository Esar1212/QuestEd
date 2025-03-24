'use client';

import { useState } from 'react';
import { FaSearch, FaDownload, FaFilter, FaChartBar, FaUserGraduate } from 'react-icons/fa';

const results = [
  {
    id: 1,
    student: 'John Doe',
    exam: 'Mathematics Final',
    subject: 'Mathematics',
    score: 85,
    totalQuestions: 50,
    correctAnswers: 42,
    timeTaken: '1h 45m',
    date: '2024-03-20',
  },
  {
    id: 2,
    student: 'Jane Smith',
    exam: 'Physics Quiz',
    subject: 'Physics',
    score: 92,
    totalQuestions: 30,
    correctAnswers: 28,
    timeTaken: '45m',
    date: '2024-03-21',
  },
  {
    id: 3,
    student: 'Mike Johnson',
    exam: 'Chemistry Test',
    subject: 'Chemistry',
    score: 78,
    totalQuestions: 40,
    correctAnswers: 31,
    timeTaken: '1h 15m',
    date: '2024-03-22',
  },
  // Add more results as needed
];

export default function ResultsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedExam, setSelectedExam] = useState('all');

  const filteredResults = results.filter(result => {
    const matchesSearch = result.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         result.exam.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || result.subject === selectedSubject;
    const matchesExam = selectedExam === 'all' || result.exam === selectedExam;
    return matchesSearch && matchesSubject && matchesExam;
  });

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Exam Results</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
          <FaDownload className="mr-2" />
          Export Results
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search results..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="all">All Subjects</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
          </select>
          <select
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
          >
            <option value="all">All Exams</option>
            <option value="Mathematics Final">Mathematics Final</option>
            <option value="Physics Quiz">Physics Quiz</option>
            <option value="Chemistry Test">Chemistry Test</option>
          </select>
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center">
            <FaFilter className="mr-2" />
            Apply Filters
          </button>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Exam Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Performance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredResults.map((result) => (
              <tr key={result.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{result.student}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{result.exam}</div>
                    <div className="text-sm text-gray-500">{result.subject}</div>
                    <div className="text-xs text-gray-400">
                      {result.correctAnswers} / {result.totalQuestions} correct
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FaChartBar className="mr-2 text-blue-500" />
                    <span className="text-lg font-semibold text-gray-900">{result.score}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-500">
                    <FaUserGraduate className="mr-2" />
                    {result.timeTaken}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {result.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 