import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  type: { type: String, enum: ["mcq", "descriptive"], required: true },
  question: { type: String, required: true },
  // Only required for MCQ
  options: [{ type: String }],
  answer: { type: String, required: true },
  marks: { type: Number, required: true }
});

const QuestionPaperSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  timeLimit: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  classStream: { type: String, required: true },
  questions: [QuestionSchema] ,
  createdAt: { type: Date, default: Date.now }
});

// Check if model exists before defining it again (prevents OverwriteModelError)
const QuestionPaper = mongoose.models.QuestionPaper || mongoose.model("QuestionPaper", QuestionPaperSchema);

export default QuestionPaper;
