'use client'
import { useState } from "react";

// Add import for useRouter at the top
import { useRouter } from 'next/navigation';

const CreateQuestionPaper = () => {
  const [questions, setQuestions] = useState([]);
  const [title, setTitle] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [timeLimit, setTimeLimit] = useState("");
  const [classStream, setClassStream] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [pendingAdd, setPendingAdd] = useState(false);
  const router= useRouter();
 
  // Update the addQuestion function to include marks
  const addQuestion = () => {
    setShowTypeModal(true);
    setPendingAdd(true);
  };

  // New function to actually add the question after type selection
  const handleAddQuestionWithType = (type) => {
    const currentTotalMarks = calculateTotalQuestionMarks();
    const remainingMarks = parseInt(totalMarks) - currentTotalMarks;

    if (questions.length > 0) {
      const lastQuestion = questions[questions.length - 1];
      if (
        lastQuestion.type === "mcq" &&
        (!Array.isArray(lastQuestion.options) || !lastQuestion.options.includes(lastQuestion.answer))
      ) {
        alert("The correct answer must match one of the options in the previous question!");
        setShowTypeModal(false);
        setPendingAdd(false); // <-- add here
        return;
      }
    }

    if (remainingMarks <= 0) {
      alert("Cannot add more questions. Total marks limit reached!");
      setShowTypeModal(false);
      setPendingAdd(false); // <-- add here
      return;
    }

    if (type === "mcq") {
      setQuestions([...questions, { 
        type: "mcq",
        question: "", 
        options: ["", "", "", ""], 
        answer: "", 
        marks: "" 
      }]);
    } else {
      setQuestions([...questions, { 
        type: "descriptive",
        question: "", 
        answer: "", 
        marks: "" 
      }]);
    }
    setShowTypeModal(false);
    setPendingAdd(false); // <-- add here
  };

  const calculateTotalQuestionMarks = () => {
    return questions.reduce((sum, q) => sum + (parseInt(q.marks) || 0), 0);
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
    const currentTotalMarks = calculateTotalQuestionMarks();
    const remainingMarks = parseInt(totalMarks) - currentTotalMarks;

   if (questions.length > 0) {
  const lastQuestion = questions[questions.length - 1];
  if (
    lastQuestion.type === "mcq" &&
    (!Array.isArray(lastQuestion.options) || !lastQuestion.options.includes(lastQuestion.answer))
  ) {
    alert("The correct answer must match one of the options in the previous question!");
    return;
  }
}
    
    if (remainingMarks > 0) {
      alert("Cannot submit the question paper! Please add more questions to reach the total marks limit!");
      return;
    }
    setLoading(true);
    
    setMessage("");

    try {
       const subject=localStorage.getItem("subject");
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

  // Updated layout to ensure input fields are displayed in a vertical stack
  return (
    <div style={{
      padding: '6rem 2rem 2rem 2rem',
      width: '100%',
      margin: '0',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 100%)',
      animation: 'fadeIn 1.5s ease-in-out',
      fontFamily: 'Arial, sans-serif',
    }}>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes buttonHover {
            from { transform: scale(1); }
            to { transform: scale(1.05); }
          }
          button:hover {
            animation: buttonHover 0.3s ease-in-out;
          }
          .formGroup {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin-bottom: 2rem;
          }
          .inputField {
            background-color: #f0f0f0; /* Light grey background */
            border: 1px solid #d1d5db;
            border-radius: 8px;
            padding: 0.75rem;
            font-size: 1rem;
            margin-bottom: 1rem;
          }
          .inputField:focus {
            outline: none;
            border-color: #2a5298;
            box-shadow: 0 0 5px rgba(42, 82, 152, 0.5);
          }
          .heading {
            font-weight: bold;
            color: #2a5298; /* Dark blue color */
          }
          .animatedButton {
            transition: all 0.3s ease;
          }
          .animatedButton:hover {
            transform: scale(1.1);
          }
          .sectionHeading {
            font-weight: bold;
            color: #2a5298; /* Dark blue color */
            margin-bottom: 1.5rem;
            font-size: 1.8rem; /* Increased font size */
            text-decoration: underline; /* Underlined */
          }
          .questionGroup {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin-bottom: 2rem;
          }
        `}
      </style>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1600px',
        margin: '0 auto 2rem auto',
        width: '100%',
      }}>
        <button
          onClick={() => router.push('/teacher-dashboard')}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)',
          }}
        >
          ← Back to Dashboard
        </button>
      </div>

      <h2 style={{
        fontSize: '2.5rem',
        color: 'white',
        marginBottom: '2rem',
        textAlign: 'center',
        fontWeight: 'bolder',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
      }}>Create Question Paper</h2>

      <form onSubmit={handleSubmit} style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '16px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '1600px',
        margin: '0 auto',
        animation: 'fadeIn 1.5s ease-in-out',
      }}>
        <div className="formGroup">
          <label className="heading">Exam Title:</label>
          <input 
            type="text" 
            placeholder="Exam Title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required
            className="inputField"
          />
          
          <label className="heading">Class or Stream:</label>
          <input 
            type="text" 
            value={classStream} 
            placeholder="Please enter the class or the engineering stream in abbreviation" 
            onChange={(e) => setClassStream(e.target.value)} 
            required
            className="inputField"
          />
          <label className="heading">Total Marks:</label>
          <input 
            type="number" 
            min="0"
            placeholder="Enter the total marks in this question paper" 
            value={totalMarks} 
            onWheel={(e) => e.target.blur()}
            onChange={(e) => setTotalMarks(e.target.value)} 
            required
            className="inputField"
          />
          <label className="heading">Time Limit:</label>
          <input 
            type="number" 
            min="1"
            placeholder="Time Limit (minutes)" 
            value={timeLimit} 
            onWheel={(e) => e.target.blur()}
            onChange={(e) => setTimeLimit(e.target.value)} 
            required
            className="inputField"
          />
        </div>

        <h3 className="sectionHeading" >Questions</h3>

        {questions.map((q, index) => (
          <div key={index} className="questionGroup" style={{
            background: '#f8fafc',
            padding: '1.5rem',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            animation: 'fadeIn 0.5s ease-in-out',
          }}>
            <label className="heading">Question:</label>
            <input 
              type="text" 
              placeholder="Enter Question" 
              value={q.question} 
              onChange={(e) => updateQuestion(index, "question", e.target.value)} 
              required
              className="inputField"
            />
            {q.type === "mcq" ? (
              <>
                <label className="heading">Options:</label>
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
                    className="inputField"
                  />
                ))}
                <label className="heading">Type the correct answer here:</label>
                <input 
                  type="text" 
                  placeholder="Correct Answer" 
                  value={q.answer} 
                  onChange={(e) => updateQuestion(index, "answer", e.target.value)} 
                  required
                  className="inputField"
                />
              </>
            ) : (
              <>
                <label className="heading">Answer:</label>
                <textarea
                  placeholder="Type the answer here"
                  value={q.answer}
                  onChange={e => updateQuestion(index, "answer", e.target.value)}
                  required
                  className="inputField"
                  style={{ minHeight: "80px" }}
                />
              </>
            )}
            <label className="heading">Marks allotted:</label>
            <input 
              type="number" 
              placeholder="Enter marks for this question" 
              value={q.marks}
              min='1' 
              onWheel={(e) => e.target.blur()}
              onChange={(e) => updateQuestion(index, "marks", e.target.value)}
              required
              className="inputField"
            />
            <button
              type="button"
              onClick={() => deleteQuestion(index)}
              className="animatedButton"
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: '#dc2626',
                color: 'white',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500',
                marginTop: '0.5rem',
                width: 'fit-content',
              }}
            >
              Delete Question
            </button>
          </div>
        ))}

        <div style={{
          display: 'flex',
          gap: '1rem',
          marginTop: '2rem',
        }}>
          <button 
            type="button" 
            onClick={addQuestion}
            className="animatedButton"
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              border: '2px solid #2a5298',
              backgroundColor: 'transparent',
              color: '#2a5298',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
            }}
          >Add Question</button>
          <button 
            type="submit" 
            disabled={loading}
            className="animatedButton"
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#2a5298',
              color: 'white',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
              opacity: loading ? 0.7 : 1,
            }}
          >{loading ? "Submitting..." : "Publish"}</button>
        </div>
      </form>

      {showTypeModal && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "#fff",
            padding: "2rem",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            textAlign: "center"
          }}>
            <h3>Choose Question Type</h3>
            <button
              style={{
                margin: "1rem",
                padding: "0.75rem 1.5rem",
                borderRadius: "8px",
                border: "2px solid #2a5298",
                backgroundColor: "#2a5298",
                color: "#fff",
                fontWeight: "bold",
                cursor: "pointer"
              }}
              onClick={() => handleAddQuestionWithType("mcq")}
            >
              MCQ
            </button>
            <button
              style={{
                margin: "1rem",
                padding: "0.75rem 1.5rem",
                borderRadius: "8px",
                border: "2px solid #2a5298",
                backgroundColor: "#fff",
                color: "#2a5298",
                fontWeight: "bold",
                cursor: "pointer"
              }}
              onClick={() => handleAddQuestionWithType("descriptive")}
            >
              Descriptive
            </button>
            <div>
              <button
                style={{
                  marginTop: "1rem",
                  background: "none",
                  border: "none",
                  color: "#dc2626",
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
                onClick={() => { setShowTypeModal(false); setPendingAdd(false); }} // <-- already present here
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateQuestionPaper;
