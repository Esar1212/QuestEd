// components/ResultsSummary.jsx
export default function ResultsSummary({ results }) {
    return (
      <div className="results-summary bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold text-lg mb-4">Recent Results</h3>
        {results.length === 0 ? (
          <p className="text-gray-500">No results available yet</p>
        ) : (
          <ul className="space-y-3">
            {results.map(result => (
              <li key={result.examId} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">{result.examName}</p>
                  <p className="text-sm text-gray-500">{new Date(result.date).toLocaleDateString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  result.score >= 70 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {result.score}%
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }