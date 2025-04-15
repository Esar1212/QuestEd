// components/ErrorDisplay.jsx
export default function ErrorDisplay({ message }) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-red-50 p-6">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{message}</p>
          <a 
            href="/login" 
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Return to Login
          </a>
        </div>
      </div>
    );
  }