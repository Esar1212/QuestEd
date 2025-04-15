'use client'
import { useState } from "react";

const CreateQuestionPaper = () => {
  const [questions, setQuestions] = useState([]);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [timeLimit, setTimeLimit] = useState("");
  const [classStream, setClassStream] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Update the addQuestion function to include marks
  const addQuestion = () => {
    setQuestions([...questions, { 
      question: "", 
      options: ["", "", "", ""], 
      answer: "", 
      marks: "" 
    }]);
  };

  const updateQuestion = (index, key, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][key] = value;
    setQuestions(updatedQuestions);
  };
  
   const deleteQuestion = (indexToDelete) => {
    setQuestions(questions.filter((_, index) => index !== indexToDelete));
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/createQuestionPaper", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, classStream, subject, totalMarks, timeLimit, questions }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create question paper");
      }

      setMessage("Question Paper Created Successfully!");
      alert("Question paper created successfully");
      setTitle("");
      setSubject("");
      setClassStream("");
      setTotalMarks("");
      setTimeLimit("");
      setQuestions([]);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      padding: '6rem 2rem 2rem 2rem',
      maxWidth: '1200px',
      margin: '0 auto',
      minHeight: '100vh',
      background: '#1a1a1a'
    }}>
      <h2 style={{
        fontSize: '2.5rem',
        color: 'white',
        marginBottom: '2rem',
        textAlign: 'center',
        fontWeight:'bolder'
      }}>Create Question Paper</h2>
      
      {message && <p style={{
        padding: '1rem',
        borderRadius: '8px',
        backgroundColor: message.includes('Error') ? '#fee2e2' : '#dcfce7',
        color: message.includes('Error') ? '#dc2626' : '#16a34a',
        marginBottom: '2rem',
        textAlign: 'center'
      }}>{message}</p>}
      
      <form onSubmit={handleSubmit} style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '16px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <input 
            type="text" 
            placeholder="Exam Title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              marginBottom: '1rem',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              fontSize: '1rem'
            }}
          />
          <input 
            type="text" 
            value={subject} 
            placeholder="Please enter the same subject name which you are teaching" 
            onChange={(e) => setSubject(e.target.value)} 
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              marginBottom: '1rem',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              fontSize: '1rem'
            }}
          />
          <input 
            type="text" 
            value={classStream} 
            placeholder="Class or Stream" 
            onChange={(e) => setClassStream(e.target.value)} 
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              marginBottom: '1rem',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              fontSize: '1rem'
            }}
          />
           <input 
            type="number" 
            value={totalMarks}
            min="1"
            placeholder="Enter total marks in this paper" 
            onChange={(e) => setTotalMarks(e.target.value)} 
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              marginBottom: '1rem',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              fontSize: '1rem'
            }}
          />
          <input 
            type="number" 
            min="0"
            placeholder="Time Limit (minutes)" 
            value={timeLimit} 
            onChange={(e) => setTimeLimit(e.target.value)} 
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              fontSize: '1rem'
            }}
          />
        </div>
      
        <h3 style={{
          fontSize: '1.5rem',
          color: '#2a5298',
          marginBottom: '1.5rem'
        }}>Questions</h3>
        
        {questions.map((q, index) => (
          <div key={index} style={{
            background: '#f8fafc',
            padding: '1.5rem',
            borderRadius: '12px',
            marginBottom: '1.5rem'
          }}>
            <input 
              type="text" 
              placeholder="Enter Question" 
              value={q.question} 
              onChange={(e) => updateQuestion(index, "question", e.target.value)} 
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                marginBottom: '1rem',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                fontSize: '1rem'
              }}
            />
            {q.options.map((opt, optIndex) => (
              <input 
                key={optIndex} 
                type="text" 
                placeholder={`Option ${optIndex + 1}`} 
                value={opt} 
                onChange={(e) => {
                  const newOptions = [...q.options];
                  newOptions[optIndex] = e.target.value;
                  updateQuestion(index, "options", newOptions);
                }} 
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  marginBottom: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  fontSize: '1rem'
                }}
              />
            ))}
            <input 
              type="text" 
              placeholder="Correct Answer" 
              value={q.answer} 
              onChange={(e) => updateQuestion(index, "answer", e.target.value)} 
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                fontSize: '1rem',
                backgroundColor: '#f0fdf4'
              }}
            />
                <input 
                  type="number" 
                  placeholder="Enter marks for this question" 
                  value={q.marks} 
                  onChange={(e) => updateQuestion(index, "marks", e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    marginTop: '0.75rem',
                    marginBottom: '1rem', // Added margin bottom for spacing
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    fontSize: '1rem',
                    backgroundColor: '#f0fdf4'
                  }}
                />
            
                
                <button
                  type="button"
                  onClick={() => deleteQuestion(index)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: '#dc2626',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    transition: 'all 0.2s ease',
                    marginTop: '0.5rem',
                    width: 'fit-content'
                  }}
                >
                  Delete Question
                </button>
              </div>
            ))}
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginTop: '2rem'
        }}>
          <button 
            type="button" 
            onClick={addQuestion}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              border: '2px solid #2a5298',
              backgroundColor: 'transparent',
              color: '#2a5298',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
          >Add Question</button>
          <button 
            type="submit" 
            disabled={loading}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#2a5298',
              color: 'white',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.3s ease'
            }}
          >{loading ? "Submitting..." : "Publish"}</button>
        </div>
      </form>
    </div>
  );
};

export default CreateQuestionPaper;
