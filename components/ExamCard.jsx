// components/ExamCard.jsx
export default function ExamCard({ exam, onSelect }) {
    return (
      <div 
        className="exam-card bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow cursor-pointer"
        onClick={onSelect}
      >
        <h3 className="font-semibold text-lg">{exam.subject}</h3>
        <div className="mt-2 text-sm text-gray-600">
          <p>Date: {new Date(exam.date).toLocaleDateString()}</p>
          <p>Time: {exam.time}</p>
          <p>Duration: {exam.duration} minutes</p>
        </div>
        <div className="mt-3 flex justify-between items-center">
          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
            {exam.status || 'Upcoming'}
          </span>
          <button 
            className="text-sm text-blue-600 hover:underline"
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
          >
            View Details
          </button>
        </div>
      </div>
    );
  }